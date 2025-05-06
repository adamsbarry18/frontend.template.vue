import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import { fileURLToPath } from 'url';

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8080,
  },
  resolve: {
    dedupe: ['@storybook/client-api'],
    alias: {
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        'src/index.ts'
      ),
      name: 'frontend.template.vue3',
    },
    rollupOptions: {
      external: [
        /^@storybook\//,
        'element-plus',
        'element-plus/lib/locale/lang/fr',
        'element-plus/lib/locale/lang/en',
        'element-plus/lib/locale',
        'vue',
      ],
      output: {
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
        },
      },
    },
  },
  esbuild: {
    keepNames: true,
  },
});
