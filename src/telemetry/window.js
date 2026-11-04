export function createWindow(size) {
  if (!Number.isInteger(size) || size <= 0) {
    throw new Error('size')
  }
  const samples = []
  return {
    push(value) {
      if (typeof value !== 'number' || !Number.isFinite(value)) {
        throw new Error('sample')
      }
      samples.push(value)
      if (samples.length > size) {
        samples.shift()
      }
    },
    mean() {
      if (samples.length === 0) {
        return 0
      }
      const total = samples.reduce((sum, item) => sum + item, 0)
      return total / samples.length
    },
  }
}
