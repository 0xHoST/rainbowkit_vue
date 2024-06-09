
function isObject (obj: any): obj is object {
    return obj !== null && typeof obj === 'object' && !Array.isArray(obj)
}

export function mergeDeep (
    source: Record<string, any> = {},
    target: Record<string, any> = {},
    arrayFn?: (a: unknown[], b: unknown[]) => unknown[],
  ) {
    const out: Record<string, any> = {}
  
    for (const key in source) {
      out[key] = source[key]
    }
  
    for (const key in target) {
      const sourceProperty = source[key]
      const targetProperty = target[key]

      if (isObject(sourceProperty) && isObject(targetProperty)){
        out[key] = mergeDeep(sourceProperty, targetProperty, arrayFn)
        continue;
      }
  
      if (Array.isArray(sourceProperty) && Array.isArray(targetProperty) && arrayFn) {
        out[key] = arrayFn(sourceProperty, targetProperty);
        continue
      }
      out[key] = targetProperty;
    }
  
    return out;
  }