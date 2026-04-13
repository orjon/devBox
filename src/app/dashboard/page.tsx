import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { items, collections as mockCollections, itemTypes } from "@/data/mock-data";
import { StatsCards, buildStats } from "@/components/dashboard/StatsCards";
import { CollectionCard } from "@/components/dashboard/CollectionCard";
import { ItemCard } from "@/components/dashboard/ItemCard";
import { getRecentCollections } from "@/lib/db/collections";

// ── Derived data (mock — items not yet migrated to DB) ────────────────
const recentItems = [...items]
  .sort((a, b) => b.lastUsedAt.getTime() - a.lastUsedAt.getTime())
  .slice(0, 10);

const pinnedItems = items.filter((i) => i.isPinned);

const stats = buildStats(
  items.length,
  mockCollections.length,
  items.filter((i) => i.isFavorite).length,
  mockCollections.filter((c) => c.isFavorite).length,
);

// ── Page ──────────────────────────────────────────────────────────────
export default async function DashboardPage() {
  const collections = await getRecentCollections(6);

  return (
    <div className="flex flex-col gap-8 w-full max-w-[2000px] mx-auto">

      {/* Stats */}
      <StatsCards stats={stats} />

      {/* Collections — data from DB */}
      <section>
        <SectionHeader title="Collections" href="/collections" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((col) => (
            <CollectionCard key={col.id} collection={col} />
          ))}
        </div>
      </section>

      {/* Pinned Items */}
      {pinnedItems.length > 0 && (
        <section>
          <SectionHeader title="Pinned Items" href="/items?pinned=true" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pinnedItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                itemType={itemTypes.find((t) => t.id === item.itemTypeId)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recent Items */}
      <section>
        <SectionHeader title="Recent Items" href="/items" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recentItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              itemType={itemTypes.find((t) => t.id === item.itemTypeId)}
            />
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
