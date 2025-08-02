import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { searchUsers } from "../../actions";
import { UserTable } from "./_components/user-table";

interface ManageUsersPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ManageUsersPage({
  searchParams,
}: ManageUsersPageProps) {
  const query =
    typeof searchParams.query === "string" ? searchParams.query : "";
  const currentPage =
    typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const status =
    typeof searchParams.status === "string" ? searchParams.status : "";

  const searchResult = await searchUsers({ query, page: currentPage, status });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Manage Users</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Search, view, and manage user accounts on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserTable
            users={searchResult.results}
            totalPages={searchResult.pagination.totalPages}
          />
        </CardContent>
      </Card>
    </div>
  );
}
