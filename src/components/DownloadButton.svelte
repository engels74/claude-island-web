<script lang="ts">
	interface Props {
		version: string;
		downloadUrl: string;
		size?: 'default' | 'large';
	}

	let { version, downloadUrl, size = 'default' }: Props = $props();

	let isHovering = $state(false);
</script>

<a
	href={downloadUrl}
	class="download-btn"
	class:large={size === 'large'}
	onmouseenter={() => (isHovering = true)}
	onmouseleave={() => (isHovering = false)}
>
	<span class="btn-content">
		<span class="icon-wrapper">
			<span
				class="i-lucide-download"
				class:animate-bounce={isHovering}
				style="animation-duration: 0.6s;"
			></span>
		</span>
		<span class="text-wrapper">
			<span class="main-text">Download for macOS</span>
			<span class="version-badge">v{version}</span>
		</span>
	</span>

	<!-- Glow effect -->
	<span class="glow"></span>
</a>

<style>
	.download-btn {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.875rem 1.5rem;
		background: linear-gradient(135deg, var(--coral) 0%, var(--coral-dark) 100%);
		color: white;
		font-family: 'Syne', sans-serif;
		font-weight: 700;
		font-size: 1rem;
		border-radius: 1rem;
		text-decoration: none;
		transition: all 0.3s ease;
		overflow: hidden;
	}

	.download-btn.large {
		padding: 1rem 2rem;
		font-size: 1.125rem;
		border-radius: 1.25rem;
	}

	.download-btn:hover {
		transform: translateY(-2px);
		box-shadow:
			0 20px 40px -10px rgba(224, 123, 86, 0.4),
			0 0 0 1px rgba(255, 255, 255, 0.1);
	}

	.download-btn:active {
		transform: translateY(0);
	}

	.btn-content {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.icon-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 1.25rem;
		height: 1.25rem;
	}

	.icon-wrapper span {
		width: 1.25rem;
		height: 1.25rem;
	}

	.text-wrapper {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.version-badge {
		font-family: 'Silkscreen', monospace;
		font-size: 0.625rem;
		font-weight: 400;
		padding: 0.125rem 0.375rem;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 0.25rem;
	}

	.large .version-badge {
		font-size: 0.75rem;
		padding: 0.25rem 0.5rem;
	}

	.glow {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.2) 0%,
			transparent 50%,
			transparent 100%
		);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.download-btn:hover .glow {
		opacity: 1;
	}
</style>
