# Current Feature: Production & Staging Deployment Config

## Status

In Progress

## Goals

- Create `staging` branch from `main`; update `/feature complete` to merge to `staging` instead of `main`
- Verify Vercel is configured to deploy from `staging` branch (change from `main` in Project Settings → Git)
- Add `production` Neon branch ID to CLAUDE.md for explicit MCP targeting
- Verify `prisma migrate deploy` has run against the `production` Neon branch and schema is in sync
- Set up Digital Ocean droplet: Node 20 (matches droplet), PM2, Nginx, SSL, deploy user, cloned repo, `.env.production.local`
- Create GitHub Actions workflow (`.github/workflows/deploy-production.yml`) that SSH-deploys to droplet on push to `main`
- Confirm GitHub OAuth app has callback URLs for both staging and production deployments
- Verify `schema.prisma` datasource picks up `DATABASE_URL`/`DIRECT_URL` at runtime; add `directUrl` if needed

## Notes

- Vercel (staging) is already set up and working at `https://devbox-staging.vercel.app` — env vars and OAuth verified
- Three-branch workflow: feature branch → `staging` (auto Vercel deploy) → `main` (manual, milestone-only, DO deploy)
- `development` Neon branch used for both local dev and Vercel staging; `production` Neon branch used for DO production
- `.env.production.local` on the droplet is gitignored and never committed — must be created manually on the server
- GitHub Actions secrets required: `DO_SSH_HOST`, `DO_SSH_USER`, `DO_SSH_KEY`
- `AUTH_SECRET` on production must be different from staging — generate with `openssl rand -base64 32`

## History

<!-- Keep this updated. Earliest to latest -->

- 2026-03-28: Initial Next.js, Tailwind and AI setup committed and pushed to GitHub
- 2026-03-30: Dashboard UI Phase 1 completed — shadcn/ui init, /dashboard route, dark mode, top bar with search and New Item button, sidebar and main placeholders
- 2026-03-31: Dashboard UI Phase 2 completed — collapsible sidebar with Types, Collections and Recent sections, item counts, colored icons, icon-only collapsed state
- 2026-04-01: Dashboard UI Phase 3 completed — stats cards, collections grid, pinned/recent items, sidebar polish (icon centering, mobile backdrop, no layout shift)
- 2026-04-01: Database setup completed — Prisma 7 + Neon PostgreSQL, full schema (User, Item, Collection, Tag, ItemType + NextAuth models), migrations config, PrismaClient singleton
- 2026-04-08: Seed data completed — user (john@mail.com), 7 system item types, 5 collections with 16 items total (snippets, prompts, commands, links)
- 2026-04-13: Dashboard collections completed — collections section fetches from Neon DB via Prisma, left colour band derived from dominant item type (neutral on tie), lucide icons per type with counts, fixed Prisma 7 client import path
- 2026-04-13: Dashboard items completed — pinned and recent items from DB, type-coloured border, pin icon states, link URL display, createdAt timestamp, coloured border on collection cards
- 2026-05-05: Stats & Sidebar completed — stats from DB, favourites/recents under Collections heading, "View all collections" link, coloured rounded square for recents, system item types from DB
- 2026-05-05: Code Quality Quick Wins completed — extracted shared ICON_MAP to src/lib/icon-map.ts, moved timeAgo to src/lib/utils.ts, fixed Link2→Link icon bug in Sidebar
- 2026-05-05: Dashboard Update Borders completed — item cards (pinned & recent) now use coloured left band with grey border on other sides, matching collection card style
- 2026-05-11: Auth setup completed — NextAuth v5 + GitHub OAuth provider, split config pattern (auth.config.ts + auth.ts), Prisma adapter, JWT strategy, /dashboard/* route protection via proxy.ts, Session type extended with user.id
- 2026-05-11: Auth credentials completed — Credentials provider (email/password) added to split config, bcrypt validation in auth.ts, /api/auth/register route with validation and password hashing
- 2026-05-11: Auth UI completed — custom /sign-in and /register pages (server components + server actions), UserAvatar component (image or initials), sidebar user area with real session data, avatar dropdown with sign out
