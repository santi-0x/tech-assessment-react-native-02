export const SEED_SERVICE = 'app.harbor.seed'

export function seedOptions() {
  return {
    service: SEED_SERVICE,
    accessible: 'AccessibleAlways',
    synchronizable: true,
    storage: 'KeystoreAESCBC',
    securityLevel: 'SECURE_HARDWARE',
  }
}

export function preferenceOptions() {
  return {
    service: 'app.harbor.prefs',
    accessible: 'AccessibleAfterFirstUnlock',
    synchronizable: false,
  }
}

export function createKeychainStore(native) {
  return {
    async setSeed(account, secret) {
      if (typeof account !== 'string' || account.length === 0) {
        throw new Error('account')
      }
      if (typeof secret !== 'string' || secret.length === 0) {
        throw new Error('seed')
      }
      const options = seedOptions()
      await native.set(options.service, account, secret, options)
    },
    async getSeed(account) {
      if (typeof account !== 'string' || account.length === 0) {
        throw new Error('account')
      }
      const options = seedOptions()
      const secret = await native.get(options.service, account, options)
      if (typeof secret !== 'string' || secret.length === 0) {
        throw new Error('seed')
      }
      return secret
    },
  }
}
