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
    <div className="space-y-8">
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
      {/* 
      <Card>
        <CardHeader>
          <CardTitle>Public Profile Details</CardTitle>
          <CardDescription>
            This information will be visible to other users on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="">
            <h3 className="font-medium text-sm">Headline</h3>
            <p className="text-muted-foreground">
              {user.headline || "Not set"}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-sm">Bio</h3>
            <p className="text-muted-foreground">{user.bio || "Not set"}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm">Website</h3>
            {user.websiteUrl ? (
              <Link
                href={user.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline hover:text-blue-700"
              >
                {user.websiteUrl}
              </Link>
            ) : (
              <p className="text-muted-foreground">Not set</p>
            )}
          </div>
        </CardContent>
      </Card> */}
      {/* 
      <Card>
        <CardHeader>
          <CardTitle>Connect with Git service</CardTitle>
          <CardDescription>
            By enabling Git service authentication, you can easily access your
            projects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" disabled>
              <Github className="mr-2 h-4 w-4" />
              GitHub (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
