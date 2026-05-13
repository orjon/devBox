# Production & Staging Deployment Config

## Overview

Set up two automated deployment pipelines with a three-branch workflow:

| Branch | Deploy target | Neon DB branch | How updated |
|---|---|---|---|
| `staging` | Vercel (auto-deploy on push) | `development` (same as local) | Every `/feature complete` |
| `main` | Digital Ocean droplet (auto-deploy on push) | `production` (already exists) | Manual, at milestones |

**Development workflow:**
1. Develop on feature branch, test locally against Neon `development` DB
2. `/feature complete` → merge to `staging` + push (triggers Vercel deploy)
3. When milestone is ready → manually merge `staging` → `main` + push (triggers DO deploy)

**Impact on `/feature complete` skill:** the complete action currently merges to `main` — this needs updating to merge to `staging` instead.

---

## Requirements

### 1. Git Branching

- Create `staging` branch from current `main`
- `main` becomes the production-only branch, updated manually at milestones
- Update `/feature complete` action (`context/skills/feature/actions/complete.md`) to target `staging` instead of `main`

### 2. Neon Database

- `development` branch: already used locally → also used for Vercel staging
- `production` branch: already exists → used for the DO production deploy
- Add `production` branch ID to CLAUDE.md so Neon MCP tool calls can target it explicitly when needed
- Verify `prisma migrate deploy` has been run against the `production` branch and schema is in sync

### 3. Vercel (Staging) ✅ Done

- Vercel project created, connected to GitHub repo, deployed at `https://devbox-staging.vercel.app`
- Environment variables set: `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `AUTH_URL`
- GitHub OAuth app callback URL updated to `https://devbox-staging.vercel.app/api/auth/callback/github`
- Both GitHub OAuth and email/password sign-in verified working
- **TODO:** Change Vercel production branch from `main` to `staging` in Project Settings → Git

### 4. Digital Ocean Droplet (Production, `main` branch)

#### One-time droplet setup (manual)
- Ubuntu 24.04 LTS
- Install: Node.js 22 LTS, npm, PM2 (`npm i -g pm2`)
- Install Nginx as reverse proxy to `localhost:3000`
- SSL via Let's Encrypt / Certbot
- Create a deploy user with SSH key access
- Clone repo to `/var/www/devbox`
- Create `/var/www/devbox/.env.production.local` on the droplet (gitignored, never committed):

```
DATABASE_URL=<neon production branch pooled URL>
DIRECT_URL=<neon production branch direct URL>
AUTH_SECRET=<strong random secret — different from staging, generate with: openssl rand -base64 32>
AUTH_GITHUB_ID=<github oauth app client id>
AUTH_GITHUB_SECRET=<github oauth app client secret>
AUTH_URL=https://<production-domain>
```

#### Nginx config
```nginx
server {
    listen 80;
    server_name <production-domain>;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. GitHub Actions — Production Deploy

Create `.github/workflows/deploy-production.yml`:
- Trigger: push to `main`
- Steps:
  1. SSH into droplet
  2. `git pull origin main`
  3. `npm ci --omit=dev`
  4. `npm run build`
  5. `pm2 restart devbox` (or `pm2 start npm --name devbox -- start` on first run)

GitHub repository secrets required:
- `DO_SSH_HOST` — droplet IP or domain
- `DO_SSH_USER` — deploy user name
- `DO_SSH_KEY` — private SSH key (PEM format)

Vercel handles staging deploys via its own Git integration — no GitHub Actions needed for `staging`.

### 6. GitHub OAuth App

The existing OAuth app is configured for `localhost:3000` only. Add callback URLs for both deployments:
- `https://<staging>.vercel.app/api/auth/callback/github`
- `https://<production-domain>/api/auth/callback/github`

GitHub → Settings → Developer settings → OAuth Apps → DevBox → add both URLs.

### 7. Prisma Schema Datasource

`schema.prisma` datasource currently has no `url` field (Prisma 7 config pattern). **Before deploying**, verify the Prisma client picks up `DATABASE_URL` at runtime on Vercel and the droplet. If not, add explicitly:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

Adding `directUrl` also benefits Vercel's serverless environment.

### 8. Prisma Migrations on Production

Run against the production Neon branch before the first deploy and after any future schema change:

```bash
DIRECT_URL=<production-direct-url> npx prisma migrate deploy
```

Consider `scripts/migrate-production.sh` reading from a local `.env.production.local` (gitignored) to make this repeatable without editing files.

---

## Testing

1. Push a feature commit to `staging` → verify Vercel auto-deploys
2. Visit staging URL → verify app loads, GitHub and email/password sign-in work
3. Confirm staging reads from the `development` Neon DB (not production)
4. Manually merge `staging` → `main` and push → verify GitHub Actions SSH deploy runs
5. Visit production URL → verify app loads, auth works
6. Confirm production reads from the `production` Neon DB
7. Verify local dev still works unchanged against the `development` DB
