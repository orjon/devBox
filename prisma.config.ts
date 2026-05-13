import { config } from "dotenv"
import { defineConfig, env } from "prisma/config"

config({ path: ".env.production.local", override: false })
config({ path: ".env.local", override: false })
config({ override: false })

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
})
