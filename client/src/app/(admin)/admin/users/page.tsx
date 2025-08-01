import { searchUsers } from "@/app/(settings)/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import { UserTable } from "./_components/user-table";

interface ManageUsersPageProps {
  searchParams?: {
    query?: string;
    page?: string;
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

  const searchResult = await searchUsers({ query, page: currentPage });

  return (
    <UserTable
      users={searchResult.results}
      totalPages={searchResult.pagination.totalPages}
    />
  );
}
