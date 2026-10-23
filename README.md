# 🍳 Recipe Box

A full-stack MERN kitchen assistant that turns "what's in my fridge" into a real recipe. Store your own recipes, get AI-powered suggestions from the ingredients you actually have, build a shopping list for what's missing, and share recipes with a community that reviews submissions before they go public.

> "Tell me what's in your kitchen. I'll tell you what to cook."

**Live app:** _add link after deployment_
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