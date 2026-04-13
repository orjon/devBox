import Link from "next/link";
import {
  Star,
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link as LinkIcon,
  type LucideIcon,
} from "lucide-react";
import type { CollectionCardData } from "@/lib/db/collections";

// Maps the icon string stored in ItemType.icon to a Lucide component
const ICON_MAP: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
}

export function CollectionCard({ collection }: { collection: CollectionCardData }) {
  return (
    <Link
      href={`/collections/${collection.id}`}
      className="flex overflow-hidden rounded-lg border bg-card hover:bg-card/80 transition-colors"
      style={{ borderColor: collection.dominantColor }}
    >
      {/* Vertical colour band — color derived from the dominant item type */}
      <div className="w-2 shrink-0" style={{ backgroundColor: collection.dominantColor }} />

      <div className="flex flex-col gap-2 p-4 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="font-medium text-sm text-foreground leading-tight">{collection.name}</span>
          {collection.isFavorite && (
            <Star className="h-4 w-4 shrink-0 fill-yellow-400 text-yellow-400" />
          )}
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{collection.description}</p>

        <div className="flex items-center justify-between mt-auto pt-1">
          {/* Small icon + count for each item type present in the collection */}
          <div className="flex items-center gap-2">
            {collection.itemTypeBreakdown.map(({ typeId, typeIcon, typeColor, count }) => {
              const Icon = ICON_MAP[typeIcon];
              if (!Icon) return null;
              return (
                <span key={typeId} className="flex items-center gap-1" style={{ color: typeColor }}>
                  <Icon className="h-3.5 w-3.5" />
                  <span className="text-xs">{count}</span>
                </span>
              );
            })}
          </div>
          <span className="text-xs text-muted-foreground shrink-0">
            {collection.itemCount} {collection.itemCount === 1 ? "item" : "items"}
          </span>
        </div>
      </div>
    </Link>
  );
}
