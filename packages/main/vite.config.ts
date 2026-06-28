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
        'path',
        'fs',
        'crypto',
        'os',
      ],
    },
    target: 'node18',
    sourcemap: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
});