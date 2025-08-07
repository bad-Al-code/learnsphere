"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types/category";
import { SelectItem } from "@radix-ui/react-select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function CourseFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSeach = useDebouncedCallback((term: string) => {
    handleFilterChange("q", term);
  }, 500);

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search for courses..."
        onChange={(e) => handleSeach(e.target.value)}
        defaultValue={searchParams.get("q") || ""}
      />

      <div className="flex flex-wrap items-center gap-4">
        <Select
          onValueChange={(value) => handleFilterChange("categoryId", value)}
          defaultValue={searchParams.get("categoryId") || "all"}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categeory</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => handleFilterChange("sortBy", value)}
          defaultValue={searchParams.get("sortBy") || "newest"}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="popularity">Popularity</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
