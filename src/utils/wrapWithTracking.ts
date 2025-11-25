const IS_PROXY = Symbol("isTrackedProxy");
const PATH = Symbol("_path")

function wrapArrayMethods(arr: any[], path: string[], invalidatedPaths?: string[]) {
  const pathString = path.join('.');
  
  const invalidateArray = () => {
    if (invalidatedPaths && !invalidatedPaths.includes(pathString)) {
      // Only invalidate the array path, not individual elements
      invalidatedPaths.push(pathString);
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
    return result;
  };

  arr.pop = function() {
    const result = originalPop.apply(this);
    invalidateArray();
    return result;
  };

  arr.shift = function() {
    const result = originalShift.apply(this);
    invalidateArray();
    return result;
  };

  arr.unshift = function(...items: any[]) {
    const result = originalUnshift.apply(this, items);
    invalidateArray();
    return result;
  };

  arr.splice = function(start: number, deleteCount?: number, ...items: any[]) {
    const result = originalSplice.apply(this, [start, deleteCount, ...items] as any);
    invalidateArray();
    return result;
  };

  arr.sort = function(compareFn?: (a: any, b: any) => number) {
    const result = originalSort.apply(this, compareFn ? [compareFn] : []);
    invalidateArray();
    return result;
  };

  arr.reverse = function() {
    const result = originalReverse.apply(this);
    invalidateArray();
    return result;
  };

  arr.fill = function(value: any, start?: number, end?: number) {
    const result = originalFill.apply(this, [value, start, end] as any);
    invalidateArray();
    return result;
  };

  arr.copyWithin = function(target: number, start: number, end?: number) {
    const result = originalCopyWithin.apply(this, [target, start, end] as any);
    invalidateArray();
    return result;
  };
}

// Enhanced wrapper that handles arrays
export default function wrapWithTrackingEnhanced(
  rootObj: any,
  basePath: string[] = [],
  tracker: Set<string>,
  invalidatedPaths?: string[]
) {
  // If already wrapped, return it
  if (rootObj && rootObj[IS_PROXY]) return rootObj;
  
  // Wrap array methods if it's an array
  if (Array.isArray(rootObj) && invalidatedPaths) {
    wrapArrayMethods(rootObj, basePath, invalidatedPaths);
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

      // ⭐ Define utility properties that should never be tracked
      const isUtilityProp = (
        propName === 'constructor' ||
        propName === 'hasOwnProperty' ||
        propName === 'then' ||
        propName === 'toJSON' ||
        propName === 'valueOf' ||
        propName === 'toString' ||
        typeof value === 'function'
      );

      // ⭐ At top level, skip known injected utilities
      const isTopLevelUtility = (
        basePath.length === 0 && (
          propName === 'floor' ||
          propName === 'openModal' ||
          propName === 'getCalculation'
        )
      );

      const shouldSkipTracking = isUtilityProp || isTopLevelUtility;

      // ⭐ MOVED UP: Check if value is already proxied and has a PATH
      if (value && value[IS_PROXY]) {
        // Even though it's already proxied, track the access using its stored PATH
        if (tracker && !shouldSkipTracking) {
          const existingPath = value[PATH] || value._path || pathString;
          tracker.add(existingPath);
        }
        return value;
      }
      
      // 🔥 DO NOT wrap promises
      if (value && typeof value === "object" && typeof value.then === "function") {
        if (tracker && propName !== 'constructor') {
          tracker.add(value[PATH] || value._path || pathString);
        }
        return value;
      }
      
      // Wrap nested objects/arrays so child accesses are tracked too
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
        
        // ⭐ Track arrays (they're often the final value being used)
        // But DON'T track plain objects (they're usually just traversal)
        if (Array.isArray(value) && tracker && !shouldSkipTracking) {
          const actualPath = existingPath || pathString;
          tracker.add(actualPath);
        }
        
        // Wrap array methods for nested arrays
        if (Array.isArray(value) && invalidatedPaths) {
          wrapArrayMethods(value, actualPathArray, invalidatedPaths);
        }
        
        const wrappedValue = wrapWithTrackingEnhanced(value, actualPathArray, tracker, invalidatedPaths);
        
        // ⭐ Only define PATH if object is extensible and doesn't already have it
        if (!value[PATH] && !existingPath && Object.isExtensible(value)) {
          try {
            Object.defineProperty(value, PATH, {
              value: actualPathArray.join('.'),
              writable: false,
              enumerable: false,
              configurable: true
            });
          } catch (e) {
            // Silently fail if we can't define the property
            // This can happen with special objects like VM contexts
          }
        }
        
        return wrappedValue;
      }
      
      // ✅ ONLY track leaf values (primitives) - actual data access
      if (tracker && !shouldSkipTracking) {
        tracker.add(pathString);
      }
      
      return value;
    },

    set(target: Record<string | symbol, any>, prop, newValue) {
      const propName = String(prop);
      const path = [...basePath, propName];
      const pathString = path.join('.');

      // Set the value
      target[prop] = newValue;

      // Invalidate cache for this path
      if (invalidatedPaths && !invalidatedPaths.includes(pathString)) {
        invalidatedPaths.push(pathString)
      }

      return true;
    },

    deleteProperty(target: Record<string | symbol, any>, prop) {
      const propName = String(prop);
      const path = [...basePath, propName];
      const pathString = path.join('.');

      delete target[prop];

      if (invalidatedPaths && !invalidatedPaths.includes(pathString)) {
        invalidatedPaths.push(pathString)
      }

      return true;
    }
  });
}