# Current Feature: Profile Page

## Status

In Progress

## Goals

- `/profile` route exists and is protected (requires auth)
- Displays user info: name, email, avatar (OAuth image or initials fallback), account creation date, last logged in date
- Shows usage stats: total items, total collections, breakdown by item type
- Change password action appears only for email/password users (not OAuth)
- Delete account action with confirmation dialog

## Notes

- Avatar: use OAuth image if available, otherwise initials from name/email (matches existing UserAvatar component)
- Change password: only for users who have a password field set (email signup); GitHub/Google OAuth users skip this
- Delete account: requires confirmation dialog to prevent accidental deletion
- Item type breakdown: counts per type (snippets, prompts, notes, commands, links, files, images)
- Follow existing data fetching patterns (server component + db query functions)
- Last login date dropped — schema has no lastLoginAt field
- Sidebar is the app shell, not dashboard-specific — refactor into an (app) route group:
  - New `src/app/(app)/layout.tsx` holds the shell (sidebar, auth, data fetching)
  - `src/app/(app)/dashboard/` and `src/app/(app)/profile/` both live under it
  - Middleware matcher updated to cover `/(app)` routes (dashboard + profile)

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
- 2026-05-15: Production & Staging Deployment Config completed — staging branch on Vercel, production on Digital Ocean with PM2/Nginx/SSL, GitHub Actions auto-deploy on push to main, three GitHub OAuth apps (local/staging/production), Prisma migrate deploy on production Neon branch, AUTH_URL and AUTH_SECRET configured per environment
- 2026-05-20: Email verification completed — Resend integration, verification token creation/expiry (24h), verify-email page with resend form, unverified users blocked at sign-in with prompt to verify, GitHub OAuth users bypass verification
- 2026-05-20: Disable email verification flag completed — DISABLE_EMAIL_VERIFICATION env var bypasses verification entirely; when set, new registrations auto sign-in and redirect to /dashboard
- 2026-05-27: Forgot password completed — "Forgot password?" link on sign-in page, /forgot-password request form, /reset-password page, reset tokens stored in VerificationToken with reset: prefix (24h expiry), sendPasswordResetEmail via Resend, password updated with bcrypt on success
