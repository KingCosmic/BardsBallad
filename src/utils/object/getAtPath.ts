export default function getAtPath(obj: Record<string, any>, path: string) {
  if (!path || path === '') return obj;
  
  // Handle array/bracket notation: "inventory[0].name" or "items['key']"
  const segments = parsePath(path);
  
  return segments.reduce((current, key) => {
    if (current == null) return undefined;
    return current[key];
  }, obj);
}

function parsePath(path: string) {
  // Convert path string to array of keys
  // "inventory[0].name" -> ["inventory", "0", "name"]
  // "items['special-key']" -> ["items", "special-key"]
  
  const segments = [];
  let current = '';
  let inBracket = false;
  
  for (let i = 0; i < path.length; i++) {
    const char = path[i];
    
    if (char === '[') {
      if (current) {
        segments.push(current);
        current = '';
      }
      inBracket = true;
    } else if (char === ']') {
      if (current) {
        // Remove quotes if present
        if ((current[0] === '"' || current[0] === "'") && 
            current[0] === current[current.length - 1]) {
          current = current.slice(1, -1);
        }
        segments.push(current);
        current = '';
      }
      inBracket = false;
    } else if (char === '.' && !inBracket) {
      if (current) {
        segments.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }
  
  if (current) {
    segments.push(current);
  }
  
  return segments;
}