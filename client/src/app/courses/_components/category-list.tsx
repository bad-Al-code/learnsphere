import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getCategoryOptions } from "../actions";

export async function CategoryList() {
  const categories = await getCategoryOptions();
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Link href="/courses">
        <Badge variant="default">All Courses</Badge>
      </Link>
      {categories.map((category: any) => (
        <Link href={`/courses/category/${category.slug}`} key={category.id}>
          <Badge variant="secondary">{category.name}</Badge>
        </Link>
      ))}
    </div>
  );
}
