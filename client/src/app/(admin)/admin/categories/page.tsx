import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCategories } from "../../actions";
import { CategoryManager } from "./_components/category-manager";

export default async function ManageCategoriesPage() {
  const result = await getCategories();
  const categories = result.success ? result.data : [];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Manage Categories</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>
            Create, edit, and delete course categories for the entire platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryManager initialCategories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
