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
  searchParams?: {
    query?: string;
    page?: string;
    status?: string;
  };
}

export default function ManageUsersPage({
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
          <Suspense fallback={<p>Loading users...</p>}>
            <UsersDataComponent searchParams={searchParams} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

async function UsersDataComponent({ searchParams }: ManageUsersPageProps) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const status = searchParams?.status || "";

  const searchResult = await searchUsers({ query, page: currentPage, status });

  return (
    <UserTable
      users={searchResult.results}
      totalPages={searchResult.pagination.totalPages}
    />
  );
}
