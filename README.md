# Founder Capstone — Starter

**Read `BRIEF.md` before anything else.** The way you respond to the brief is
most of the mark. Then read `PRESENTATION-GUIDE.md` for the Loom.

## Setup

```bash
npm install
npm run dev
```

Type-check anytime with `npm run typecheck` (strict mode, no `any`).

## What's here

- `src/data/types.ts` — the domain model (a data contract you don't control).
- `src/data/items.ts` — mock items with deliberate real-world messiness.
- `src/App.tsx` — an empty shell. Delete it and build the product.

## What you deliver (all required — see BRIEF.md for detail)

1. The working app, **deployed to a live public URL** (link in this README).
   - Live site: https://owethufounderscapst.netlify.app
2. `FOUNDER-RESPONSE.md` — your professional pushback to Thabo.
3. `DECISION-LOG.md` — min. 8 real decisions with tradeoffs.
4. `AI-USAGE.md` — min. 3 AI moments, incl. one where AI was wrong and you caught it.
5. A Loom walkthrough (see PRESENTATION-GUIDE.md).

## Rules

- TypeScript strict. No `any` / `as any` / `@ts-ignore` to dodge a type.
- Runs from a clean clone. Test in a fresh folder before submitting.
- Deployed to a live public URL (Vercel/Netlify/GitHub Pages/Cloudflare) with the
  link in this README. Test the live site before submitting.
- Commit as you go. Public repo.

## Deployment checklist

- Production backend: render.yaml
- Staging backend: render.staging.yaml
- Required env vars: JWT_SECRET, MONGODB_URI, CORS_ORIGIN, NODE_ENV
- Optional monitoring: SENTRY_DSN
- Deployment workflows: .github/workflows/deploy-staging.yml and .github/workflows/deploy-production.yml
- Deployment setup guide: DEPLOYMENT-SETUP.md
- Post-deploy checks: /health, /healthz, /api/tools

Templates for the three markdown deliverables are in this repo as
`FOUNDER-RESPONSE.md`, `DECISION-LOG.md`, and `AI-USAGE.md` — fill them in.
