import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { neonConfig } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import ws from "ws"

neonConfig.webSocketConstructor = ws

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const systemTypes = [
  { name: "Snippet", icon: "Code",       color: "#3b82f6", isSystem: true },
  { name: "Prompt",  icon: "Sparkles",   color: "#8b5cf6", isSystem: true },
  { name: "Command", icon: "Terminal",   color: "#f97316", isSystem: true },
  { name: "Note",    icon: "StickyNote", color: "#fde047", isSystem: true },
  { name: "File",    icon: "File",       color: "#6b7280", isSystem: true },
  { name: "Image",   icon: "Image",      color: "#ec4899", isSystem: true },
  { name: "Link",    icon: "Link",       color: "#10b981", isSystem: true },
]

async function main() {
  // ── System item types ──────────────────────────────────
  console.log("Seeding system item types...")
  const typeMap: Record<string, string> = {}

  for (const type of systemTypes) {
    const record = await prisma.itemType.upsert({
      where: { name_userId: { name: type.name, userId: "" } },
      update: { icon: type.icon, color: type.color },
      create: { ...type, userId: null },
    })
    typeMap[type.name] = record.id
    console.log(`  ✓ ${type.name}`)
  }

  // ── User ───────────────────────────────────────────────
  console.log("\nSeeding user...")
  const password = await bcrypt.hash("123456", 12)
  const user = await prisma.user.upsert({
    where: { email: "john@mail.com" },
    update: {},
    create: {
      email: "john@mail.com",
      name: "John Doe",
      password,
      isPro: false,
      emailVerified: new Date(),
    },
  })
  console.log(`  ✓ ${user.email}`)

  // ── Clean up existing collections & items for this user ───────────────
  console.log("\nCleaning up existing data...")
  await prisma.itemCollection.deleteMany({ where: { item: { userId: user.id } } })
  await prisma.item.deleteMany({ where: { userId: user.id } })
  await prisma.collection.deleteMany({ where: { userId: user.id } })

  // ── Collections & items ────────────────────────────────
  console.log("\nSeeding collections and items...")

  // React Patterns
  const reactPatterns = await prisma.collection.create({
    data: {
      name: "React Patterns",
      description: "Reusable React patterns and hooks",
      userId: user.id,
    },
  })

  const reactItems = await prisma.item.createManyAndReturn({
    data: [
      {
        title: "Custom Hooks",
        contentType: "snippet",
        isPinned: true,
        language: "typescript",
        content: `import { useState, useEffect, useCallback } from "react"

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? (JSON.parse(stored) as T) : initial
    } catch {
      return initial
    }
  })
  const set = useCallback(
    (v: T) => {
      setValue(v)
      localStorage.setItem(key, JSON.stringify(v))
    },
    [key]
  )
  return [value, set] as const
}`,
        userId: user.id,
        itemTypeId: typeMap["Snippet"],
      },
      {
        title: "Component Patterns",
        contentType: "snippet",
        language: "typescript",
        content: `import { createContext, useContext, useState } from "react"

// Context provider pattern
const ThemeContext = createContext<{ theme: string; toggle: () => void } | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("light")
  const toggle = () => setTheme(t => (t === "light" ? "dark" : "light"))
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}

// Compound component pattern
function Tabs({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(0)
  return <div data-active={active}>{children}</div>
}
Tabs.Tab = function Tab({ label }: { label: string }) {
  return <button>{label}</button>
}`,
        userId: user.id,
        itemTypeId: typeMap["Snippet"],
      },
      {
        title: "Utility Functions",
        contentType: "snippet",
        language: "typescript",
        content: `export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ")
}

export function formatDate(date: Date | string, locale = "en-GB") {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
    new Date(date)
  )
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\\w\\s-]/g, "")
    .replace(/[\\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max) + "…" : str
}`,
        userId: user.id,
        itemTypeId: typeMap["Snippet"],
      },
    ],
  })

  await prisma.itemCollection.createMany({
    data: reactItems.map(i => ({ itemId: i.id, collectionId: reactPatterns.id })),
  })
  console.log(`  ✓ React Patterns (${reactItems.length} items)`)

  // AI Workflows
  const aiWorkflows = await prisma.collection.create({
    data: {
      name: "AI Workflows",
      description: "AI prompts and workflow automations",
      userId: user.id,
    },
  })

  const aiItems = await prisma.item.createManyAndReturn({
    data: [
      {
        title: "Code Review Prompt",
        contentType: "prompt",
        isPinned: true,
        content: `Review the following code and provide feedback on:
1. Correctness — are there any bugs or edge cases?
2. Readability — is the code clear and well-structured?
3. Performance — are there any obvious inefficiencies?
4. Security — are there any vulnerabilities?
5. Suggested improvements with code examples where helpful.

Code:
\`\`\`
{{code}}
\`\`\``,
        userId: user.id,
        itemTypeId: typeMap["Prompt"],
      },
      {
        title: "Documentation Generation",
        contentType: "prompt",
        content: `Generate concise documentation for the following code. Include:
- A one-line summary
- Parameters/props with types and descriptions
- Return value (if applicable)
- A short usage example

Use JSDoc format if it's a function/class, or Markdown if it's a module.

Code:
\`\`\`
{{code}}
\`\`\``,
        userId: user.id,
        itemTypeId: typeMap["Prompt"],
      },
      {
        title: "Refactoring Assistance",
        contentType: "prompt",
        content: `Refactor the following code to improve quality. Goals:
- Reduce complexity and nesting
- Improve naming clarity
- Extract reusable logic where appropriate
- Maintain identical behaviour

Explain each change you make and why.

Code:
\`\`\`
{{code}}
\`\`\``,
        userId: user.id,
        itemTypeId: typeMap["Prompt"],
      },
    ],
  })

  await prisma.itemCollection.createMany({
    data: aiItems.map(i => ({ itemId: i.id, collectionId: aiWorkflows.id })),
  })
  console.log(`  ✓ AI Workflows (${aiItems.length} items)`)

  // DevOps
  const devops = await prisma.collection.create({
    data: {
      name: "DevOps",
      description: "Infrastructure and deployment resources",
      userId: user.id,
    },
  })

  const devopsItems = await prisma.item.createManyAndReturn({
    data: [
      {
        title: "Docker + CI/CD Config",
        contentType: "snippet",
        language: "dockerfile",
        content: `# Dockerfile
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]`,
        userId: user.id,
        itemTypeId: typeMap["Snippet"],
      },
      {
        title: "Deploy Script",
        contentType: "command",
        content: `#!/bin/bash
set -e
echo "Pulling latest..."
git pull origin main
echo "Installing deps..."
npm ci
echo "Building..."
npm run build
echo "Restarting server..."
pm2 restart app
echo "Done."`,
        userId: user.id,
        itemTypeId: typeMap["Command"],
      },
      {
        title: "Docker Documentation",
        contentType: "link",
        url: "https://docs.docker.com/reference/",
        description: "Official Docker reference documentation",
        userId: user.id,
        itemTypeId: typeMap["Link"],
      },
      {
        title: "GitHub Actions Docs",
        contentType: "link",
        url: "https://docs.github.com/en/actions",
        description: "GitHub Actions official documentation",
        userId: user.id,
        itemTypeId: typeMap["Link"],
      },
    ],
  })

  await prisma.itemCollection.createMany({
    data: devopsItems.map(i => ({ itemId: i.id, collectionId: devops.id })),
  })
  console.log(`  ✓ DevOps (${devopsItems.length} items)`)

  // Terminal Commands
  const terminalCmds = await prisma.collection.create({
    data: {
      name: "Terminal Commands",
      description: "Useful shell commands for everyday development",
      userId: user.id,
    },
  })

  const terminalItems = await prisma.item.createManyAndReturn({
    data: [
      {
        title: "Git Operations",
        contentType: "command",
        isPinned: true,
        content: `# Undo last commit (keep changes staged)
git reset --soft HEAD~1

# Interactive rebase last N commits
git rebase -i HEAD~5

# Clean up merged branches
git branch --merged | grep -v '\\*\\|main\\|master' | xargs git branch -d

# Stash with message
git stash push -m "wip: feature description"

# Show diff of stash
git stash show -p stash@{0}`,
        userId: user.id,
        itemTypeId: typeMap["Command"],
      },
      {
        title: "Docker Commands",
        contentType: "command",
        content: `# Remove all stopped containers
docker container prune -f

# Remove unused images
docker image prune -a -f

# Shell into running container
docker exec -it <container> sh

# Tail container logs
docker logs -f --tail 100 <container>

# Docker compose rebuild
docker compose up --build -d`,
        userId: user.id,
        itemTypeId: typeMap["Command"],
      },
      {
        title: "Process Management",
        contentType: "command",
        content: `# Find process using a port
lsof -i :<port>

# Kill process on port
kill -9 $(lsof -t -i:<port>)

# List all running node processes
ps aux | grep node

# Monitor system resources
htop

# Watch a command every 2 seconds
watch -n 2 <command>`,
        userId: user.id,
        itemTypeId: typeMap["Command"],
      },
      {
        title: "Package Manager Utilities",
        contentType: "command",
        content: `# Check for outdated packages
npm outdated

# Audit and fix vulnerabilities
npm audit fix

# List globally installed packages
npm list -g --depth=0

# Clear npm cache
npm cache clean --force

# Why is a package installed?
npm why <package>

# Interactive upgrade (npx)
npx npm-check-updates -i`,
        userId: user.id,
        itemTypeId: typeMap["Command"],
      },
    ],
  })

  await prisma.itemCollection.createMany({
    data: terminalItems.map(i => ({ itemId: i.id, collectionId: terminalCmds.id })),
  })
  console.log(`  ✓ Terminal Commands (${terminalItems.length} items)`)

  // Design Resources
  const designResources = await prisma.collection.create({
    data: {
      name: "Design Resources",
      description: "UI/UX resources and references",
      userId: user.id,
    },
  })

  const designItems = await prisma.item.createManyAndReturn({
    data: [
      {
        title: "Tailwind CSS Docs",
        contentType: "link",
        url: "https://tailwindcss.com/docs",
        description: "Official Tailwind CSS documentation and utility reference",
        userId: user.id,
        itemTypeId: typeMap["Link"],
      },
      {
        title: "shadcn/ui",
        contentType: "link",
        url: "https://ui.shadcn.com",
        description: "Beautifully designed components built with Radix UI and Tailwind",
        userId: user.id,
        itemTypeId: typeMap["Link"],
      },
      {
        title: "Radix UI Primitives",
        contentType: "link",
        url: "https://www.radix-ui.com/primitives",
        description: "Unstyled, accessible component primitives for React",
        userId: user.id,
        itemTypeId: typeMap["Link"],
      },
      {
        title: "Lucide Icons",
        contentType: "link",
        url: "https://lucide.dev/icons/",
        description: "Open-source icon library with consistent design",
        userId: user.id,
        itemTypeId: typeMap["Link"],
      },
    ],
  })

  await prisma.itemCollection.createMany({
    data: designItems.map(i => ({ itemId: i.id, collectionId: designResources.id })),
  })
  console.log(`  ✓ Design Resources (${designItems.length} items)`)

  console.log("\nDone.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
