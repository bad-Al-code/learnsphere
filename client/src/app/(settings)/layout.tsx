import { getCurrentUser } from "@/app/(auth)/actions";
import { redirect } from "next/navigation";
import { SettingsSidebar } from "./_components/settings-sidebar";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Settings</h2>
          <SettingsSidebar />
        </aside>
        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  );
}
