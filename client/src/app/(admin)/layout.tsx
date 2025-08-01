import { getCurrentUser } from "@/app/(auth)/actions";
import { redirect } from "next/navigation";
import { AdminSidebar } from "./_components/admin-sidebar";

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
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <aside className="md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Admin Panel</h2>
          <AdminSidebar />
        </aside>
        <main className="md:col-span-10">{children}</main>
      </div>
    </div>
  );
}
