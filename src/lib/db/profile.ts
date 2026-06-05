import { prisma } from "@/lib/prisma"

export type ProfileData = {
  name: string | null
  email: string
  image: string | null
  createdAt: Date
  hasPassword: boolean
  itemCount: number
  collectionCount: number
  itemTypeBreakdown: { id: string; name: string; icon: string; color: string; count: number }[]
}

export async function getProfileData(userId: string): Promise<ProfileData> {
  const [user, itemCount, collectionCount, itemTypes] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { name: true, email: true, image: true, createdAt: true, password: true },
    }),
    prisma.item.count({ where: { userId } }),
    prisma.collection.count({ where: { userId } }),
    prisma.itemType.findMany({
      where: { isSystem: true },
      include: { _count: { select: { items: { where: { userId } } } } },
      orderBy: { name: "asc" },
    }),
  ])

  const itemTypeBreakdown = itemTypes.map((t) => ({
    id: t.id,
    name: t.name,
    icon: t.icon,
    color: t.color,
    count: t._count.items,
  }))

  return {
    name: user.name,
    email: user.email,
    image: user.image,
    createdAt: user.createdAt,
    hasPassword: user.password !== null,
    itemCount,
    collectionCount,
    itemTypeBreakdown,
  }
}
