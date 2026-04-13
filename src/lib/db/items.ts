import { prisma } from "@/lib/prisma"

export type ItemCardData = {
  id: string
  title: string
  content: string | null
  description: string | null
  language: string | null
  isPinned: boolean
  isFavorite: boolean
  lastUsedAt: Date | null
  tags: string[]
  itemType: {
    id: string
    name: string
    icon: string
    color: string
  }
}

export type DashboardStats = {
  itemCount: number
  collectionCount: number
  favoriteItemCount: number
  favoriteCollectionCount: number
}

// Shared include shape for item queries
const itemInclude = {
  itemType: true,
  tags: { include: { tag: true } },
} as const

// Maps a raw Prisma item row to the flat ItemCardData shape
function toCardData(item: {
  id: string
  title: string
  content: string | null
  description: string | null
  language: string | null
  isPinned: boolean
  isFavorite: boolean
  lastUsedAt: Date | null
  itemType: { id: string; name: string; icon: string; color: string }
  tags: { tag: { name: string } }[]
}): ItemCardData {
  return {
    id: item.id,
    title: item.title,
    content: item.content,
    description: item.description,
    language: item.language,
    isPinned: item.isPinned,
    isFavorite: item.isFavorite,
    lastUsedAt: item.lastUsedAt,
    tags: item.tags.map((t) => t.tag.name),
    itemType: item.itemType,
  }
}

// Fetches all pinned items, ordered most recently used first
export async function getPinnedItems(): Promise<ItemCardData[]> {
  const items = await prisma.item.findMany({
    where: { isPinned: true },
    orderBy: { lastUsedAt: "desc" },
    include: itemInclude,
  })
  return items.map(toCardData)
}

// Fetches the most recently used items
export async function getRecentItems(limit = 10): Promise<ItemCardData[]> {
  const items = await prisma.item.findMany({
    take: limit,
    orderBy: { lastUsedAt: "desc" },
    include: itemInclude,
  })
  return items.map(toCardData)
}

// Fetches aggregate counts for the stats cards
export async function getDashboardStats(): Promise<DashboardStats> {
  const [itemCount, collectionCount, favoriteItemCount, favoriteCollectionCount] =
    await Promise.all([
      prisma.item.count(),
      prisma.collection.count(),
      prisma.item.count({ where: { isFavorite: true } }),
      prisma.collection.count({ where: { isFavorite: true } }),
    ])

  return { itemCount, collectionCount, favoriteItemCount, favoriteCollectionCount }
}
