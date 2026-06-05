import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { auth } from "@/auth";
import { StatsCards, buildStats } from "@/components/dashboard/StatsCards";
import { CollectionCard } from "@/components/dashboard/CollectionCard";
import { ItemCard } from "@/components/dashboard/ItemCard";
import { getRecentCollections } from "@/lib/db/collections";
import { getPinnedItems, getRecentItems, getDashboardStats } from "@/lib/db/items";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id ?? "";
  const [collections, pinnedItems, recentItems, statsData] = await Promise.all([
    getRecentCollections(userId, 6),
    getPinnedItems(userId),
    getRecentItems(userId, 10),
    getDashboardStats(userId),
  ]);

  const stats = buildStats(
    statsData.itemCount,
    statsData.collectionCount,
    statsData.favoriteItemCount,
    statsData.favoriteCollectionCount,
  );

  return (
    <div className="flex flex-col gap-8 w-full max-w-[2000px] mx-auto">

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Collections */}
      <section>
        <SectionHeader title="Collections" href="/collections" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((col) => (
            <CollectionCard key={col.id} collection={col} />
          ))}
        </div>
      </section>

      {/* Pinned Items — hidden if none */}
      {pinnedItems.length > 0 && (
        <section>
          <SectionHeader title="Pinned Items" href="/items?pinned=true" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pinnedItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Items */}
      <section>
        <SectionHeader title="Recent Items" href="/items" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recentItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>

    </div>
  );
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <Link
        href={href}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        View All <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
