import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import nodePolyfills from "rollup-plugin-node-polyfills";



export default defineConfig({
  // input: 'src/index.js',

  // output: {
  //   dir: 'output',
  //   format: 'esm', 
  // },

  plugins: [
   react()
  ],
  esbuild: { logOverride: { 'this-is-undefined-in-esm': 'silent' } },
  define: {
    global: {}, // Define global if needed
  },
  resolve: {
    alias: {
      "readable-stream": "vite-compatible-readable-stream",
      stream: "rollup-plugin-node-polyfills/polyfills/stream",
      events: "rollup-plugin-node-polyfills/polyfills/events",
      assert: "assert",
      crypto: "crypto-browserify",
      util: "util",
    },
  },
  build: {
    target: "es2020",
    rollupOptions: {
      plugins: [nodePolyfills({ crypto: true })],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [NodeGlobalsPolyfillPlugin({ buffer: true })],
      target: "es2020",
    },
  },
});
