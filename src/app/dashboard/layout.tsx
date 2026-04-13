import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getItemTypesWithCounts } from "@/lib/db/items";
import { getSidebarCollections } from "@/lib/db/collections";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [itemTypes, { favorites, recents }] = await Promise.all([
    getItemTypesWithCounts(),
    getSidebarCollections(),
  ]);

  return (
    <DashboardShell sidebarData={{ itemTypes, favorites, recents }}>
      {children}
    </DashboardShell>
  );
}
