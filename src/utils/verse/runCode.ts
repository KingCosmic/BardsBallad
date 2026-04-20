import showModal from './showModal'
import { Script } from '@/types/script';
import wrapWithTrackingEnhanced from '@/utils/object/wrapWithTracking';
import { AsyncJsonProcessor } from './asyncJsonProcessor';
import { Instruction } from '@bardsballad/verse';

export interface ChangeOperation {
  type: 'set' | 'delete' | 'array';
  path: string;
  value?: any;
  arrayOp?: {
    method: string;
    args: any[];
  };
}

export type ChangesMap = Map<string, ChangeOperation[]>;

interface ScriptResult<T> {
  success: boolean, error?: string, result?: T, cacheKey: string,
  invalidatedPaths: string[], changesMap: ChangesMap
}

const getCacheKey = (script: Script, context: any, tracker: Set<string>) => {
  // Build a base key for the script
  let baseScriptKey = ''
  try {
    baseScriptKey = typeof script.compiled === 'string' ? String(script.compiled) : JSON.stringify(script.compiled)
  } catch (e) {
    baseScriptKey = String(script.compiled)
  }

  // Build a cache key from the script identity + values of accessed paths
  const depValues: Record<string, any> = {}
  for (const p of tracker) {
    const segs = p.split('.').filter(Boolean)
    let cur: any = context
    for (const s of segs) {
      if (cur == null) { cur = undefined; break }
      cur = cur[s]
    }
    depValues[p] = cur
  }

  return 'script:' + baseScriptKey + '::' + JSON.stringify(depValues)
}

// Core execution function without state updates
const executeScript = async <T>(
cacheKey: string | undefined, script: Script, context: Record<string, any>, cache: Map<string, any>, tracker: Set<string> = new Set<string>(), invalidatedPaths: string[] = [], changesMap: ChangesMap): Promise<ScriptResult<T>> => {
  try {
    const input = wrapWithTrackingEnhanced(Object.assign({}, context, {
      floor: Math.floor,
      openModal: showModal,
      getCalculation: async (calc: any) => {
        if (!calc._type || calc._type !== 'Calculation') return calc

        const path = calc._path

        if (!path) return calc

        if (cache.has(path)) {
          const cached = cache.get(path);
          return cached.result !== undefined ? cached.result : cached;
        }
        
        if (calc.isManual) {
          cache.set(path, { result: calc.value, dependentPaths: [] });
          return calc.value;
        }

        // Create a new tracker for this calculation's dependencies
        const calcTracker = new Set<string>();
        const calcInvalidatedPaths: string[] = [];
        
        // Recursively call executeScript (not runCode) to avoid state updates
        const output = await executeScript(undefined, calc.script, context, cache, calcTracker, calcInvalidatedPaths, changesMap);
        
        // Store with its own dependencies
        cache.set(path, { 
          result: output.result,
          dependentPaths: Array.from(calcTracker)
        });
        
        // Also add these dependencies to the parent tracker
        calcTracker.forEach(dep => tracker.add(dep));
        
        return output.result;
      }
    }), [], tracker, invalidatedPaths, changesMap)

    if (cacheKey && cacheKey !== '' && cache.has(cacheKey)) {
      const cached = cache.get(cacheKey)
      return { success: true, error: undefined, result: cached.result, cacheKey, invalidatedPaths, changesMap }
    }

    if (!Array.isArray(script.compiled)) {
      return { success: false, error: typeof script.compiled === 'string' ? script.compiled : 'Invalid compiled script', result: undefined, cacheKey: '', invalidatedPaths, changesMap }
    }

    const processor = new AsyncJsonProcessor(input);
    const result = await processor.process(script.compiled as Instruction[]);

    cacheKey = getCacheKey(script, context, tracker)

    // store in cache along with dependent paths for later invalidation
    cache.set(cacheKey, { result, dependentPaths: Array.from(tracker) })

    return { success: true, error: undefined, result, cacheKey, invalidatedPaths, changesMap }
  } catch (error: any) {
    console.log(error)
    return { success: false, error: error.message, result: undefined, cacheKey: '', invalidatedPaths, changesMap }
  }
}

// Main entry point that handles state updates
const runCode = async <T>(
  cacheKey: string | undefined,
  script: Script,
  context: Record<string, any>,
  updateState: any = () => {},
  cache: Map<string, any>,
  tracker: Set<string> = new Set<string>(),
  invalidatedPaths: string[] = [],
  changesMap: ChangesMap = new Map()
): Promise<ScriptResult<T>> => {
  const result = await executeScript<T>(cacheKey, script, context, cache, tracker, invalidatedPaths, changesMap);
  
  await updateState(changesMap);
  
  return result;
}

export default runCode