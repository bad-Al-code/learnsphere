"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { courseNavItems } from "./nav-items";

export function CourseSidebar({ courseId }: { courseId: string }) {
  const pathname = usePathname();
  const navItems = courseNavItems(courseId);

  return (
    <div className="flex flex-col space-y-2">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);

        return (
          <Button
            key={item.href}
            asChild
            variant={isActive ? "secondary" : "ghost"}
            className="w-full justify-start gap-2"
          >
            <Link href={item.href}>
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
