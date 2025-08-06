"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { instructorNavItems } from "./nav-items";

export function InstructorTabs() {
  const pathname = usePathname();

  const activeTab =
    instructorNavItems.find((item) => pathname.startsWith(item.href))?.value ||
    "dashboard";

  return (
    <div className="md:hidden mb-4">
      <Tabs defaultValue={activeTab} className="w-full">
        <TabsList className="flex overflow-x-auto no-scrollbar">
          {instructorNavItems.map((item) => (
            <TabsTrigger key={item.value} value={item.value} asChild>
              <Link href={item.href} className="flex items-center gap-1 px-2">
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
