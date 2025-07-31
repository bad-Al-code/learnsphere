import { getCurrentUser } from "@/app/(auth)/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect } from "next/navigation";
import { AvatarUpload } from "../../_components/avatar-upload";
import { ProfileForm } from "../../_components/profile-form";

const getInitials = (firstName: string | null, lastName: string | null) => {
  const first = firstName?.[0] || "";
  const last = lastName?.[0] || "";
  return `${first}${last}`.toUpperCase();
};

export default async function ProfileSettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
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
          <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ProfileForm userData={user} />
            </div>

            <div className="lg:col-span-1">
              <h3 className="text-lg font-medium mb-4">Avatar</h3>
              <div className="flex flex-col items-center justify-center text-center p-6 border rounded-lg">
                <AvatarUpload
                  currentAvatarUrl={user.avatarUrls?.large}
                  initials={initials}
                />
                <p className="text-sm text-muted-foreground mt-4">
                  Upload a new profile picture.
                </p>
              </div>
            </div>
          </div>

          {/* For small screens: use Tabs */}
          <div className="lg:hidden">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="avatar">Avatar</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <ProfileForm userData={user} />
              </TabsContent>

              <TabsContent value="avatar">
                <div>
                  <h3 className="text-lg font-medium mb-4">Avatar</h3>
                  <div className="flex flex-col items-center justify-center text-center p-6 border rounded-lg">
                    <AvatarUpload
                      currentAvatarUrl={user.avatarUrls?.large}
                      initials={initials}
                    />
                    <p className="text-sm text-muted-foreground mt-4">
                      Upload a new profile picture.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
