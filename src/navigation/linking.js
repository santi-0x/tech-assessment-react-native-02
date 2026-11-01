import { ROUTES } from './routes.js'

export const linking = {
  prefixes: ['harbor://'],
  config: {
    screens: {
      [ROUTES.Send]: {
        path: 'pay',
      },
    },
  },
}
