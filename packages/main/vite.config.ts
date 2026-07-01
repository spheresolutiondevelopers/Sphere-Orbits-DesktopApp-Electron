import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'index',
      formats: ['cjs'],
    },
    outDir: 'dist',
    rollupOptions: {
      external: [
        'electron',
        'better-sqlite3',
        'keytar',
        'electron-store',
        'axios',
        'path',
        'fs',
        'crypto',
        'os',
        'url',
        'node:crypto',
        'node:path',
        'node:fs',
        'node:process',
        '@sphere/data',
        '@sphere/domain',
        '@sphere/shared',
      ],
    },
    target: 'node18',
    sourcemap: true,
    commonjsOptions: {
      include: [/node_modules/],
      extensions: ['.js', '.cjs', '.mjs'],
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
    '__dirname': '""', // Add this to prevent __dirname errors
  },
});