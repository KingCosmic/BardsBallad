import { VerseScriptCompiler } from '@bardsballad/verse';
import { createContext, useContext } from "react";

export const CompilerContext = createContext<VerseScriptCompiler>(new VerseScriptCompiler());

export const useCompiler = () => {
  return useContext(CompilerContext);
};