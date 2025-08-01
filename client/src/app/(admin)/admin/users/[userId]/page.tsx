import { getUserById } from "@/app/(settings)/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { UserActions } from "./_components/user-actions";

const getInitials = (firstName?: string | null, lastName?: string | null) => {
  const first = firstName?.[0] || "";
  const last = lastName?.[0] || "";
  return `${first}${last}`.toUpperCase();
};

export default function UserDetailPage({
  params,
}: {
  params: { userId: string };
}) {
  return (
    <Suspense fallback={<UserDetailSkeleton />}>
      <UserDetailComponent userId={params.userId} />
    </Suspense>
  );
}

async function UserDetailComponent({ userId }: { userId: string }) {
  const user = await getUserById(userId);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to all users
      </Link>

      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatarUrls?.large} />
          <AvatarFallback className="text-2xl">
            {getInitials(user.firstName, user.lastName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-muted-foreground">
            {user.headline || "No headline"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm text-muted-foreground">User ID</div>
            <div className="col-span-2 text-sm font-mono">{user.userId}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm text-muted-foreground">Status</div>
            <div className="col-span-2">
              <Badge>{user.status}</Badge>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm text-muted-foreground">Role</div>
            <div className="col-span-2">
              <Badge variant="secondary">{user.role || "-"}</Badge>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-sm text-muted-foreground">Bio</div>
            <div className="col-span-2 text-sm">{user.bio || "N/A"}</div>
          </div>
        </CardContent>

        <CardFooter className="border-t pt-4">
          <UserActions user={user} />
        </CardFooter>
      </Card>
    </div>
  );
}

function UserDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-5 w-32 bg-muted rounded-md"></div>
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 bg-muted rounded-full"></div>
        <div>
          <div className="h-7 w-48 bg-muted rounded-md"></div>
          <div className="h-4 w-32 bg-muted rounded-md mt-2"></div>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-5 w-full bg-muted rounded-md"></div>
          <div className="h-5 w-full bg-muted rounded-md"></div>
          <div className="h-5 w-full bg-muted rounded-md"></div>
        </CardContent>
      </Card>
    </div>
  );
}
