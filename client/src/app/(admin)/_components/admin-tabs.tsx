"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { value: "/admin", label: "Dashboard" },
  { value: "/admin/users", label: "Users" },
  { value: "/admin/courses", label: "Courses" },
];

export function AdminTabs() {
  const pathname = usePathname();

  return (
    <Tabs value={pathname} className="w-full">
      <TabsList className="w-full grid grid-cols-3">
        {navItems.map((item) => (
          <TabsTrigger key={item.value} value={item.value} asChild>
            <Link href={item.value}>{item.label}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
