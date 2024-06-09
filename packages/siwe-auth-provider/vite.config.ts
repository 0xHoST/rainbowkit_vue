import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  root: 'src',
  plugins: [
    vue()
  ],
  build: {
    minify: true,
    lib:{
      entry: resolve(__dirname,"src/provider.ts"),
      formats: ['es'],
      name: "RainbowKitVueSiweAuthAdapterPlugin",
      fileName: "rainbowkit-vue-siwe-auth-adapter"
    },
    rollupOptions:{
      external: [
        'vue-auth3',
        'vue-router',
        'viem',
        '@raveyard/rainbowkit-vue'
      ],
      output:{
        globals:{
          vue: 'Vue',
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
    outDir: '../dist'
  },
})
