import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { resolve } from 'path'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import autoprefixer from 'autoprefixer'
import prefixer from 'postcss-prefix-selector'
import svgLoader from 'vite-svg-loader'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  root: 'src',
  build: {
    minify: true,
    lib:{
      entry: resolve(__dirname,"src/index.ts"),
      formats: ['es'],
      name: "RainbowKitVue",
      fileName: "rainbowkit-vue"
    },
    rollupOptions:{
      external: [
        'vue',
        'viem',
        '@wagmi/core',
        '@wagmi/vue',
        '@wagmi/connectors'
      ],
      output:{
        globals:{
          vue: 'Vue',
          viem: 'viem',
        }
      },
      onwarn(warning, warn) {
        if(warning.code === "UNUSED_EXTERNAL_IMPORT"){
          return;
        }

        if (
          warning.code === "MODULE_LEVEL_DIRECTIVE" &&
          warning.message.includes(`"use client"`)
        ) {
          return;
        }
        warn(warning);
      },
    },
    outDir: '../dist',
  },
  plugins: [
    vue(),
    svgLoader(),
    vanillaExtractPlugin(),
  ],
  css: {
    postcss:{
      plugins:[
        prefixer({
          prefix: '[data-rk-vue]'
        }),
        autoprefixer(),
      ]
    }
  },
  resolve: {
    alias: {
      vue: fileURLToPath(new URL("./node_modules/vue/dist/vue.esm-bundler.js", import.meta.url)),
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
