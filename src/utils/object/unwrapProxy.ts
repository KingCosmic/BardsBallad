export default function unwrapProxy(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  
  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => unwrapProxy(item));
  }
  
  // Handle objects
  const unwrapped: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      unwrapped[key] = unwrapProxy(obj[key]);
    }
  }
  return unwrapped;
}