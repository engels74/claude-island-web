// uno.config.ts
import {
  defineConfig,
  presetWind3,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetAttributify,
  transformerVariantGroup,
  transformerDirectives,
} from 'unocss';
import extractorSvelte from '@unocss/extractor-svelte';

export default defineConfig({
  // Required for Svelte class: directive support
  extractors: [extractorSvelte()],

  presets: [
    presetWind3({ dark: 'class' }), // Tailwind 3 compatibility
    presetAttributify({ prefix: 'un-' }),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetTypography(),
    presetWebFonts({
      provider: 'bunny', // GDPR-compliant alternative
      fonts: {
        sans: 'Inter:400,500,600,700',
        mono: 'Fira Code:400,500',
      },
    }),
  ],

  transformers: [
    transformerVariantGroup(),  // hover:(bg-blue-500 text-white)
    transformerDirectives(),     // @apply support
  ],

  // Custom shortcuts
  shortcuts: {
    'btn': 'px-4 py-2 rounded-lg font-medium transition-colors',
    'btn-primary': 'btn bg-primary text-white hover:bg-primary/90',
    'card': 'p-6 rounded-xl bg-white dark:bg-gray-800 shadow-lg',
    'input': 'w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary',
    'flex-center': 'flex items-center justify-center',
  },

  // Theme with CSS variables for runtime theming
  theme: {
    colors: {
      primary: 'hsl(var(--primary) / <alpha-value>)',
      secondary: 'hsl(var(--secondary) / <alpha-value>)',
    },
  },

  // CSS variable definitions
  preflights: [{
    getCSS: () => `
      :root {
        --primary: 221 83% 53%;
        --secondary: 142 76% 36%;
      }
      .dark {
        --primary: 217 91% 60%;
        --secondary: 142 71% 45%;
      }
    `,
  }],

  // Safelist for dynamic classes
  safelist: ['prose', 'prose-lg', 'prose-invert'],
});
