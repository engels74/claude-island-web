<script lang="ts">
	let isDark = $state(true);

	$effect(() => {
		// Initialize from localStorage or system preference
		const stored = localStorage.getItem('theme');
		if (stored) {
			isDark = stored === 'dark';
		} else {
			isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		}
		updateTheme();
	});

	function updateTheme() {
		if (isDark) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}

	function toggle() {
		isDark = !isDark;
		updateTheme();
	}
</script>

<button
	type="button"
	onclick={toggle}
	class="relative p-2 rounded-xl bg-surface border border-white/10 hover:border-coral/30 transition-all duration-300 group"
	aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
>
	<!-- Sun icon (shown in dark mode) -->
	<span
		class="i-lucide-sun w-5 h-5 text-sunset transition-all duration-300"
		class:opacity-100={isDark}
		class:opacity-0={!isDark}
		class:rotate-0={isDark}
		class:rotate-90={!isDark}
		class:scale-100={isDark}
		class:scale-0={!isDark}
		style="position: {isDark ? 'relative' : 'absolute'};"
	></span>

	<!-- Moon icon (shown in light mode) -->
	<span
		class="i-lucide-moon w-5 h-5 text-ocean transition-all duration-300"
		class:opacity-100={!isDark}
		class:opacity-0={isDark}
		class:rotate-0={!isDark}
		class:-rotate-90={isDark}
		class:scale-100={!isDark}
		class:scale-0={isDark}
		style="position: {!isDark ? 'relative' : 'absolute'};"
	></span>
</button>

<style>
	button {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}
</style>
