# Venmo Split

The easiest way to split the check. Enter the bill total (with tax and tip), what you and each friend ordered, and Venmo Split works out everyone's share — tax and tip split proportionally — then opens a Venmo request for each friend.

Built with Vite + React 18 + TypeScript + MUI, deployed to Cloudflare Workers (static assets).

## Commands

```bash
npm install      # install deps
npm run dev      # start dev server (http://localhost:5173)
npm test         # run unit tests (Vitest)
npm run build    # type-check + production build to ./dist
npm run preview  # serve the built site locally
```

### Testing on your phone

`npm run dev` listens on your local network (`server.host` in `vite.config.ts`). Vite prints a `Network:` URL like `http://192.168.1.20:5173` — open it on a phone on the same Wi-Fi and edits hot-reload there. `npm run preview` does the same for the production build.

## Deploying to Cloudflare

Configured via `wrangler.jsonc`. In the Cloudflare dashboard → **Workers & Pages** → **Create application** → **Import a repository**, pick this repo and use:

- **Project name**: `venmo-split` (must match `name` in `wrangler.jsonc`)
- **Build command**: `npm run build`
- **Deploy command**: `npx wrangler deploy`

Pushes to the default branch redeploy automatically once Git is connected. Add a custom domain under the Worker's **Settings → Domains & Routes**.
