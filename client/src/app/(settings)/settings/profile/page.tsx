import { getCurrentUser } from '@/app/(auth)/actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { redirect } from 'next/navigation';
import { AvatarUpload } from '../../_components/avatar-upload';
import { ProfileForm } from '../../_components/profile-form';

const getInitials = (firstName: string | null, lastName: string | null) => {
  const first = firstName?.[0] || '';
  const last = lastName?.[0] || '';
  return `${first}${last}`.toUpperCase();
};

export default async function ProfileSettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const initials = getInitials(user.firstName, user.lastName);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>My Account</CardTitle>
          <CardDescription>
            Manage your account settings and personal information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Desktop Layout */}
          <div className="hidden grid-cols-1 gap-8 lg:grid lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <ProfileForm userData={user} />
            </div>

            <div className="lg:col-span-1">
              <h3 className="mb-4 text-lg font-medium">Avatar</h3>
              <div className="flex flex-col items-center justify-center rounded-lg border p-6 text-center">
                <AvatarUpload
                  currentAvatarUrl={user.avatarUrls?.large}
                  initials={initials}
                />
                <p className="text-muted-foreground mt-4 text-sm">
                  Upload a new profile picture.
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="space-y-6 lg:hidden">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="avatar">Avatar</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <ProfileForm userData={user} />
              </TabsContent>

              <TabsContent value="avatar">
                <h3 className="mb-4 text-lg font-medium">Avatar</h3>
                <div className="flex flex-col items-center justify-center rounded-lg border p-6 text-center">
                  <AvatarUpload
                    currentAvatarUrl={user.avatarUrls?.large}
                    initials={initials}
                  />
                  <p className="text-muted-foreground mt-4 text-sm">
                    Upload a new profile picture.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
