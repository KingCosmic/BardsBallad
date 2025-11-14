import { VerseScriptCompiler } from '@bardsballad/verse'

export default (compiler: VerseScriptCompiler, code: string) => {
  try {
    return compiler.compile(code);
  } catch (error: any) {
    console.error('Compilation error:', error);
  }
}