import Modal from '@components/Modal';
import ModalBody from '@components/Modal/Body';
import ModalFooter from '@components/Modal/Footer';
import ModalHeader from '@components/Modal/Header';

import { useEffect, useRef, useState } from 'react';
import { signal } from '@preact/signals-react'

import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import Button from '@components/inputs/Button';
import { closeModal } from '@state/modals';
import { Script } from '@/types/script';
import { BUILTIN_TYPES, Type, VerseScriptCompiler } from '@bardsballad/verse';
import { SystemType, TypeData } from '@storage/schemas/system';
import Sandbox from '@nyariv/sandboxjs';
import parse from '@nyariv/sandboxjs/dist/node/parser';

// Set up Monaco workers
self.MonacoEnvironment = {
  getWorker() {
    return new editorWorker()
  },
};

// Register a custom language
monaco.languages.register({ id: 'verse' });

// Set syntax highlighting
monaco.languages.setMonarchTokensProvider('verse', {
  // Set defaultToken to invalid to see what you do not tokenize yet
  defaultToken: 'invalid',
  
  keywords: [
    'if', 'else', 'while', 'function', 'fn', 'return', 'let', 'const',
    'for', 'break', 'continue', 'true', 'false', 'null'
  ],
  
  typeKeywords: [
    'number', 'string', 'bool', 'array', 'interface', 'void'
  ],
  
  operators: [
    '=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=',
    '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%',
    '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=',
    '%='
  ],
  
  // Common regular expressions
  symbols: /[=><!~?:&|+\-*/^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  
  // The main tokenizer
  tokenizer: {
    root: [
      // Identifiers and keywords
      [/[a-z_$][\w$]*/, {
        cases: {
          '@typeKeywords': 'type',
          '@keywords': 'keyword',
          '@default': 'identifier'
        }
      }],
      
      [/[A-Z][\w$]*/, 'type.identifier'], // Type names (PascalCase)
      
      // Whitespace
      { include: '@whitespace' },
      
      // Delimiters and operators
      [/[{}()[\]]/, '@brackets'],
      [/[<>](?!@symbols)/, '@brackets'],
      [/@symbols/, {
        cases: {
          '@operators': 'operator',
          '@default': ''
        }
      }],
      
      // Numbers
      [/\d*\.\d+([eE][-+]?\d+)?/, 'number.float'],
      [/0[xX][0-9a-fA-F]+/, 'number.hex'],
      [/\d+/, 'number'],
      
      // Delimiter: after number because of .\d floats
      [/[;,.]/, 'delimiter'],
      
      // Strings
      [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-terminated string
      [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
      
      // Characters
      [/'[^\\']'/, 'string'],
      [/(')(@escapes)(')/, ['string', 'string.escape', 'string']],
      [/'/, 'string.invalid']
    ],
    
    comment: [
      [/[^/*]+/, 'comment'],
      [/\/\*/, 'comment', '@push'],
      ["\\*/", 'comment', '@pop'],
      [/[/*]/, 'comment']
    ],
    
    string: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
    ],
    
    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/\/\/.*$/, 'comment'],
    ],
  },
});

// Define language configuration
monaco.languages.setLanguageConfiguration('verse', {
  comments: {
    lineComment: '//',
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')']
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  folding: {
    markers: {
      start: new RegExp('^\\s*//\\s*#?region\\b'),
      end: new RegExp('^\\s*//\\s*#?endregion\\b')
    }
  }
});

const typeSystem = signal<{
  variables: Record<string, Type>,
  functions: Record<string, {
    returnType: Type,
    parameters: Array<{ name: string, type: Type }>,
    description?: string
  }>
}>({ variables: {}, functions: {} })

// Helper function to resolve type from a chain like "config.api.url"
function resolveType(chain: string) {
  const parts = chain.split('.');
  let current = typeSystem.value.variables[parts[0]];
  
  if (!current) return null;
  
  for (let i = 1; i < parts.length; i++) {
    // Handle array element access (arrays give you their element type)
    if (current.kind === 'array') {
      current = current.elementType!
      // Don't consume the part, as we're just unwrapping the array
      continue;
    }
    
    // if there are no properties that match this, then just return the current
    if (!current.properties || !current.properties[parts[i]]) {
      return current;
    }
    
    current = current.properties[parts[i]];
  }
  
  return current;
}

// Register completion provider
monaco.languages.registerCompletionItemProvider('verse', {
  provideCompletionItems: (model, position) => {
    const textUntilPosition = model.getValueInRange({
      startLineNumber: position.lineNumber,
      startColumn: 1,
      endLineNumber: position.lineNumber,
      endColumn: position.column
    });

    const word = model.getWordUntilPosition(position);
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn
    };

    // Match property access chains: "config.api.headers."
    // Also handles array access: "users[0]."
    const chainMatch = textUntilPosition.match(/([\w.]+(?:\[\d+\])?)\.\s*\w*$/);
    
    if (chainMatch) {
      // Remove array indices and split into parts
      const chain = chainMatch[1].replace(/\[\d+\]/g, '');
      const typeInfo = resolveType(chain);
      
      if (typeInfo) {
        // If it's an array, show element type properties
        if (typeInfo.kind === 'array' && typeInfo.elementType) {
          return {
            suggestions: Object.entries(typeInfo.elementType!.properties ?? {}).map(([key, value]) => ({
              label: key,
              kind: monaco.languages.CompletionItemKind.Property,
              documentation: `Type: ${value.kind}`,
              detail: value.kind,
              insertText: key,
              range: range
            }))
          };
        }
        
        // If it's an object, show its properties
        if (typeInfo.kind === 'object' && typeInfo.properties) {
          return {
            suggestions: Object.entries(typeInfo.properties).map(([key, value]) => ({
              label: key,
              kind: monaco.languages.CompletionItemKind.Property,
              documentation: `Type: ${value.kind}`,
              detail: value.kind === 'array' ? `${value.elementType?.name}[]` : value.name,
              insertText: key,
              range: range
            }))
          };
        }
        
        // If it's an array of primitives, show array methods
        if (typeInfo.kind === 'array') {
          return {
            suggestions: [
              {
                label: 'length',
                kind: monaco.languages.CompletionItemKind.Property,
                documentation: 'Array length',
                detail: 'number',
                insertText: 'length',
                range: range
              },
              {
                label: 'push',
                kind: monaco.languages.CompletionItemKind.Method,
                documentation: 'Add element to array',
                insertText: 'push(${1})',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: range
              }
            ]
          };
        }
      }
    }

    // Root-level completions (no dot access)
    const suggestions = Object.entries(typeSystem.value.variables).map(([name, info]) => {
      let kind = monaco.languages.CompletionItemKind.Variable;
      let detail: string = info.kind;
      
      if (info.kind === 'array') {
        kind = monaco.languages.CompletionItemKind.Variable;
        detail = `${info.elementType}[]`;
      }
      
      return {
        label: name,
        kind: kind,
        documentation: `Type: ${detail}`,
        detail: detail,
        insertText: name,
        range: range
      };
    });

    // Add function completions to root-level suggestions
    const functionSuggestions = Object.entries(typeSystem.value.functions).map(([name, info]) => ({
      label: name,
      kind: monaco.languages.CompletionItemKind.Function,
      documentation: info.description || `Returns ${info.returnType.kind}`,
      detail: `${info.returnType.kind} ${name}(${info.parameters.map(p => `${p.name}: ${p.type.kind}`).join(', ')})`,
      insertText: `${name}(${info.parameters.map((p, i) => `\${${i + 1}:${p.name}}`).join(', ')})`,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range
    }));

    return { suggestions: [...suggestions, ...functionSuggestions] };
  },

  // IMPORTANT: Trigger on dot character!
  triggerCharacters: ['.']
});

// Hover provider for nested access
monaco.languages.registerHoverProvider('verse', {
  provideHover: (model, position) => {
    const word = model.getWordAtPosition(position);
    if (!word) return;

    // Check if it's a function
    const funcInfo = typeSystem.value.functions[word.word];
    if (funcInfo) {
      const params = funcInfo.parameters.map(p => `${p.name}: ${p.type.kind}`).join(', ');
      return {
        contents: [
          { value: `**function ${word.word}**(${params}): \`${funcInfo.returnType.kind}\`` },
          { value: funcInfo.description || 'No description available' }
        ]
      };
    }

    // Get the full line to extract the chain
    const line = model.getLineContent(position.lineNumber);
    const beforeWord = line.substring(0, position.column - 1);
    
    // Extract the full chain up to the current position
    const chainMatch = beforeWord.match(/([\w.]+(?:\[\d+\])?)$/);
    
    if (chainMatch) {
      const chain = chainMatch[1].replace(/\[\d+\]/g, '');
      const typeInfo = resolveType(chain);
      
      if (typeInfo) {
        let typeDisplay: string = typeInfo.kind;
        if (typeInfo.kind === 'array' && typeInfo.elementType) {
          typeDisplay = `${typeInfo.elementType}[]`;
        }
        
        return {
          contents: [
            { value: `**Type**: \`${typeDisplay}\`` },
            { value: 'No description available' }
          ]
        };
      }
    }
    
    // Fallback to root-level variables
    const varInfo = typeSystem.value.variables[word.word];
    if (varInfo) {
      let typeDisplay: string = varInfo.kind;
      if (varInfo.kind === 'array' && varInfo.elementType) {
        typeDisplay = `${varInfo.elementType}[]`;
      }
      
      return {
        contents: [
          { value: `**${word.word}**: \`${typeDisplay}\`` }
        ]
      };
    }
  }
});

// Optional: Define a custom theme for Verse
monaco.editor.defineTheme('verse-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'keyword', foreground: 'C586C0', fontStyle: 'bold' },
    { token: 'type', foreground: '4EC9B0' },
    { token: 'type.identifier', foreground: '4EC9B0' },
    { token: 'identifier', foreground: '9CDCFE' },
    { token: 'string', foreground: 'CE9178' },
    { token: 'number', foreground: 'B5CEA8' },
    { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
    { token: 'operator', foreground: 'D4D4D4' },
  ],
  colors: {
    'editor.background': '#0f172a',
  }
});

interface Global {
  name: string;
  type: string;
  isArray: boolean;
}

interface FunctionDefinition {
  name: string;
  returnType: string;
  parameters: Array<{ name: string, type: string, isArray?: boolean }>;
  description?: string;
}

interface Props {
  id: number,
  types: SystemType[],
  expectedType: string,
  code: Script,
  onSave(result: { result: Script, returnType: string }): void,
  globals: Global[]
  functions?: FunctionDefinition[]
}

function parseType(type: string) {
  const isArray = type.endsWith('[]')

  return { name: isArray ? type.slice(0, -2) : type, isArray }
}

function compareTypes(typeA: string, typeB: string) {
  const a = parseType(typeA)
  const b = parseType(typeB)

  // both same type and arrays.
  if ((a.name === b.name) && (a.isArray && b.isArray)) {
    return true
  }

  // at least one is typed any, and they're both arrays.
  if ((a.name === 'any' || b.name === 'any') && (a.isArray && b.isArray)) {
    return true
  }

  // same name and not arrays
  if ((a.name === b.name) && (!a.isArray && !b.isArray)) {
    return true
  }

  // at least one is typed any and not arrays
  if ((a.name === 'any' || b.name === 'any') && (!a.isArray && !b.isArray)) {
    return true
  }

  return false
}

function typeToCompilerType(compiledTypes: Record<string, Type>, types: SystemType[], type: TypeData): Type {
  
  let t:Type;
  switch (type.type) {
    case 'string':
      t = BUILTIN_TYPES.string
      break;
    case 'number':
      t = BUILTIN_TYPES.number
      break
    case 'boolean':
      t = BUILTIN_TYPES.boolean
      break
    default:
      let neededType = types.find(t => t.name === type.type)
      t = neededType ?
        createCompilerType(compiledTypes, types, neededType.name, neededType.properties) :
        BUILTIN_TYPES.unknown
  }

  return type.isArray ? VerseScriptCompiler.createArrayType(t!) : t!
}

function createCompilerType(compiledTypes: Record<string, Type>, types: SystemType[], name: string, properties: {
  key: string;
  typeData: {
    type: string;
    options?: string[] | undefined;
    gen?: any;
    useTextArea?: boolean | undefined;
    isArray?: boolean | undefined;
    outputType?: string | undefined;
    isOutputAnArray?: boolean | undefined;
    inputs?: any[] | undefined;
  };
}[]): Type {
  const props: Record<string, any> = {}
  properties.forEach(p => {
    props[p.key] = typeToCompilerType(compiledTypes, types, p.typeData)
  })

  const type = VerseScriptCompiler.createObjectType(name, props)
  compiledTypes[name] = type

  return type
}

export default function ScriptEditor({ id, types, code, expectedType, onSave, globals }: Props) {

  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
	const monacoEl = useRef(null);
  const compileTimeRef = useRef<any>(null);
  const [result, setResult] = useState<Script>(code);
  const [returnType, setReturnType] = useState('unknown')
  const compiler = useRef<VerseScriptCompiler | null>();

  const g: Global[] = [
    { name: 'character', type: 'CharacterData', isArray: false },
    { name: 'system', type: 'SystemData', isArray: false },
    { name: 'page', type: 'PageData', isArray: false },
    ...globals
  ]

  const vmRef = useRef<Sandbox | null>(null)
  
  useEffect(() => {
    let mounted = true

    async function initVM() {
      try {      
        if (!mounted) return
        
        vmRef.current = new Sandbox()
      } catch (error) {
        console.error('Failed to initialize QuickJS:', error)
      }
    }

    initVM()

    return () => {
      mounted = false
      if (vmRef.current) {
        vmRef.current = null
      }
    }
  }, [])

	useEffect(() => {
		if (monacoEl) {
			setEditor((editor) => {
				if (editor) return editor;

				const ed = monaco.editor.create(monacoEl.current!, {
					value: result.source,
          language: 'verse',
          theme: 'verse-dark',
          automaticLayout: true,
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: 'on',
          roundedSelection: false,
          padding: { top: 10, bottom: 10 }
				});

        const compiledTypes: Record<string, Type> = { ...BUILTIN_TYPES }
        for (let t = 0; t < types.length; t++) {
          const type = types[t]
          if (compiledTypes[type.name]) continue
          createCompilerType(compiledTypes, types, type.name, type.properties)
        }

        const context: Record<string, Type> = {}
        g.forEach(global => {
          const type = compiledTypes[global.type] ?? BUILTIN_TYPES.unknown
          context[global.name] = global.isArray ? VerseScriptCompiler.createArrayType(type) : type
        })

        // In your useEffect where you set up the compiler
        const functions = {
          'openModal': {
            returnType: BUILTIN_TYPES.unknown,
            parameters: [
              // type: string, title: string, value: any
              { name: 'type', type: BUILTIN_TYPES.string },
              { name: 'title', type: BUILTIN_TYPES.string },
              { name: 'value', type: BUILTIN_TYPES.unknown }
            ],
            description: 'Open a modal of {type} and await its return',
            isAsync: true
          },
          'getCalculation': {
            returnType: BUILTIN_TYPES.unknown,
            parameters: [
              // type: string, title: string, value: any
              { name: 'calc', type: BUILTIN_TYPES.unknown },
            ],
            description: 'returns the calculated value of a Calculation type',
            isAsync: true
          },
          'floor': {
            returnType: BUILTIN_TYPES.number,
            parameters: [
              { name: 'number', type: BUILTIN_TYPES.number }
            ],
            description: 'Round a float down to the nearest integer',
            isAsync: false
          },
          'random': {
            returnType: BUILTIN_TYPES.number,
            parameters: [
              { name: 'min', type: BUILTIN_TYPES.number },
              { name: 'max', type: BUILTIN_TYPES.number }
            ],
            description: 'Returns a random number between min and max',
            isAsync: false
          }
          // Add more functions...
        };

        typeSystem.value = {
          variables: context,
          functions
        }

        // register compiler with variables
        compiler.current = new VerseScriptCompiler(context)

        for (const [name, func] of Object.entries(functions)) {
          compiler.current!.registerFunction(name, func.parameters.map(p => p.type), func.returnType, func.isAsync);
        }

        for (const [name, type] of Object.entries(compiledTypes)) {
          compiler.current!.registerType(name, type)
        }

        function compileAndAnalyze() {
          const code = ed.getValue();
          
          try {
            const result = compiler.current!.compile(code);
            console.log(result.code)
            if (!vmRef.current) return
            setResult({
              isCorrect: result.success ? compareTypes(result.returnType!, expectedType) : false,
              source: code,
              compiled: result.success ?
                parse(`
                  async function rc() {
                    ${result.code!}
                  }
                  return rc()
                `)
                : result.error!,
              blueprint: { nodes: [], edges: [] }
            });
            setReturnType(result.success ? result.returnType! : 'unknown')
          } catch (error: any) {
            console.error('Compilation error:', error);
          }
        }

        // Compile on change
        ed.onDidChangeModelContent(() => {
          clearTimeout(compileTimeRef.current!);
          compileTimeRef.current = setTimeout(() => {
            compileAndAnalyze();
          }, 500);
        });
        compileAndAnalyze()

        return ed
      });
		}

		return () => {
      // if (compileTimeRef.current) clearTimeout(compileTimeRef.current);
      // if (compiler.current) compiler.current = null
      editor?.dispose();
    }
	}, [monacoEl.current]);

  return (
    <Modal>
      <ModalHeader title='Script Editor' onClose={() => closeModal(id)} />

      <ModalBody className='p-0 h-[60vh] grid grid-rows-[auto_1fr]'>
        {/* Type Info Bar */}
        <div className={`px-6 py-3 border-b flex items-center gap-4 transition-colors ${
          result.isCorrect 
            ? 'bg-green-950/30 border-green-900/50'
            : 'bg-orange-950/30 border-orange-900/50'
        }`}>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400 font-medium">Expected:</span>
            <span className="text-green-400 font-mono font-semibold bg-green-500/10 px-2.5 py-1 rounded border border-green-500/30">
              {expectedType}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400 font-medium">Current:</span>
            <span className={`font-mono font-semibold px-2.5 py-1 rounded border transition-colors ${
              result.isCorrect 
                ? 'text-green-400 bg-green-500/10 border-green-500/30'
                : 'text-orange-400 bg-orange-500/10 border-orange-500/30'
            }`}>
              {returnType}
            </span>
          </div>
          <div className={`flex items-center gap-1.5 ml-auto text-sm transition-colors ${
            result.isCorrect ? 'text-green-400' : 'text-orange-400'
          }`}>
            <span>{result.isCorrect ?  '✓': '⚠'}</span>
            <span>{result.isCorrect ? 'Types match' : 'Type mismatch'}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-[1fr_auto] min-h-0 overflow-hidden">
          
          {/* Editor Section */}
          <div className="grid grid-rows-[auto_1fr] min-h-0">
            
            {/* Tabs */}
            <div className="flex gap-1 px-6 pt-3 bg-slate-800">
              <button className="px-4 py-2 bg-slate-900 text-gray-200 text-sm font-medium rounded-t-md">
                Code
              </button>
              <button className="px-4 py-2 text-gray-400 text-sm font-medium rounded-t-md hover:bg-slate-700 hover:text-gray-300 transition-all">
                Documentation
              </button>
            </div>

            {/* Code Editor */}
            <div className="bg-slate-900 overflow-y-auto font-mono text-sm leading-relaxed">
              <div id='editor' ref={monacoEl} className='w-full h-full' />
            </div>
          </div>

          {/* Sidebar */}
          {!sidebarCollapsed && (
            <div className="w-72 bg-slate-700 border-l border-slate-600 flex flex-col overflow-hidden">
              
              {/* Sidebar Header */}
              <div className="px-4 py-4 border-b border-slate-600 flex items-center justify-between">
                <span className="text-gray-200 text-sm font-semibold">Available Globals</span>
                <button 
                  onClick={() => setSidebarCollapsed(true)}
                  className="text-gray-400 text-lg px-1 rounded hover:bg-slate-600 hover:text-gray-200 transition-all"
                >
                  →
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="overflow-y-auto p-3">
                {g.map((global, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-slate-800 rounded-md mb-2 border border-slate-600 hover:bg-slate-750 hover:border-slate-500 transition-all cursor-pointer"
                  >
                    <div className="text-blue-400 text-sm font-semibold font-mono mb-1">
                      {global.name}
                    </div>
                    <div className="text-gray-400 text-xs font-mono">
                      {global.type}{global.isArray ? '[]' : ''}
                    </div>
                    <div className="text-gray-300 text-[11px] mt-1.5 leading-snug">
                      coming soon~
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Collapsed Sidebar Toggle */}
          {sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="w-8 bg-slate-700 border-l border-slate-600 flex items-center justify-center text-gray-400 hover:bg-slate-600 hover:text-gray-200 transition-all"
            >
              ←
            </button>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <div className='flex justify-end items-center w-full'>
          <Button color='primary' onClick={() => {
            onSave({ result, returnType })
            closeModal(id)
          }}>Save Script</Button>
        </div>
      </ModalFooter>
    </Modal>
  )
}