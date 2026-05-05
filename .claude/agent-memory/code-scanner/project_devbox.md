---
name: DevBox Project Architecture
description: Architecture, patterns, and recurring issues found during code audits of the DevBox codebase
type: project
---

DevBox is a Next.js 16 / React 19 / Tailwind v4 developer workspace SaaS (snippets, prompts, commands, links, collections). Stack: Prisma 7 + Neon PostgreSQL, NextAuth v5 (planned), shadcn/ui, Cloudflare R2.

**Why:** To give future audit sessions a baseline understanding of what has been built and common patterns.

**How to apply:** Use this to inform what patterns are standard in this codebase vs what is actually anomalous.

## Key Architectural Decisions
- Data fetching in server components via direct Prisma queries (no API routes yet for dashboard)
- `DashboardShell` is a `use client` wrapper that holds sidebar collapsed state, receives `sidebarData` from the layout server component
- DB query functions live in `src/lib/db/` (items.ts, collections.ts)
- Mock data in `src/data/mock-data.ts` — `currentUser` still imported in `Sidebar.tsx` for the user area (not yet from DB)
- `ICON_MAP` (string -> Lucide component) is duplicated across `CollectionCard.tsx`, `ItemCard.tsx`, and `Sidebar.tsx`
- `timeAgo()` utility is inlined in `ItemCard.tsx` rather than being in a shared util
- No `loading.tsx` or `error.tsx` files exist yet
- No middleware exists yet
- The `src/data/mock-data.ts` file exports unused data (`items`, `collections`, `itemTypes`) — only `currentUser` is still consumed

## Recurring Issues to Watch For
- Duplicated `ICON_MAP` constant across multiple components
- `currentUser` imported from mock-data in Sidebar (not from session)
- Missing `loading.tsx`/`error.tsx` boundaries despite async data fetching in layout and page
- All DB queries lack `userId` scoping (no auth yet — note this is expected pre-auth, not a bug to report)
- `bcryptjs` is a production dependency but auth is not implemented yet
- `getRecentItems` orders by `lastUsedAt desc` but items with null `lastUsedAt` will surface unpredictably
