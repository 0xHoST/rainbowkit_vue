export {}
declare module '@vue/runtime-core' {
  interface ReadonlyArray<T> {
    groupBy(getKey: (item: T) => string): Record<string, Array<T>>
    indexBy(getKey: (item: T) => string): Record<string, T>
  }

  interface Array<T> {
    groupBy(getKey: (item: T) => string): Record<string, Array<T>>
    indexBy(getKey: (item: T) => string): Record<string, T>
  }
}
declare global {
  interface ReadonlyArray<T> {
    groupBy(getKey: (item: T) => string): Record<string, Array<T>>
    indexBy(getKey: (item: T) => string): Record<string, T>
  }

  interface Array<T> {
    groupBy(getKey: (item: T) => string): Record<string, Array<T>>
    indexBy(getKey: (item: T) => string): Record<string, T>
  }
}

