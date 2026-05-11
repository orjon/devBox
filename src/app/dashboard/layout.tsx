import { auth } from "@/auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { getItemTypesWithCounts } from "@/lib/db/items";
import { getSidebarCollections } from "@/lib/db/collections";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, itemTypes, { favorites, recents }] = await Promise.all([
    auth(),
    getItemTypesWithCounts(),
    getSidebarCollections(),
  ]);

  const user = {
    name: session?.user?.name,
    email: session?.user?.email,
    image: session?.user?.image,
  };

  return (
    <DashboardShell sidebarData={{ itemTypes, favorites, recents }} user={user}>
      {children}
    </DashboardShell>
  );
}
