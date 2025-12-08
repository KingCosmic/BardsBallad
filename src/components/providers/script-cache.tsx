import { createContext, PropsWithChildren, useContext, useRef } from 'react';

const CacheContext = createContext<{
  cache: Map<string, any>, invalidateCacheByPaths: (paths: string[]) => void
}>({ cache: new Map(), invalidateCacheByPaths: () => {} });

export default function ScriptCacheProvider({ children }: PropsWithChildren) {
  // Keep the cache instance stable across renders so cached script
  // results persist until explicitly invalidated.
  const cache = useRef<Map<string, any>>(new Map());

  const invalidateCacheByPaths = (_changedPaths: string[]) => {
    // for (const [key, val] of Array.from(cache.current.entries())) {
    //   if (!val || !val.dependentPaths) continue
    //   const deps: string[] = val.dependentPaths
    //   for (const cp of changedPaths) {
    //     // ignore our base rc function path
    //     if (cp === 'rc') continue
    //     for (const dp of deps) {
    //       if (dp === cp || dp.startsWith(cp) || cp.startsWith(dp)) {
    //         console.log(dp, cp)
    //         cache.current.delete(key)
    //         break
    //       }
    //     }
    //     if (!cache.current.has(key)) break
    //   }
    // }
    cache.current.clear()
  }

  return (
    <CacheContext.Provider value={{ cache: cache.current, invalidateCacheByPaths }}>
      {children}
    </CacheContext.Provider>
  );
}

export const useScriptCache = () => useContext(CacheContext)