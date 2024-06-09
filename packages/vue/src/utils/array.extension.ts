if (!Array.prototype.groupBy) {
  Array.prototype.groupBy = function groupBy<T>(
    this: ReadonlyArray<T>,
    getKey: (item: T) => string
  ) {
    const groupedItems: Record<string, Array<T>> = {}

    for (const item of this) {
      const key = getKey(item)

      if (!key) {
        continue
      }

      if (!groupedItems[key]) {
        groupedItems[key] = []
      }

      groupedItems[key].push(item)
    }

    return groupedItems
  }
}

if (!Array.prototype.indexBy) {
  Array.prototype.indexBy = function indexBy<T>(
    this: ReadonlyArray<T>,
    getKey: (item: T) => string
  ) {
    const indexedItems: Record<string, T> = {}
    for (const item of this) {
      const key = getKey(item)

      if (!key) {
        continue
      }

      indexedItems[key] = item
    }

    return indexedItems
  }
}
