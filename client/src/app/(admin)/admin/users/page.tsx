import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import { searchUsers } from "../../actions";
import { UserTable } from "./_components/user-table";

interface ManageUsersPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ManageUsersPage({
  searchParams,
}: ManageUsersPageProps) {
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
          <Suspense fallback={<UserTableSkeleton />}>
            <UsersDataComponent searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function UsersDataComponent({ searchParams }: ManageUsersPageProps) {
  const query =
    typeof searchParams.query === "string" ? searchParams.query : "";
  const currentPage =
    typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const status =
    typeof searchParams.status === "string" ? searchParams.status : "";

  const searchResult = await searchUsers({ query, page: currentPage, status });

  return (
    <UserTable
      users={searchResult.results}
      totalPages={searchResult.pagination.totalPages}
    />
  );
}
function UserTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-10 w-full max-w-sm bg-muted rounded-md animate-pulse"></div>
        <div className="h-10 w-20 bg-muted rounded-md animate-pulse"></div>
      </div>
      <div className="border rounded-lg">
        <div className="h-12 w-full bg-muted rounded-t-md animate-pulse"></div>
        <div className="space-y-2 p-4">
          <div className="h-10 w-full bg-muted rounded-md animate-pulse"></div>
          <div className="h-10 w-full bg-muted rounded-md animate-pulse"></div>
          <div className="h-10 w-full bg-muted rounded-md animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
