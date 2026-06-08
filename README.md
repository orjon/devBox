# DevBox
### Your development toolbox

DevBox is a toolbox for developers to store and quickly access the resources they use every day - code snippets, AI prompts, terminal commands, links, notes, and files. Items are organised by type and grouped into collections, giving you a fast, searchable second brain for your dev workflow.

![DevBox Dashboard](public/screenshots/Screenshot1.png)

---

## Status

> **In active development** — not yet production ready.

| Phase | Description | Status |
|---|---|---|
| Project setup | Next.js, Tailwind, shadcn/ui | ✅ Complete |
| Dashboard UI | Sidebar, collections grid, stats, pinned/recent items | ✅ Complete |
| Database | Prisma 7 + Neon schema, migrations | ✅ Complete |
| Seed data | Sample user, types, collections, and items | ✅ Complete |
| Authentication | NextAuth v5, GitHub OAuth, email/password, custom sign-in/register pages | ✅ Complete |
| Deployment | Vercel staging + Digital Ocean droplet, GitHub Actions CI/CD | 🔄 In Progress |

---

## Technologies

| | |
|---|---|
| **Framework** | Next.js 16 / React 19 |
| **Language** | TypeScript |
| **Database** | Neon (PostgreSQL) |
| **ORM** | Prisma 7 |
| **Auth** | NextAuth v5 |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **File Storage** | Cloudflare R2 |

---

## Getting Started

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Commands

```bash
pnpm dev           # Start development server
pnpm build         # Production build
pnpm start         # Start production server
pnpm lint          # Run ESLint
```

### Database

```bash
pnpm db:seed       # Seed the database with sample data
pnpm db:studio     # Open Prisma Studio (database GUI)
pnpm db:test       # Run database connection test
```

> Database changes must go through Prisma migrations. Never run `prisma db push` or modify the schema directly.
