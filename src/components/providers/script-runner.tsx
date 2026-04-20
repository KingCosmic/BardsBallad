// ScriptRunnerContext.tsx
import React, { createContext, useContext, useState } from 'react'
import { Script } from '@/types/script'
import runCode from '@/utils/verse/runCode'
import { useScriptCache } from './script-cache'

interface ScriptResult<T> {
  success: boolean
  error?: string
  result?: T,
  cacheKey: string
}

interface ScriptRunnerContextType {
  runScript: <T>(cacheKey: string | undefined, compiled: Script, context: Record<string, any>, updateState: (state: any) => void) => Promise<ScriptResult<T>>
  isReady: boolean
}

const ScriptRunnerContext = createContext<ScriptRunnerContextType | null>(null)

export function ScriptRunnerProvider({ children }: { children: React.ReactNode }) {
  const [isReady] = useState(true)

  const { cache, invalidateCacheByPaths } = useScriptCache() 

  async function runScript<T>(
    cacheKey: string | undefined,
    compiled: Script,
    context: Record<string, any>,
    updateState: (state: any) => void,
  ): Promise<ScriptResult<T>> {
    const output = await runCode<T>(cacheKey, compiled, context, updateState, cache)

    invalidateCacheByPaths(output.invalidatedPaths)

    return output
  }

  return (
    <ScriptRunnerContext.Provider value={{ runScript, isReady }}>
      {children}
    </ScriptRunnerContext.Provider>
  )
}

export function useScriptRunner() {
  const context = useContext(ScriptRunnerContext)
  if (!context) {
    throw new Error('useScriptRunner must be used within ScriptRunnerProvider')
  }
  return context
}