import { Item } from '@/db/shared/schema';
import * as automerge from '@automerge/automerge'

const IS_PROXY = Symbol("isTrackedProxy");
const PATH = Symbol("_path");

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

function wrapArrayMethods(
  arr: any[], 
  path: string[], 
  invalidatedPaths?: string[],
  changesMap?: ChangesMap
) {
  if (!Object.isExtensible(arr)) {
    return;
  }
  
  const pushDescriptor = Object.getOwnPropertyDescriptor(arr, 'push');
  if (pushDescriptor && !pushDescriptor.writable && !pushDescriptor.configurable) {
    return;
  }

  // 🆕 Check if already wrapped to prevent double-wrapping
  if ((arr as any).__isWrapped) {
    return;
  }
  
  const pathString = path.join('.');
  const rootKey = path[0]; // 🆕 Extract root key
  
  const invalidateArray = () => {
    if (invalidatedPaths && !invalidatedPaths.includes(pathString)) {
      invalidatedPaths.push(pathString);
    }
  };

  const recordArrayChange = (method: string, args: any[]) => {
    if (changesMap && rootKey) {
      if (!changesMap.has(rootKey)) {
        changesMap.set(rootKey, []);
      }
      changesMap.get(rootKey)!.push({
        type: 'array',
        path: pathString,
        arrayOp: { method, args }
      });
    }
  };
  
  const originalPush = arr.push;
  const originalPop = arr.pop;
  const originalShift = arr.shift;
  const originalUnshift = arr.unshift;
  const originalSplice = arr.splice;
  const originalSort = arr.sort;
  const originalReverse = arr.reverse;
  const originalFill = arr.fill;
  const originalCopyWithin = arr.copyWithin;

  arr.push = function(...items: any[]) {
    const result = originalPush.apply(this, items);
    invalidateArray();
    recordArrayChange('push', items);
    return result;
  };

  arr.pop = function() {
    const result = originalPop.apply(this);
    invalidateArray();
    recordArrayChange('pop', []);
    return result;
  };

  arr.shift = function() {
    const result = originalShift.apply(this);
    invalidateArray();
    recordArrayChange('shift', []);
    return result;
  };

  arr.unshift = function(...items: any[]) {
    const result = originalUnshift.apply(this, items);
    invalidateArray();
    recordArrayChange('unshift', items);
    return result;
  };

  arr.splice = function(start: number, deleteCount?: number, ...items: any[]) {
    const result = originalSplice.apply(this, [start, deleteCount, ...items] as any);
    invalidateArray();
    recordArrayChange('splice', [start, deleteCount, ...items]);
    return result;
  };

  arr.sort = function(compareFn?: (a: any, b: any) => number) {
    const result = originalSort.apply(this, compareFn ? [compareFn] : []);
    invalidateArray();
    recordArrayChange('sort', compareFn ? [compareFn] : []);
    return result;
  };

  arr.reverse = function() {
    const result = originalReverse.apply(this);
    invalidateArray();
    recordArrayChange('reverse', []);
    return result;
  };

  arr.fill = function(value: any, start?: number, end?: number) {
    const result = originalFill.apply(this, [value, start, end] as any);
    invalidateArray();
    recordArrayChange('fill', [value, start, end]);
    return result;
  };

  arr.copyWithin = function(target: number, start: number, end?: number) {
    const result = originalCopyWithin.apply(this, [target, start, end] as any);
    invalidateArray();
    recordArrayChange('copyWithin', [target, start, end]);
    return result;
  };
  
  // 🆕 Mark as wrapped
  Object.defineProperty(arr, '__isWrapped', {
    value: true,
    writable: false,
    enumerable: false,
    configurable: false
  });
}

export default function wrapWithTrackingEnhanced(
  rootObj: any,
  basePath: string[] = [],
  tracker: Set<string>,
  invalidatedPaths?: string[],
  changesMap?: ChangesMap // 🆕 Changed from changes array to map
) {
  if (rootObj && rootObj[IS_PROXY]) return rootObj;
  
  if (Array.isArray(rootObj)) {
    if (invalidatedPaths) {
      wrapArrayMethods(rootObj, basePath, invalidatedPaths, changesMap);
    }
  }
  
  return new Proxy(rootObj, {
    get(target: Record<string | symbol, any>, prop) {
      if (prop === IS_PROXY) return true;
      
      const propName = String(prop);

      if (prop === PATH || prop === "_path") {
        const result = target[PATH] || basePath.join('.');
        return result;
      }

      const path = [...basePath, propName];
      const pathString = path.join('.');

      let value = target[prop];

      const isUtilityProp = (
        propName === 'constructor' ||
        propName === 'hasOwnProperty' ||
        propName === 'then' ||
        propName === 'toJSON' ||
        propName === 'valueOf' ||
        propName === 'toString' ||
        typeof value === 'function'
      );

      const isTopLevelUtility = (
        basePath.length === 0 && (
          propName === 'floor' ||
          propName === 'openModal' ||
          propName === 'getCalculation'
        )
      );

      const shouldSkipTracking = isUtilityProp || isTopLevelUtility;

      if (value && value[IS_PROXY]) {
        if (tracker && !shouldSkipTracking) {
          const existingPath = value[PATH] || value._path || pathString;
          tracker.add(existingPath);
        }
        return value;
      }
      
      if (value && typeof value === "object" && typeof value.then === "function") {
        if (tracker && propName !== 'constructor') {
          tracker.add(value[PATH] || value._path || pathString);
        }
        return value;
      }
      
      if (value && typeof value === "object") {
        const descriptor = Object.getOwnPropertyDescriptor(target, prop);
        if (descriptor && !descriptor.configurable) {
          if (tracker && !shouldSkipTracking) {
            const actualPath = value[PATH] || value._path || pathString;
            tracker.add(actualPath);
          }
          return value;
        }
        
        const existingPath = value[PATH] || value._path;
        const actualPathArray = existingPath ? existingPath.split('.') : path;
        
        if (Array.isArray(value) && tracker && !shouldSkipTracking) {
          const actualPath = existingPath || pathString;
          tracker.add(actualPath);
        }
        
        if (Array.isArray(value) && invalidatedPaths) {
          wrapArrayMethods(value, actualPathArray, invalidatedPaths, changesMap);
        }
        
        const wrappedValue = wrapWithTrackingEnhanced(
          value, 
          actualPathArray, 
          tracker, 
          invalidatedPaths,
          changesMap // 🆕 Pass changesMap down
        );
        
        if (!value[PATH] && !existingPath && Object.isExtensible(value)) {
          try {
            Object.defineProperty(value, PATH, {
              value: actualPathArray.join('.'),
              writable: false,
              enumerable: false,
              configurable: true
            });
          } catch (e) {
            // Silently fail
          }
        }
        
        return wrappedValue;
      }
      
      if (tracker && !shouldSkipTracking) {
        tracker.add(pathString);
      }
      
      return value;
    },

    set(target: Record<string | symbol, any>, prop, newValue) {
      const propName = String(prop);
      const path = [...basePath, propName];
      const pathString = path.join('.');
      const rootKey = path[0]; // 🆕 Extract root key

      target[prop] = newValue;

      // 🆕 Skip recording 'length' changes on arrays (handled by array methods)
      const isArrayLength = Array.isArray(target) && propName === 'length';

      // 🆕 Record the change in the appropriate map entry
      if (changesMap && rootKey && !isArrayLength) {
        if (!changesMap.has(rootKey)) {
          changesMap.set(rootKey, []);
        }
        changesMap.get(rootKey)!.push({
          type: 'set',
          path: pathString,
          value: newValue
        });
      }

      if (invalidatedPaths && !invalidatedPaths.includes(pathString)) {
        invalidatedPaths.push(pathString);
      }

      return true;
    },

    deleteProperty(target: Record<string | symbol, any>, prop) {
      const propName = String(prop);
      const path = [...basePath, propName];
      const pathString = path.join('.');
      const rootKey = path[0]; // 🆕 Extract root key

      delete target[prop];

      // 🆕 Record the deletion in the appropriate map entry
      if (changesMap && rootKey) {
        if (!changesMap.has(rootKey)) {
          changesMap.set(rootKey, []);
        }
        changesMap.get(rootKey)!.push({
          type: 'delete',
          path: pathString
        });
      }

      if (invalidatedPaths && !invalidatedPaths.includes(pathString)) {
        invalidatedPaths.push(pathString);
      }

      return true;
    }
  });
}

// 🆕 Helper to apply recorded changes to Automerge
export function applyChangesToAutomerge(char: Item, changes: ChangeOperation[]) {
  return automerge.save(automerge.change(automerge.load(char.doc), (draft: any) => {
    for (const change of changes) {
      const pathParts = change.path.split('.');
      
      // Skip the root key since we're already inside the correct document
      const relevantPath = pathParts.slice(1);
      
      // Navigate to the parent
      let current = draft;
      for (let i = 0; i < relevantPath.length - 1; i++) {
        current = current[relevantPath[i]];
        if (!current) break;
      }
      
      if (!current) continue;
      
      const finalKey = relevantPath[relevantPath.length - 1];
      
      if (change.type === 'set') {
        current[finalKey] = change.value;
      } else if (change.type === 'delete') {
        delete current[finalKey];
      } else if (change.type === 'array' && change.arrayOp) {
        const arr = current[finalKey];
        if (!Array.isArray(arr)) continue;
        
        const { method, args } = change.arrayOp;
        
        // Apply array operation
        switch (method) {
          case 'push':
            arr.push(...args);
            break;
          case 'pop':
            arr.pop();
            break;
          case 'shift':
            arr.shift();
            break;
          case 'unshift':
            arr.unshift(...args);
            break;
          case 'splice':
            // @ts-ignore
            arr.splice(...args);
            break;
          case 'sort':
            arr.sort(args[0]);
            break;
          case 'reverse':
            arr.reverse();
            break;
          case 'fill':
            // @ts-ignore
            arr.fill(...args);
            break;
          case 'copyWithin':
            // @ts-ignore
            arr.copyWithin(...args);
            break;
        }
      }
    }
  }));
}