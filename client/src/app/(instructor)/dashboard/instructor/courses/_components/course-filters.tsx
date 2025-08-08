// src/app/(instructor)/dashboard/instructor/courses/_components/course-filters.tsx
"use client";

import {
  BarChart3,
  Filter,
  IndianRupee,
  Layers3,
  ListFilter,
  Search,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Category } from "@/types/category";

function FilterSelect({
  label,
  value,
  placeholder,
  items,
  onValueChange,
}: any) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select onValueChange={onValueChange} defaultValue={value}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {items.map((item: any) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function CourseFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchOnChange = useDebouncedCallback((term: string) => {
    handleFilterChange("q", term);
  }, 300);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const term = formData.get("query") as string;
    handleFilterChange("q", term);
  };

  const categoryItems = [
    { value: "all", label: "All Category" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];
  const levelItems = [
    { value: "all", label: "All Levels" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
  ];
  const priceItems = [
    { value: "all", label: "All Prices" },
    { value: "free", label: "Free" },
    { value: "paid", label: "Paid" },
  ];
  const sortItems = [
    { value: "newest", label: "Newest" },
    { value: "popularity", label: "Popularity" },
    { value: "rating", label: "Rating" },
  ];

  const desktopFilters = (
    <div className="hidden sm:flex items-center gap-4">
      <Select
        onValueChange={(value) => handleFilterChange("categoryId", value)}
        defaultValue={searchParams.get("categoryId") || "all"}
      >
        <SelectTrigger className="w-auto gap-2">
          <ListFilter className="h-4 w-4" /> Category
        </SelectTrigger>
        <SelectContent className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {categoryItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        onValueChange={(value) => handleFilterChange("level", value)}
        defaultValue={searchParams.get("level") || "all"}
      >
        <SelectTrigger className="w-auto gap-2">
          <Layers3 className="h-4 w-4" /> Level
        </SelectTrigger>
        <SelectContent className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {levelItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        onValueChange={(value) => handleFilterChange("price", value)}
        defaultValue={searchParams.get("price") || "all"}
      >
        <SelectTrigger className="w-auto gap-2">
          <IndianRupee className="h-4 w-4" /> Price
        </SelectTrigger>
        <SelectContent className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {priceItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="ml-auto">
        <Select
          onValueChange={(value) => handleFilterChange("sortBy", value)}
          defaultValue={searchParams.get("sortBy") || "newest"}
        >
          <SelectTrigger className="w-auto gap-2">
            <BarChart3 className="h-4 w-4" /> Sort
          </SelectTrigger>
          <SelectContent className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            {sortItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const mobileFilters = (
    <div className="sm:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full gap-2">
            <Filter className="h-4 w-4" /> Filters
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter & Sort</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6 mx-4">
            <FilterSelect
              label="Subject"
              value={searchParams.get("categoryId") || "all"}
              placeholder="All Subjects"
              items={categoryItems}
              onValueChange={(value: string) =>
                handleFilterChange("categoryId", value)
              }
            />
            <FilterSelect
              label="Level"
              value={searchParams.get("level") || "all"}
              placeholder="All Levels"
              items={levelItems}
              onValueChange={(value: string) =>
                handleFilterChange("level", value)
              }
            />
            <FilterSelect
              label="Price"
              value={searchParams.get("price") || "all"}
              placeholder="All Prices"
              items={priceItems}
              onValueChange={(value: string) =>
                handleFilterChange("price", value)
              }
            />
            <FilterSelect
              label="Sort By"
              value={searchParams.get("sortBy") || "newest"}
              placeholder="Sort By"
              items={sortItems}
              onValueChange={(value: string) =>
                handleFilterChange("sortBy", value)
              }
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            name="query"
            placeholder="Search for courses..."
            onChange={(e) => handleSearchOnChange(e.target.value)}
            defaultValue={searchParams.get("q") || ""}
            className="pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>
      {desktopFilters}
      {mobileFilters}
    </div>
  );
}
