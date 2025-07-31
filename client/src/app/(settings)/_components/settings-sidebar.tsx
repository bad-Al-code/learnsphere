"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/settings/profile", label: "My Account", value: "profile" },
  { href: "/settings/security", label: "Security", value: "security" },
  {
    href: "/settings/notifications",
    label: "Notifications",
    value: "notifications",
  },
];

export function SettingsSidebar() {
  const pathname = usePathname();

  const activeTab =
    navItems.find((item) => pathname.startsWith(item.href))?.value || "profile";

  return (
    <>
      <div className="md:hidden mb-0">
        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="grid grid-cols-3">
            {navItems.map((item) => (
              <TabsTrigger key={item.value} value={item.value} asChild>
                <Link href={item.href}>{item.label}</Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Desktop: Sidebar Buttons */}
      <nav className="hidden md:flex flex-col space-y-1">
        {navItems.map((item) => (
          <Button
            key={item.href}
            asChild
            variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Link href={item.href}>{item.label}</Link>
          </Button>
        ))}
      </nav>
    </>
  );
}
