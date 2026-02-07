/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',

  extensionsToTreatAsEsm: ['.ts'],

  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        diagnostics: {
          ignoreCodes: [151002],
        },
      },
    ],
  },

  moduleNameMapper: {
    // 👇 ESSENCIAL pra NodeNext
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  // Ignora testes de integração por padrão (use npm run test:int para rodar)
  testPathIgnorePatterns: [
    '/node_modules/',
    '\\.int\\.spec\\.ts$',
    'db\\.test\\.ts$',
  ],

  globalSetup: './tests/setup/global-setup.ts',
  globalTeardown: './tests/setup/global-teardown.ts',
};

module.exports = config;
