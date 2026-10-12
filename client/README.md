# Recipe Box

A full-stack MERN kitchen assistant. Store your own recipes, get AI-powered suggestions from what's already in your kitchen, build a shopping list, and share recipes with a community that reviews submissions before they go public.

> "Tell me what's in your kitchen. I'll tell you what to cook."

## Features

- **Recipe Box** — full CRUD for personal recipes, with photo uploads, ingredient chips, and step-by-step instructions
- **Smart Suggestions** — a two-stage engine: fast, free matching against your own database first, falling back to Google Gemini when there's not enough to work with, cached for 24h and rate-limited
- **Community** — mark a recipe public, it enters an admin review queue, and once approved it's visible to everyone with ratings and comments
- **Shopping List** — generate a merged list from any recipe's ingredients, with an animated check-off flow
- **Dark mode, mobile bottom nav, and an accessibility pass** (keyboard navigation, focus rings, alt text, WCAG AA contrast)

## Tech stack

**Client:** React 18, Vite, TailwindCSS, shadcn/ui, Framer Motion, React Router v6, TanStack Query, Zustand, react-hot-toast, lucide-react

**Server:** Node.js, Express, MongoDB + Mongoose, JWT (access + refresh tokens), bcrypt, Zod, Multer + Cloudinary, express-rate-limit, Google Gemini API

**Deployment:** Vercel (client), Render (server), MongoDB Atlas (database)

## Architecture
─────────────┐ HTTPS ┌─────────────┐ Mongoose ┌──────────────┐
│ Client │ ───────────────> │ Server │ ─────────────────>│ MongoDB │
│ (Vercel) │ <─────────────── │ (Render) │ <──────────────────│ Atlas │
└─────────────┘ JSON / JWT └──────┬──────┘ └──────────────┘
│
┌───────────┼────────────┐
│ │ │
┌─────▼────┐ ┌────▼─────┐ ┌────▼──────┐
│Cloudinary│ │ Gemini │ │ Suggestion│
│ (images) │ │ API │ │ Cache │
└──────────┘ └───────────┘ │ (24h TTL) │
└───────────┘


### Suggestion engine (two-stage)

1. **Stage 1 — DB match** (always runs, free, instant): normalizes the user's ingredients, matches fuzzily against ingredient names (ignoring prep words like "chopped" and basic plurals), scores recipes by `have / (have + missing)`, and ranks by score. Only recipes the user owns or that are approved and public are considered.
2. **Stage 2 — Gemini fallback** (only when Stage 1 returns fewer than 3 matches): calls Gemini with a strict JSON-only prompt, validates the response shape with Zod before trusting it, and degrades silently back to DB-only results on any failure or timeout. Successful responses are cached by a hash of the sorted ingredients + meal type + filters, so an identical request within 24h skips the API call entirely.

### Community review flow

A recipe's `visibility` (`private`/`public`) and `status` (`draft`/`pending`/`approved`/`rejected`) are tracked separately. Switching a recipe to public automatically queues it as `pending`; an admin approves or rejects it from `/admin`; editing an already-approved public recipe sends it back to `pending` for re-review, closing the loophole of getting a clean recipe approved and then swapping in something else.

### Auth

Short-lived access tokens (15 min) paired with longer-lived refresh tokens (7 days). An axios interceptor transparently refreshes an expired access token and retries the original request, so sessions persist across browser restarts without the user noticing.

## Project structure

ecipe-box/
├── client/ # React + Vite frontend
│ └── src/
│ ├── api/ # axios instance + API functions per resource
│ ├── components/ # shared components + components/ui (shadcn primitives)
│ ├── hooks/ # useDebounce, etc.
│ ├── lib/ # unitMerge and other pure utilities
│ ├── pages/ # route-level components
│ ├── routes/ # AppRoutes
│ └── store/ # zustand stores (auth, theme)
└── server/ # Express API
└── src/
├── config/ # db, cloudinary, multer, gemini, pantry staples
├── controllers/
├── middleware/ # auth (protect), admin, rate limiting
├── models/ # Mongoose schemas
├── routes/
├── services/ # gemini.service.js
└── validators/ # Zod schemas


## Running locally

**Server**
```bash
cd server
npm install
cp .env.example .env   # fill in MongoDB, JWT secrets, Cloudinary, Gemini key
npm run dev
```

**Client**
```bash
cd client
npm install
cp .env.example .env   # set VITE_API_URL to the server's URL
npm run dev
```

## Status

🚧 In active development — see commit history for progress through each build phase (auth, CRUD, search, community features, AI suggestions, shopping list, polish).