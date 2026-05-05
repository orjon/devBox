# Current Feature

## Status

Not Started

## Goals and requirements


## Notes


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
