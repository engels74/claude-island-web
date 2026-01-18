# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Claude Island Web is a static website for [Claude Island](https://github.com/engels74/claude-island), a macOS menu bar app for Claude Code CLI. The site is deployed to GitHub Pages at [claudeisland.engels74.net](https://claudeisland.engels74.net).

## Tech Stack

- **Runtime**: Bun
- **Framework**: Astro 5 (static site generator)
- **Components**: Svelte 5 with Runes (islands architecture)
- **Styling**: UnoCSS with custom theme
- **Linting**: Biome

## Commands

```bash
bun install              # Install dependencies
bun run dev              # Start dev server at localhost:4321
bun run build            # Production build (includes type checking)
bun run preview          # Preview production build
bun run check            # Run Astro + Svelte type checking
bun run lint             # Check code with Biome
bun run lint:fix         # Auto-fix lint issues
```

## Architecture

### Islands Architecture

Astro handles all routing and static generation. Svelte 5 components function exclusively as interactive islands within static pages. Use `client:*` directives only when interactivity is needed:

- `client:load` - Above-fold critical UI only
- `client:visible` - Below-fold components (preferred default)
- `client:idle` - Non-critical interactivity
- Omit directive entirely for static/presentational components

### Key Files

| File | Purpose |
|------|---------|
| `src/config.ts` | Download version and URL (auto-updated by GitHub Actions) |
| `src/layouts/Layout.astro` | Base layout with SEO meta tags |
| `src/pages/index.astro` | Landing page composition |
| `uno.config.ts` | Theme colors, shortcuts, and custom CSS |

### Svelte 5 Patterns

Use Runes for state management:
- `$state()` for reactive variables
- `$derived()` for computed values
- `$effect()` for side effects
- `$props()` for component props with TypeScript interface

### UnoCSS Custom Theme

The project uses a tropical cove theme with custom colors defined in `uno.config.ts`:
- `coral` (primary), `ocean`, `sand`, `palm`, `sunset`
- Dark backgrounds: `deep-black`, `notch-black`, `surface`
- Custom shortcuts: `btn-primary`, `card-hover`, `heading-1`, `body-large`, etc.
- Icons via `@iconify-json/lucide` (use `i-lucide-*` classes)

## Code Style

Formatting is handled by Biome:
- Tab indentation
- Single quotes
- No trailing commas
- 100 character line width

For Svelte/Astro files, some rules are relaxed (see `biome.json` overrides).

## Deployment

Pushes to `main` trigger GitHub Actions:
1. `code-quality.yml` - Runs prek/Biome checks
2. `deploy.yml` - Builds and deploys to GitHub Pages (only on quality check success)

The `update-appcast.yml` workflow auto-updates `src/config.ts` when new releases are published in the main claude-island repo.
