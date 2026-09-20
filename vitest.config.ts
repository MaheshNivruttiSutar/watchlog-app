import dotenv from 'dotenv';
import { defineConfig } from 'vitest/config';
dotenv.config();

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [
      './src/__tests__/browserSetup.ts',
      './src/__tests__/setup.ts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/__tests__/**',
        'src/debug/**',
        'src/i18n/**',
        'src/remote/**',
        'src/styles/**',
        'src/index.ts',
        'src/main.tsx',
        'src/types/**',
        'src/vite-env.d.ts',
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
});
