import { getCurrentUser } from "@/app/(auth)/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle>My Account</CardTitle>
        <CardDescription>
          Manage your account settings and personal information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <ProfileForm userData={user} />

        <div>
          <h3 className="text-lg font-medium">Avatar</h3>
          <div className="flex items-center gap-x-8 mt-4 p-4 border rounded-lg">
            <AvatarUpload
              currentAvatarUrl={user.avatarUrls?.large}
              initials={initials}
            />
            <div className="text-sm text-muted-foreground">
              <p>Upload a new avatar.</p>
              <p>Recommended size: 400x400px.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
