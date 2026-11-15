# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install      # install deps
npm run dev      # Vite dev server at http://localhost:5173
npm test         # Vitest unit tests (src/Util.test.tsx)
npm run build    # tsc type-check, then production build to ./dist
npm run preview  # serve the built site locally
```

There is no lint setup.

## Architecture

Single-page React app (Vite + React 18 + TypeScript + MUI v5). No routing.

- **Entry**: `index.html` → `src/main.tsx` → `src/App.tsx`. All state (persons, items, total, rounding) lives in `App.tsx` and is passed down via `AppContext` (`src/AppContext.tsx`).
- **Data model**: `persons[0]` is always "self"; indexes > 0 are friends. Each person has a list of items with a `cost`.
- **Split math**: `src/Util.tsx` — `calculateAmountOwed` splits the total proportionally to each person's item subtotal; `formatAmountOwed` applies the selected `Rounding`. Covered by `src/Util.test.tsx`.
- **Venmo**: "Create Venmos" opens `https://account.venmo.com/pay?amount=…` in a new tab per friend.
- **Fonts**: `public/Pacifico-Regular.ttf` and `public/PermanentMarker-Regular.ttf`, loaded via `@font-face` in `src/index.css`.

## Deploy

Cloudflare Workers (static assets), configured via `wrangler.jsonc`. Dashboard "Create application" settings:

- **Project name**: `venmo-split` (must match `name` in `wrangler.jsonc`)
- **Build command**: `npm run build`
- **Deploy command**: `npx wrangler deploy`

`assets.not_found_handling: "single-page-application"` serves `index.html` for unknown paths. Do NOT also add a `public/_redirects` file — Workers treats both together as a conflicting loop rule and fails the deploy.
