// uno.config.ts

import extractorSvelte from '@unocss/extractor-svelte';
import {
	defineConfig,
	presetAttributify,
	presetIcons,
	presetTypography,
	presetWebFonts,
	presetWind3,
	transformerDirectives,
	transformerVariantGroup
} from 'unocss';

export default defineConfig({
	// Required for Svelte class: directive support
	extractors: [extractorSvelte()],

	presets: [
		presetWind3({ dark: 'class' }), // Tailwind 3 compatibility
		presetAttributify({ prefix: 'un-' }),
		presetIcons({
			scale: 1.2,
			extraProperties: {
				display: 'inline-block',
				'vertical-align': 'middle'
			}
		}),
		presetTypography(),
		presetWebFonts({
			provider: 'bunny', // GDPR-compliant alternative
			fonts: {
				display: 'Syne:700,800',
				sans: 'Plus Jakarta Sans:400,500,600,700',
				mono: 'JetBrains Mono:400,500,600',
				pixel: 'Silkscreen:400'
			}
		})
	],

	transformers: [
		transformerVariantGroup(), // hover:(bg-blue-500 text-white)
		transformerDirectives() // @apply support
	],

	// Custom shortcuts
	shortcuts: {
		// Buttons
		btn: 'px-6 py-3 rounded-xl font-display font-bold transition-all duration-300 cursor-pointer',
		'btn-primary':
			'btn bg-coral text-white hover:bg-coral-light hover:shadow-lg hover:shadow-coral/30 active:bg-coral-dark',
		'btn-ghost': 'btn text-white/80 hover:text-white hover:bg-white/10',
		'btn-secondary':
			'btn bg-ocean text-white hover:bg-ocean-deep hover:shadow-lg hover:shadow-ocean/30',

		// Cards
		card: 'p-6 rounded-2xl bg-notch-black border border-white/5 transition-all duration-300',
		'card-hover':
			'card hover:border-coral/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-coral/10',

		// Badges
		badge: 'px-3 py-1 rounded-full text-xs font-pixel bg-sunset/20 text-sunset',
		'badge-coral': 'px-3 py-1 rounded-full text-xs font-pixel bg-coral/20 text-coral',

		// Typography
		'heading-1': 'font-display font-bold text-4xl sm:text-5xl md:text-7xl tracking-tight',
		'heading-2': 'font-display font-bold text-2xl sm:text-3xl md:text-5xl tracking-tight',
		'heading-3': 'font-display font-bold text-xl sm:text-2xl md:text-3xl',
		'body-large': 'text-lg md:text-xl text-white/70 leading-relaxed',
		'body-base': 'text-base text-white/60 leading-relaxed',

		// Layout
		section: 'py-16 md:py-24 lg:py-32',
		container: 'max-w-6xl mx-auto px-4 sm:px-6',

		// Utilities
		'flex-center': 'flex items-center justify-center',
		'notch-shape': 'rounded-[24px]',
		'glow-coral': 'shadow-lg shadow-coral/20',
		'glow-ocean': 'shadow-lg shadow-ocean/20'
	},

	// Theme with custom colors
	theme: {
		colors: {
			// Primary - Coral (from crab icon)
			coral: {
				DEFAULT: '#E07B56',
				light: '#F5A07B',
				dark: '#C45A3A'
			},
			// Warm accents
			sand: {
				DEFAULT: '#D4A574',
				light: '#E8C9A0'
			},
			// Ocean accent
			ocean: {
				DEFAULT: '#4A9EBF',
				deep: '#2E7A99'
			},
			// Nature accents
			palm: '#5D8A66',
			sunset: '#F5C26B',
			// Dark backgrounds
			'deep-black': '#0D0D0D',
			'notch-black': '#1A1A1A',
			surface: '#242424'
		}
	},

	// CSS variable definitions and global styles
	preflights: [
		{
			getCSS: () => `
				:root {
					--coral: #E07B56;
					--coral-light: #F5A07B;
					--coral-dark: #C45A3A;
					--sand: #D4A574;
					--sand-light: #E8C9A0;
					--ocean: #4A9EBF;
					--ocean-deep: #2E7A99;
					--palm: #5D8A66;
					--sunset: #F5C26B;
					--deep-black: #0D0D0D;
					--notch-black: #1A1A1A;
					--surface: #242424;
				}

				html {
					scroll-behavior: smooth;
				}

				body {
					background-color: var(--deep-black);
					color: white;
				}

				/* Notch shape clip path */
				.notch-clip {
					clip-path: polygon(
						0% 0%,
						10% 0%,
						12% 100%,
						88% 100%,
						90% 0%,
						100% 0%,
						100% 100%,
						0% 100%
					);
				}

				/* Animations */
				@keyframes float {
					0%, 100% { transform: translateY(0); }
					50% { transform: translateY(-8px); }
				}

				@keyframes pulse-glow {
					0%, 100% { box-shadow: 0 0 20px rgba(224, 123, 86, 0.3); }
					50% { box-shadow: 0 0 40px rgba(224, 123, 86, 0.5); }
				}

				@keyframes fade-up {
					from {
						opacity: 0;
						transform: translateY(20px);
					}
					to {
						opacity: 1;
						transform: translateY(0);
					}
				}

				@keyframes shimmer {
					0% { background-position: -200% 0; }
					100% { background-position: 200% 0; }
				}

				.animate-float {
					animation: float 4s ease-in-out infinite;
				}

				.animate-pulse-glow {
					animation: pulse-glow 2s ease-in-out infinite;
				}

				.animate-fade-up {
					animation: fade-up 0.6s ease-out forwards;
				}

				.animate-shimmer {
					background: linear-gradient(
						90deg,
						transparent,
						rgba(255, 255, 255, 0.1),
						transparent
					);
					background-size: 200% 100%;
					animation: shimmer 2s infinite;
				}

				/* Stagger delays for reveal animations */
				.stagger-1 { animation-delay: 0ms; }
				.stagger-2 { animation-delay: 100ms; }
				.stagger-3 { animation-delay: 200ms; }
				.stagger-4 { animation-delay: 300ms; }

				/* Scroll reveal - elements start hidden */
				.reveal {
					opacity: 0;
					transform: translateY(20px);
					transition: opacity 0.6s ease-out, transform 0.6s ease-out;
				}

				.reveal.visible {
					opacity: 1;
					transform: translateY(0);
				}

				/* Gradient text utility */
				.gradient-coral {
					background: linear-gradient(135deg, var(--coral) 0%, var(--sunset) 100%);
					-webkit-background-clip: text;
					-webkit-text-fill-color: transparent;
					background-clip: text;
				}

				/* Noise texture overlay */
				.noise-overlay::before {
					content: '';
					position: absolute;
					inset: 0;
					background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
					opacity: 0.03;
					pointer-events: none;
				}

				/* Selection color */
				::selection {
					background-color: var(--coral);
					color: white;
				}
			`
		}
	],

	// Safelist for dynamic classes
	safelist: [
		'prose',
		'prose-lg',
		'prose-invert',
		'stagger-1',
		'stagger-2',
		'stagger-3',
		'stagger-4',
		'reveal',
		'visible'
	]
});
