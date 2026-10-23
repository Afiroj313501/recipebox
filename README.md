# 🍳 Recipe Box

A full-stack MERN kitchen assistant that turns "what's in my fridge" into a real recipe. Store your own recipes, get AI-powered suggestions from the ingredients you actually have, build a shopping list for what's missing, and share recipes with a community that reviews submissions before they go public.

> "Tell me what's in your kitchen. I'll tell you what to cook."

**Live app:** https://recipebox-pied.vercel.app
**API:** _add link after deployment_

---

## ✨ Features

- **Recipe Box** — full CRUD for personal recipes: photo uploads, an animated ingredient-chips input, step-by-step instructions, meal-type tagging
- **Smart Suggestions (two-stage AI)** — fast, free matching against your own recipe database first; falls back to Google Gemini only when the database doesn't have enough, with fuzzy ingredient matching ("chopped tomatoes" matches "tomato"), 24h response caching, and per-user rate limiting
- **Community** — mark any recipe public, it enters an admin review queue, and once approved it's visible to everyone — with ratings, comments, and public author profiles
- **Shopping List** — generate a merged list from any recipe's ingredients (same name + unit combine their quantities), with an animated check-off flow
- **Auth** — JWT access + refresh tokens, so sessions persist across browser restarts without the user noticing
- **Dark mode, mobile bottom nav, and an accessibility pass** — keyboard navigation, visible focus rings, alt text, WCAG AA color contrast

---

## 🧱 Tech stack

| | |
|---|---|
| **Client** | React 18, Vite, TailwindCSS, shadcn/ui, Framer Motion, React Router v6, TanStack Query, Zustand, react-hot-toast, lucide-react |
| **Server** | Node.js, Express, MongoDB + Mongoose, JWT, bcrypt, Zod, Multer + Cloudinary, express-rate-limit |
| **AI** | Google Gemini API (`gemini-2.5-flash`), server-side only |
| **Deployment** | Vercel (client) · Render (server) · MongoDB Atlas (database) |

---

## 🏗️ Architecture
┌─────────────┐ HTTPS ┌─────────────┐ Mongoose ┌──────────────┐
│ Client │ ───────────────> │ Server │ ──────────────────>│ MongoDB │
│ (Vercel) │ <─────────────── │ (Render) │ <───────────────────│ Atlas │
└─────────────┘ JSON / JWT └──────┬──────┘ └──────────────┘
│
┌────────────┼─────────────┐
│ │ │
┌─────▼────┐ ┌─────▼─────┐ ┌─────▼──────┐
│Cloudinary│ │ Gemini │ │ Suggestion │
│ (images) │ │ API │ │ Cache │
└──────────┘ └───────────┘ │ (24h TTL) │
└────────────┘


### Suggestion engine (two-stage)

1. **Stage 1 — DB match** (always runs, free, instant): normalizes the user's ingredients, fuzzily matches them against saved recipes (stripping prep words like "chopped"/"diced" and basic plurals), scores by `have / (have + missing)`, and ranks results instead of hard-filtering — so partial matches still surface with a clear "what you're missing" list. Only the user's own recipes and approved public recipes are eligible.
2. **Stage 2 — Gemini fallback** (only when Stage 1 returns fewer than 3 results): calls Gemini with a strict JSON-only prompt, validates the response shape with Zod before trusting it, and silently degrades back to DB-only results on any validation failure, malformed JSON, or timeout (10s). Successful responses are cached by a hash of the sorted ingredients + meal type + filters, so an identical request within 24h skips the API call entirely. Capped at 10 requests/minute per user.

### Community review flow

A recipe tracks `visibility` (`private` / `public`) and `status` (`draft` / `pending` / `approved` / `rejected`) separately. Switching a recipe to public automatically queues it as `pending`. An admin approves or rejects it from `/admin`. Editing an already-approved public recipe sends it back to `pending` for re-review — closing the loophole of getting a clean recipe approved and then swapping in something else.

### Auth

Short-lived access tokens (15 min) paired with longer-lived refresh tokens (7 days). An axios interceptor transparently refreshes an expired access token and retries the original request, so sessions persist across browser restarts without the user noticing.

---

## 📂 Project structure
recipe-box/
├── LICENSE
├── README.md
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


---

## 🚀 Running locally

### Prerequisites
- Node.js 18+
- A MongoDB Atlas cluster (free tier is fine)
- A Cloudinary account (free tier)
- A Gemini API key from [aistudio.google.com](https://aistudio.google.com/apikey)

### Server
```bash
cd server
npm install
cp .env.example .env   # fill in MongoDB URI, JWT secrets, Cloudinary, Gemini key
npm run dev
```

### Client
```bash
cd client
npm install
cp .env.example .env   # set VITE_API_URL to the server's URL (http://localhost:5000 locally)
npm run dev
```

The client runs at `http://localhost:5173`, the server at `http://localhost:5000`.

---

## 📸 Screenshots

| Landing | Recipe Box | Suggest |
|---|---|---|
| _add screenshot_ | _add screenshot_ | _add screenshot_ |

| Explore | Recipe Detail | Shopping List |
|---|---|---|
| _add screenshot_ | _add screenshot_ | _add screenshot_ |

---

## 🗺️ Roadmap

- [x] Auth, Recipe Box CRUD
- [x] Search & filters
- [x] Community: public feed, admin approval, ratings, comments, profiles
- [x] AI suggester: DB matching + Gemini fallback, caching, rate limiting
- [x] Shopping list with unit merging
- [x] Dark mode, mobile nav, accessibility pass
- [ ] Meal planner
- [ ] Import recipe from URL
- [ ] Unit conversion (cups ↔ ml)
- [ ] PWA / offline support

---

## 📄 License

MIT — see [LICENSE](./LICENSE).

## 👤 Author

**Abdullah Firoj**
CSE graduate · Full-stack (MERN) developer exploring AI/ML