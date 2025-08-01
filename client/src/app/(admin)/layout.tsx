import { getCurrentUser } from "@/app/(auth)/actions";
import { redirect } from "next/navigation";
import { AdminSidebar } from "./_components/admin-sidebar";
import { AdminTabs } from "./_components/admin-tabs";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Mobile Tabs */}
      <div className="block md:hidden">
        <AdminTabs />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:grid grid-cols-12 gap-6">
        <aside className="md:col-span-2">
          {/* <h2 className="text-lg font-semibold mb-4">Admin Panel</h2> */}
          <AdminSidebar />
        </aside>
        <main className="md:col-span-10">{children}</main>
      </div>

      {/* Mobile content area */}
      <div className="block md:hidden">{children}</div>
    </div>
  );
}
