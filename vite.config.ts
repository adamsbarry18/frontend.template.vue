import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    dedupe: ['@storybook/client-api'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'MyDesignSystem',
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
    },
  },
  esbuild: {
    keepNames: true,
  },
});
