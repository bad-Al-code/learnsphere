"use client";

import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Category } from "@/types/category";

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const chipRefs = useRef<Map<number, HTMLAnchorElement | null>>(new Map());

  const [hiddenCategories, setHiddenCategories] = useState<Category[]>([]);

  const isActive = (slug: string) => pathname === `/courses/category/${slug}`;

  useEffect(() => {
    const updateVisibility = () => {
      const container = scrollRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const containerRight = containerRect.right;

      const overflow: Category[] = [];

      categories.forEach((category) => {
        const el = chipRefs.current.get(category.id);
        if (!el) return;

        const rect = el.getBoundingClientRect();
        if (rect.right > containerRight) {
          overflow.push(category);
        }
      });

      setHiddenCategories(overflow);
    };

    updateVisibility();
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("resize", updateVisibility);
    };
  }, [categories]);

  return (
    <div className="relative mb-8">
      <div ref={scrollRef} className="flex gap-2 overflow-hidden pr-16">
        <Link href="/courses" ref={(el) => chipRefs.current.set(0, el)}>
          <Badge variant={pathname === "/courses" ? "default" : "secondary"}>
            All
          </Badge>
        </Link>

        {categories.map((category) => (
          <Link
            href={`/courses/category/${category.slug}`}
            key={category.id}
            ref={(el) => chipRefs.current.set(category.id, el)}
            className="flex-shrink-0"
          >
            <Badge
              variant={isActive(category.slug) ? "default" : "secondary"}
              className="whitespace-nowrap"
            >
              {category.name}
            </Badge>
          </Link>
        ))}
      </div>

      {/* More dropdown */}
      {hiddenCategories.length > 0 && (
        <div className="absolute right-0 top-0 h-full flex items-center pl-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="secondary">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {hiddenCategories.map((category) => (
                <DropdownMenuItem asChild key={category.id}>
                  <Link href={`/courses/category/${category.slug}`}>
                    {category.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
