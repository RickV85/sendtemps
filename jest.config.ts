import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

export default async (): Promise<Config> => {
  // Resolve the base Next.js jest configuration (SWC transform, moduleNameMapper, etc.)
  const nextConfig = await (createJestConfig({}) as () => Promise<Config>)();

  const sharedProjectConfig: Partial<Config> = {
    moduleNameMapper: {
      // Next.js-generated mappers (CSS modules, static assets, etc.) come first,
      // then the project-specific path alias so it can override if needed.
      ...nextConfig.moduleNameMapper,
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    transform: nextConfig.transform,
    transformIgnorePatterns: [
      '/node_modules/(?!(openai|@neondatabase/serverless|msw|@mswjs|@open-draft|rettime|until-async)/)',
    ],
  };

  return {
    collectCoverageFrom: [
      'src/**/*.{ts,tsx}',
      '!src/**/*.d.ts',
      '!src/test/**',
      '!src/**/__tests__/**',
    ],
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    coverageReporters: ['html', 'lcov', 'text'],
    coverageThreshold: {
      './src/app/Classes/**': {
        branches: 80,
        statements: 80,
      },
      './src/app/api/**': {
        branches: 70,
        statements: 70,
      },
      './src/app/lib/**': {
        branches: 80,
        statements: 80,
      },
      './src/app/Util/**': {
        branches: 80,
        statements: 80,
      },
      global: {
        branches: 60,
        statements: 60,
      },
    },
    projects: [
      {
        ...sharedProjectConfig,
        displayName: 'jsdom',
        setupFiles: ['<rootDir>/jest.polyfills.ts'],
        testEnvironment: 'jsdom',
        testEnvironmentOptions: {
          customExportConditions: ['node', 'node-addons', 'require', 'default'],
        },
        testMatch: ['<rootDir>/src/**/__tests__/**/*.{ts,tsx}', '<rootDir>/src/**/*.test.{ts,tsx}'],
        testPathIgnorePatterns: [
          '/node_modules/',
          '/.next/',
          '<rootDir>/src/app/api/',
          '<rootDir>/src/middleware.test.ts',
        ],
      },
      {
        ...sharedProjectConfig,
        displayName: 'node',
        testEnvironment: 'node',
        testMatch: ['<rootDir>/src/app/api/**/*.test.ts', '<rootDir>/src/middleware.test.ts'],
      },
    ],
  };
};
