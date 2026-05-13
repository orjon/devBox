# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Context files

Read the following for project context:

- @/context/project-overview.md
- @/context/coding-standards.md
- @/context/ai-interaction.md
- @/context/current-feature.md

## Commands

```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # start production server
npm run lint     # run ESLint
```

## Database

**CRITICAL: You must ONLY ever use the Neon `development` branch of the `devbox` project. This is an absolute rule with no exceptions.**

- You MUST NOT read from or write to any other Neon project, branch, or database — including the `production` branch of this project.
- You MUST NOT run queries, migrations, or any Neon MCP tool call without explicitly targeting the branch and project below.
- If a Neon MCP tool does not accept a `branchId`, do not use it.

| Setting | Value |
|---|---|
| Project | `devbox` |
| Project ID | `small-queen-47794514` |
| Branch | `development` |
| Branch ID | `br-weathered-smoke-abl4ja4g` |
| Database | `neondb` |

Always pass both `projectId: "small-queen-47794514"` and `branchId: "br-weathered-smoke-abl4ja4g"` on every Neon MCP tool call.

**Production branch (reference only — never use in MCP tool calls during development):**

| Setting | Value |
|---|---|
| Branch | `production` |
| Branch ID | `br-soft-lake-abk76ojo` |

## Stack

- **Next.js 16** (App Router) with React 19 and TypeScript
- **Tailwind CSS v4** — configured via PostCSS; no `tailwind.config.*` file; theme customisation goes in `globals.css`
- **React Compiler** enabled (`reactCompiler: true` in `next.config.ts`) — manual memoisation (`useMemo`, `useCallback`, `memo`) is unnecessary
