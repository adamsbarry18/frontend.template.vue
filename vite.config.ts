import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dns from 'dns';
import path from 'path';
import { fileURLToPath } from 'url';

const proxyTarget = process.env.API_URL || 'https://localhosht:8000';

dns.setDefaultResultOrder('verbatim');

export default defineConfig(({ mode }) => {
  const isDevBuild = mode === 'development';
  return {
    plugins: [vue()],
    resolve: {
      dedupe: ['@storybook/client-api'],
      alias: {
        '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
      },
      extensions: ['.js', '.json', '.vue', '.ts'],
    },
    build: {
      sourcemap: isDevBuild ? true : 'hidden',
      lib: {
        entry: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src/index.ts'),
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
    server: {
      port: 8080,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          cookieDomainRewrite: {
            '*': '',
          },
        },
      },
    },
    preview: {
      port: 8080,
    },
    esbuild: {
      keepNames: true,
    },
    test: {
      globals: true,
      isolate: true,
      environment: 'happy-dom',
      reporters: ['default', 'junit', 'html'],
      outputFile: {
        junit: './junit.xml',
      },
      coverage: {
        include: ['src/**'],
        provider: 'istanbul',
        reporter: ['text', 'cobertura', 'html', 'lcovonly'],
      },
    },
  };
});
