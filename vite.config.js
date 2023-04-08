import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// css样式不分割：https://github.com/vitejs/vite/issues/1579，https://github.com/lovelliu/vite-plugin-style-inject
import VitePluginStyleInject from 'vite-plugin-style-inject';

export default defineConfig({
    plugins: [vue(), VitePluginStyleInject()],
    build: {
        lib: {
            entry: resolve(__dirname, 'packages/index.ts'),
            name: 'ColorPicker',
            fileName: 'color-picker',
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                globals: {
                    vue: 'Vue',
                },
            },
        },
    },
})
