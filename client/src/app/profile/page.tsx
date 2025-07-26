import { getCurrentUser } from "@/app/(auth)/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import { AvatarUpload } from "./_components/avatar-upload";
import { ProfileForm } from "./_components/profile-form";

const getInitials = (firstName: string | null, lastName: string | null) => {
  const first = firstName?.[0] || "";
  const last = lastName?.[0] || "";
  return `${first}${last}`.toUpperCase();
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const initials = getInitials(user.firstName, user.lastName);

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column for basic info */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="items-center text-center">
              <AvatarUpload
                currentAvatarUrl={user.avatarUrls?.large}
                initials={initials}
              />
              <CardTitle className="text-2xl">
                {user.firstName} {user.lastName}
              </CardTitle>
              <CardDescription>
                {user.headline || "No headline set."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                {user.bio || "No bio set."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column for editing */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>
                Update your personal information here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm userData={user} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
