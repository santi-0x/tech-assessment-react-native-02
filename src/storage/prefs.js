const CURRENCIES = ['USD', 'EUR']
const THEMES = ['system', 'light', 'dark']

export function createPrefs(storage) {
  return {
    async getCurrency() {
      const value = await storage.getItem('currency')
      if (value == null || value === '') {
        return 'USD'
      }
      if (!CURRENCIES.includes(value)) {
        throw new Error('currency')
      }
      return value
    },
    async setCurrency(code) {
      if (!CURRENCIES.includes(code)) {
        throw new Error('currency')
      }
      await storage.setItem('currency', code)
    },
    async getTheme() {
      const value = await storage.getItem('theme')
      if (value == null || value === '') {
        return 'system'
      }
      if (!THEMES.includes(value)) {
        throw new Error('theme')
      }
      return value
    },
    async setTheme(theme) {
      if (!THEMES.includes(theme)) {
        throw new Error('theme')
      }
      await storage.setItem('theme', theme)
    },
  }
}
