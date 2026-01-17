# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static-first content site using **Bun + Astro 5 + Svelte 5 + UnoCSS**, deployed to GitHub Pages at `claudeisland.engels74.net`. Astro handles routing and static generation; Svelte 5 components are used exclusively as interactive islands within otherwise static pages.

## Commands

```bash
bun install          # Install dependencies
bun run dev          # Start dev server at localhost:4321
bun run build        # Build for production (runs type checks first)
bun run preview      # Preview production build locally
bun run check        # Run Astro + Svelte type checking
bun run lint         # Check code with Biome
bun run lint:fix     # Auto-fix lint issues
bun run format       # Format code with Biome
bun test             # Run tests with Bun's test runner
```

## Architecture

### Stack

- **Bun** - Runtime and package manager
- **Astro 5** - Static site generator with Content Layer API
- **Svelte 5** - Interactive islands using Runes (`$state`, `$derived`, `$effect`)
- **UnoCSS** - Atomic CSS with Tailwind compatibility (`presetWind3`)
- **Biome** - Linting and formatting (replaces ESLint + Prettier)
- **prek** - Pre-commit hooks

### Key Patterns

**Islands Architecture**: Default to static components. Only add `client:*` directives when interactivity is needed:
- `client:visible` or `client:idle` - preferred defaults
- `client:load` - only for above-fold critical UI
- No directive = zero JavaScript shipped

**Svelte 5 Runes**: Use modern Runes API, not legacy stores or `$:` reactive statements:
- `$state()` for reactive variables
- `$derived()` for computed values
- `$effect()` for side effects
- `$props()` for component props

**Cross-Island State**: Islands are isolated - use `.svelte.ts` files with Runes for shared state (not Svelte stores).

**Content Collections**: Use Content Layer API with `glob()` loader in `src/content.config.ts` (not legacy `type: 'content'`).

**Images**: Store in `src/assets/` for optimization, not `public/`.

### Configuration Files

- `astro.config.mjs` - Astro + integrations (UnoCSS must load before Svelte)
- `uno.config.ts` - UnoCSS presets, shortcuts, theme
- `biome.json` - Linting rules with overrides for .svelte/.astro files
- `svelte.config.js` - Svelte preprocessor config
- `.pre-commit-config.yaml` - prek hooks (Biome check on commit, type check on push)

### Code Style

- Tabs for indentation
- Single quotes
- No trailing commas
- 100 character line width
