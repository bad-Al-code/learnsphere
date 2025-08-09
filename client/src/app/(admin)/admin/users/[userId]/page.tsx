import { getUserById } from '@/app/(settings)/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { AdminEditProfileForm } from './_components/admin-edit-profile-form';
import { UserActions } from './_components/user-actions';

const getInitials = (firstName?: string | null, lastName?: string | null) => {
  const first = firstName?.[0] || '';
  const last = lastName?.[0] || '';
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
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm"
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
            {user.headline || 'No headline'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-muted-foreground text-sm">User ID</div>
            <div className="col-span-2 font-mono text-sm">{user.userId}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-muted-foreground text-sm">Status</div>
            <div className="col-span-2">
              <Badge>{user.status}</Badge>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-muted-foreground text-sm">Role</div>
            <div className="col-span-2">
              <Badge variant="secondary">{user.role || '-'}</Badge>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-muted-foreground text-sm">Bio</div>
            <div className="col-span-2 text-sm">{user.bio || 'N/A'}</div>
          </div>
        </CardContent>

        <CardFooter className="border-t pt-4">
          <UserActions user={user} />
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Edit User Profile</CardTitle>
          <CardDescription>
            Modify the user's profile details below. Changes are permanent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminEditProfileForm user={user} />
        </CardContent>
      </Card>
    </div>
  );
}

function UserDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="bg-muted h-5 w-32 rounded-md"></div>
      <div className="flex items-center gap-4">
        <div className="bg-muted h-16 w-16 rounded-full"></div>
        <div>
          <div className="bg-muted h-7 w-48 rounded-md"></div>
          <div className="bg-muted mt-2 h-4 w-32 rounded-md"></div>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted h-5 w-full rounded-md"></div>
          <div className="bg-muted h-5 w-full rounded-md"></div>
          <div className="bg-muted h-5 w-full rounded-md"></div>
        </CardContent>
      </Card>
    </div>
  );
}
