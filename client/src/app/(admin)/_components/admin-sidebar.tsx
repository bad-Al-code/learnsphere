"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Home, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", value: "dashboard", icon: Home },
  { href: "/admin/users", label: "Users", value: "users", icon: Users },
  {
    href: "/admin/courses",
    label: "Courses",
    value: "courses",
    icon: BookOpen,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const activeTab =
    navItems.find((item) => pathname.startsWith(item.href))?.value ||
    "dashboard";

  return (
    <>
      {/* Mobile: Tabs */}
      <div className="md:hidden mb-4">
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
      <nav className="hidden md:flex flex-col space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.href}
              asChild
              variant={isActive ? "secondary" : "ghost"}
              className="w-full justify-start gap-2 truncate"
            >
              <Link href={item.href} className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                <span className="truncate">{item.label}</span>
              </Link>
            </Button>
          );
        })}
      </nav>
    </>
  );
}
