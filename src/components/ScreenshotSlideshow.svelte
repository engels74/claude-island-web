<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		autoPlayInterval?: number;
	}

	let {
		autoPlayInterval = 5000
	}: Props = $props();

	let screenshots = $state<string[]>([]);
	let currentIndex = $state(0);
	let isLoading = $state(true);
	let isPaused = $state(false);
	let containerHeight = $state(0);
	let containerWidth = $state(0);
	let autoPlayTimer = $state<ReturnType<typeof setInterval> | null>(null);
	let dimensionLoadId = 0;

	onMount(() => {
		window.addEventListener('resize', updateDimensions);

		(async () => {
			const response = await fetch('/api/screenshots');
			if (response.ok) {
				screenshots = await response.json();
			} else {
				// Fallback to manual list if API fails
				screenshots = [
					'/screenshots/001-menu-bar-icon-compact.png',
					'/screenshots/002-claude-code-session-output.png',
					'/screenshots/003-settings-menu-full.png',
					'/screenshots/004-token-tracking-settings.png'
				];
			}

			isLoading = false;
			updateDimensions();
			startAutoPlay();
		})();

		return () => {
			window.removeEventListener('resize', updateDimensions);
			if (autoPlayTimer) clearInterval(autoPlayTimer);
		};
	});

	function updateDimensions() {
		if (screenshots.length === 0) return;

		const loadId = ++dimensionLoadId;
		const img = new Image();
		img.onload = () => {
			if (loadId !== dimensionLoadId) return;
			const maxWidth = Math.min(img.width, 600);
			containerWidth = maxWidth;
			containerHeight = (img.height / img.width) * maxWidth;
		};
		img.src = screenshots[currentIndex];
	}

	function goToSlide(index: number) {
		if (screenshots.length === 0) return;
		currentIndex = ((index % screenshots.length) + screenshots.length) % screenshots.length;
		updateDimensions();
		resetAutoPlay();
	}

	function nextSlide() {
		goToSlide(currentIndex + 1);
	}

	function prevSlide() {
		goToSlide(currentIndex - 1);
	}

	function startAutoPlay() {
		if (autoPlayTimer) clearInterval(autoPlayTimer);
		if (isPaused || screenshots.length === 0) return;

		autoPlayTimer = setInterval(() => {
			nextSlide();
		}, autoPlayInterval);
	}

	function resetAutoPlay() {
		startAutoPlay();
	}

	function handleMouseEnter() {
		isPaused = true;
		if (autoPlayTimer) clearInterval(autoPlayTimer);
	}

	function handleMouseLeave() {
		isPaused = false;
		startAutoPlay();
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			prevSlide();
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			nextSlide();
		}
	}
</script>

{#if isLoading}
	<div class="flex items-center justify-center" style="height: 300px;">
		<div class="animate-pulse text-white/40">Loading screenshots...</div>
	</div>
{:else if screenshots.length > 0}
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		class="slideshow-container relative w-full max-w-3xl mx-auto px-4"
		onmouseenter={handleMouseEnter}
		onmouseleave={handleMouseLeave}
		onkeydown={handleKeyDown}
		role="region"
		aria-label="Screenshot slideshow"
		tabindex="0"
	>
		<!-- Animated background gradient -->
		<div class="absolute inset-0 -z-10 rounded-2xl">
			<div class="absolute inset-0 bg-gradient-to-br from-coral/10 via-ocean/5 to-transparent rounded-2xl opacity-0 transition-opacity duration-500" class:opacity-100={!isPaused}></div>
		</div>

		<!-- Slide wrapper with dynamic dimensions -->
		<div
			class="relative rounded-2xl overflow-hidden bg-notch-black border border-white/10 transition-all duration-300"
			style="aspect-ratio: {containerWidth > 0 && containerHeight > 0 ? containerWidth / containerHeight : 16 / 9}; max-height: 600px;"
		>
			<!-- Glow effect behind current slide -->
			<div
				class="absolute -inset-20 rounded-full blur-3xl opacity-20 transition-all duration-500 pointer-events-none"
				class:bg-coral={currentIndex === 0}
				class:bg-ocean={currentIndex === 1}
				class:bg-sunset={currentIndex === 2}
				class:bg-palm={currentIndex === 3}
			></div>

			<!-- Slides container -->
			<div class="relative w-full h-full overflow-hidden">
				{#each screenshots as screenshot, index (index)}
					<img
						src={screenshot}
						alt="Claude Island screenshot {index + 1}"
						class="absolute inset-0 w-full h-full object-contain transition-all duration-500"
						class:opacity-0={index !== currentIndex}
						class:opacity-100={index === currentIndex}
						class:scale-95={index === currentIndex && index !== 0}
						loading="lazy"
					/>
				{/each}
			</div>

			<!-- Overlay frame effect -->
			<div class="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-white/5"></div>

			<!-- Navigation overlay (visible on hover/pause) -->
			{#if isPaused}
				<div class="absolute inset-0 flex items-center justify-between px-4 transition-opacity duration-300 opacity-100 group">
					<button
						onclick={prevSlide}
						class="p-2.5 rounded-lg bg-coral/80 hover:bg-coral text-white shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
						aria-label="Previous screenshot"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
						</svg>
					</button>
					<button
						onclick={nextSlide}
						class="p-2.5 rounded-lg bg-coral/80 hover:bg-coral text-white shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
						aria-label="Next screenshot"
					>
						<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</div>
			{/if}
		</div>

		<!-- Indicator dots -->
		<div class="flex items-center justify-center gap-2.5 mt-6">
			{#each screenshots as _, index}
				<button
					onclick={() => goToSlide(index)}
					class="group relative transition-all duration-300"
					aria-label="Go to slide {index + 1}"
					aria-current={index === currentIndex ? 'true' : 'false'}
				>
					<div
						class="w-2.5 h-2.5 rounded-full transition-all duration-300 dot-indicator"
						class:active={index === currentIndex}
						data-active={index === currentIndex}
					></div>
				</button>
			{/each}
		</div>

		<!-- Info text -->
		<div class="text-center mt-4 text-sm text-white/50">
			<span class="font-pixel">{currentIndex + 1} / {screenshots.length}</span>
			<span class="mx-2">•</span>
			<span class="text-xs">{isPaused ? 'Paused' : 'Auto-advancing'}</span>
		</div>
	</div>
{:else}
	<div class="text-center py-12 text-white/50">
		<p>No screenshots available</p>
	</div>
{/if}

<style>
	.slideshow-container {
		--slide-transition: 500ms cubic-bezier(0.4, 0.0, 0.2, 1);
	}

	.slideshow-container :global(img) {
		transition: opacity var(--slide-transition), transform var(--slide-transition);
	}

	.dot-indicator {
		background-color: rgba(255, 255, 255, 0.3);
		cursor: pointer;
	}

	.dot-indicator.active {
		background-color: var(--coral);
		transform: scale(1.5);
	}

	button:hover .dot-indicator:not(.active) {
		background-color: rgba(255, 255, 255, 0.5);
		transform: scale(1.25);
	}
</style>
