export function createMemoryStore() {
  const data = new Map()
  return {
    async set(service, account, secret) {
      if (typeof service !== 'string' || typeof account !== 'string') {
        throw new Error('account')
      }
      if (typeof secret !== 'string' || secret.length === 0) {
        throw new Error('seed')
      }
      data.set(service + '\n' + account, secret)
    },
    async get(service, account) {
      const secret = data.get(service + '\n' + account)
      if (typeof secret !== 'string') {
        throw new Error('seed')
      }
      return secret
    },
  }
}
