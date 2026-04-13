import { prisma } from "@/lib/prisma"

// Shape returned by Prisma for the nested findMany query below
type CollectionRow = {
  id: string
  name: string
  description: string | null
  isFavorite: boolean
  items: {
    item: {
      itemType: { id: string; name: string; icon: string; color: string }
    }
  }[]
}

export type CollectionCardData = {
  id: string
  name: string
  description: string | null
  isFavorite: boolean
  itemCount: number
  // Hex color of the most-used item type in this collection
  dominantColor: string
  itemTypeBreakdown: {
    typeId: string
    typeName: string
    typeIcon: string
    typeColor: string
    count: number
  }[]
}

// Fetches the most recently created collections, with per-type item counts
// and a dominant color derived from the most-used item type.
export async function getRecentCollections(limit = 6): Promise<CollectionCardData[]> {
  const collections = await prisma.collection.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          item: {
            include: { itemType: true },
          },
        },
      },
    },
  })

  return (collections as CollectionRow[]).map((col) => {
    // Count items per type within this collection
    const typeCounts = new Map<
      string,
      { count: number; name: string; icon: string; color: string }
    >()

    for (const { item } of col.items) {
      const t = item.itemType
      const existing = typeCounts.get(t.id)
      if (existing) {
        existing.count++
      } else {
        typeCounts.set(t.id, { count: 1, name: t.name, icon: t.icon, color: t.color })
      }
    }

    // Sort descending so the dominant type (most items) is first
    const breakdown = [...typeCounts.entries()]
      .map(([typeId, { count, name, icon, color }]) => ({
        typeId,
        typeName: name,
        typeIcon: icon,
        typeColor: color,
        count,
      }))
      .sort((a, b) => b.count - a.count)

    // Use a neutral colour if there's a tie for the top spot (no single dominant type)
    const isTied = breakdown.length > 1 && breakdown[0].count === breakdown[1].count
    const dominantColor = isTied ? "#3f3f46" : (breakdown[0]?.typeColor ?? "#3f3f46")

    return {
      id: col.id,
      name: col.name,
      description: col.description,
      isFavorite: col.isFavorite,
      itemCount: col.items.length,
      dominantColor,
      itemTypeBreakdown: breakdown,
    }
  })
}
