import type {Config} from '@jest/types';

// Or async function
const config =  async (): Promise<Config.InitialOptions> => {
  return {
    verbose: true,
    testEnvironment: 'jsdom'
  }
}

export default config