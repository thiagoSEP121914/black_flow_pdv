import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',

  extensionsToTreatAsEsm: ['.ts'],

  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: 'tsconfig.json',
    },
  },

  moduleNameMapper: {
    // 👇 ESSENCIAL pra NodeNext
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};

export default config;
