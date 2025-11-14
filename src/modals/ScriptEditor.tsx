import Modal from '@components/Modal';
import ModalBody from '@components/Modal/Body';
import ModalFooter from '@components/Modal/Footer';
import ModalHeader from '@components/Modal/Header';

import { useEffect, useRef, useState } from 'react';

import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import Button from '@components/inputs/Button';
import { closeModal } from '@state/modals';
import { Script } from '@/types/script';
import { BUILTIN_TYPES, Type, VerseScriptCompiler } from '@bardsballad/verse';
import { SystemType, TypeData } from '@storage/schemas/system';

// Setup Monaco workers
self.MonacoEnvironment = {
  getWorker() {
    return new editorWorker()
  },
};

// Register custom language
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
      [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
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

// Register autocomplete provider
monaco.languages.registerCompletionItemProvider('verse', {
  provideCompletionItems: (model: any, position: any) => {
    const word = model.getWordUntilPosition(position);
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn
    };
    
    const suggestions = [
      // Keywords
      {
        label: 'fn',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'fn ${1:functionName}(${2:params}) -> ${3:ReturnType} {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Define a function',
        range: range
      },
      {
        label: 'if',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'if (${1:condition}) {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'If statement',
        range: range
      },
      {
        label: 'else',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'else {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Else statement',
        range: range
      },
      {
        label: 'while',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'while (${1:condition}) {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'While loop',
        range: range
      },
      {
        label: 'const',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'const ${1:name}: ${2:type} = ${3:value}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Constant declaration',
        range: range
      },
      {
        label: 'let',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'let ${1:name}: ${2:type} = ${3:value}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Variable declaration',
        range: range
      },
      {
        label: 'return',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'return ${1:value}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Return statement',
        range: range
      },
      // Types
      {
        label: 'string',
        kind: monaco.languages.CompletionItemKind.TypeParameter,
        insertText: 'string',
        documentation: 'String type',
        range: range
      },
      {
        label: 'number',
        kind: monaco.languages.CompletionItemKind.TypeParameter,
        insertText: 'number',
        documentation: 'Number type',
        range: range
      },
      {
        label: 'bool',
        kind: monaco.languages.CompletionItemKind.TypeParameter,
        insertText: 'bool',
        documentation: 'Boolean type',
        range: range
      },
      {
        label: 'array',
        kind: monaco.languages.CompletionItemKind.TypeParameter,
        insertText: 'array',
        documentation: 'Array type',
        range: range
      },
      {
        label: 'null',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'null',
        documentation: 'Null value',
        range: range
      },
      {
        label: 'interface',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'interface ${1:Name} {\n\t$0\n}',
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        documentation: 'Interface definition',
        range: range
      },
      // Common patterns
      {
        label: 'true',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'true',
        documentation: 'Boolean true',
        range: range
      },
      {
        label: 'false',
        kind: monaco.languages.CompletionItemKind.Keyword,
        insertText: 'false',
        documentation: 'Boolean false',
        range: range
      },
    ];
    
    return { suggestions: suggestions };
  }
});

// Register hover provider for documentation
monaco.languages.registerHoverProvider('verse', {
  provideHover: (model: any, position: any) => {
    const word = model.getWordAtPosition(position);
    if (!word) return null;
    
    const hoverDocs: Record<string, string> = {
      'fn': 'Define a function with optional parameters and return type',
      'if': 'Conditional statement',
      'else': 'Alternative branch for if statement',
      'while': 'Loop while condition is true',
      'const': 'Declare a constant (immutable) variable',
      'let': 'Declare a mutable variable',
      'return': 'Return a value from a function',
      'string': 'Text data type',
      'number': 'Numeric data type',
      'bool': 'Boolean data type (true/false)',
      'array': 'Collection data type',
      'null': 'Represents absence of value',
      'interface': 'Define a structural type',
    };
    
    const doc = hoverDocs[word.word];
    if (doc) {
      return {
        range: new monaco.Range(
          position.lineNumber,
          word.startColumn,
          position.lineNumber,
          word.endColumn
        ),
        contents: [
          { value: `**${word.word}**` },
          { value: doc }
        ]
      };
    }
    
    return null;
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

interface Props {
  id: number,
  types: SystemType[],
  expectedType: string,
  code: Script,
  onSave(result: { result: Script, returnType: string }): void,
  globals: Global[]
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

  // atleast one is type any and they're both arrays.
  if ((a.name === 'any' || b.name === 'any') && (a.isArray && b.isArray)) {
    return true
  }

  // same name and not arrays
  if ((a.name === b.name) && (!a.isArray && !b.isArray)) {
    return true
  }

  // atleast one is type any and not arrays
  if ((a.name === 'any' || b.name === 'any') && (!a.isArray && !b.isArray)) {
    return true
  }

  return false
}

function typeToCompilerType(compiledTypes: Map<string, Type>, types: SystemType[], type: TypeData): Type {
  
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

function createCompilerType(compiledTypes: Map<string, Type>, types: SystemType[], name: string, properties: {
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
  compiledTypes.set(name, type)

  return type
}

export default function ScriptEditor({ id, types, code, expectedType, onSave, globals }: Props) {

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
	const monacoEl = useRef(null);
  const compileTimeRef = useRef<any>(null);
  const [result, setResult] = useState<Script>(code);
  const [returnType, setReturnType] = useState('unknown')
  const compiler = useRef<VerseScriptCompiler | null>();

  const g: Global[] = [
    // { name: 'Character', type: 'Character', isArray: false },
    // { name: 'SystemData', type: 'SystemData', isArray: false },
    // { name: 'PageData', type: 'PageData', isArray: false },
    ...globals
  ]

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

        const compiledTypes = new Map<string, Type>(Object.entries(BUILTIN_TYPES))
        for (let t = 0; t < types.length; t++) {
          const type = types[t]
          if (compiledTypes.has(type.name)) continue
          createCompilerType(compiledTypes, types, type.name, type.properties)
        }

        const context: Record<string, Type> = {}
        g.forEach(global => {
          const type = compiledTypes.has(global.type) ? compiledTypes.get(global.type)! : BUILTIN_TYPES.unknown
          context[global.name] = global.isArray ? VerseScriptCompiler.createArrayType(type) : type
        })

        // register compiler with variables
        compiler.current = new VerseScriptCompiler(context)

        for (const [name, type] of compiledTypes) {
          compiler.current!.registerType(name, type)
        }

        function compileAndAnalyze() {
          const code = ed.getValue();
          
          try {
            const result = compiler.current!.compile(code);
            setResult({
              isCorrect: result.success ? compareTypes(result.returnType!, expectedType) : false,
              source: code,
              compiled: result.success ? result.code! : result.error!,
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
          }}>Save Script</Button>
        </div>
      </ModalFooter>
    </Modal>
  )
}