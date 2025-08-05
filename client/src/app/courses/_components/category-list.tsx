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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState<Category[]>([]);
  const [hidden, setHidden] = useState<Category[]>([]);

  const allCategories: Category[] = [
    { id: "all", name: "All", slug: "" },
    ...categories,
  ];

  const isActive = (slug: string) =>
    pathname === (slug ? `/courses/category/${slug}` : "/courses");

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      if (!container) return;

      const availableWidth = container.offsetWidth - 10;
      const temp = document.createElement("div");
      temp.style.visibility = "hidden";
      temp.style.position = "absolute";
      temp.style.display = "inline-flex";
      temp.className =
        "px-3 py-1 text-sm font-medium border rounded-md whitespace-nowrap mr-2";
      document.body.appendChild(temp);

      let total = 0;
      let fitCount = 0;

      for (const cat of allCategories) {
        temp.innerText = cat.name;
        const width = temp.offsetWidth + 8;
        if (total + width > availableWidth) break;
        total += width;
        fitCount++;
      }

      document.body.removeChild(temp);

      setVisible(allCategories.slice(0, fitCount));
      setHidden(allCategories.slice(fitCount));
    };

    measure();
    window.addEventListener("resize", measure);
    const timeout = setTimeout(measure, 100);

    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(timeout);
    };
  }, [categories]);

  return (
    <div className="relative mb-8">
      <div ref={containerRef} className="flex gap-2 overflow-hidden pr-16">
        {visible.map((cat) => (
          <Link
            key={cat.id}
            href={cat.slug ? `/courses/category/${cat.slug}` : "/courses"}
          >
            <Badge
              variant={isActive(cat.slug) ? "default" : "secondary"}
              className="whitespace-nowrap"
            >
              {cat.name}
            </Badge>
          </Link>
        ))}
      </div>

      {hidden.length > 0 && (
        <div className="absolute right-0 top-0 h-full flex items-center  pl-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="secondary">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            >
              {hidden.map((cat) => (
                <DropdownMenuItem asChild key={cat.id}>
                  <Link
                    href={
                      cat.slug ? `/courses/category/${cat.slug}` : "/courses"
                    }
                  >
                    {cat.name}
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
