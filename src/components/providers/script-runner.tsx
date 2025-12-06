// ScriptRunnerContext.tsx
import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import Sandbox from '@nyariv/sandboxjs'
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
  const [isReady, setIsReady] = useState(false)
  const vmRef = useRef<Sandbox | null>(null)

  const { cache, invalidateCacheByPaths } = useScriptCache() 

  useEffect(() => {
    let mounted = true

    async function initVM() {
      try {      
        if (!mounted) return
        
        vmRef.current = new Sandbox()
        setIsReady(true)
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


  async function runScript<T>(
    cacheKey: string | undefined,
    compiled: Script,
    context: Record<string, any>,
    updateState: (state: any) => void,
  ): Promise<ScriptResult<T>> {
    const vm = vmRef.current
    if (!vm) {
      return { success: false, error: 'VM not initialized', cacheKey: '' }
    }

    const output = await runCode<T>(cacheKey, vm, compiled, context, updateState, cache)

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