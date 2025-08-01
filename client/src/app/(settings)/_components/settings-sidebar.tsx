"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Shield, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/settings/profile",
    label: "My Account",
    value: "profile",
    icon: User,
  },
  {
    href: "/settings/security",
    label: "Security",
    value: "security",
    icon: Shield,
  },
  {
    href: "/settings/notifications",
    label: "Notifications",
    value: "notifications",
    icon: Bell,
  },
];

export function SettingsSidebar() {
  const pathname = usePathname();

  const activeTab =
    navItems.find((item) => pathname.startsWith(item.href))?.value || "profile";

  return (
    <>
      {/* Mobile: Tab Navigation */}
      <div className="md:hidden mb-0">
        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="grid grid-cols-3">
            {navItems.map((item) => (
              <TabsTrigger key={item.value} value={item.value} asChild>
                <Link href={item.href} className="flex items-center gap-1">
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
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
            className="w-full justify-start gap-2"
          >
            <Link href={item.href} className="flex items-center gap-2">
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
    </>
  );
}
