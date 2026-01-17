// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import UnoCSS from 'unocss/astro';

// https://astro.build/config
export default defineConfig({
  integrations: [
    UnoCSS({ injectReset: true }), // CSS framework first
    svelte(),                       // UI framework
  ],
});