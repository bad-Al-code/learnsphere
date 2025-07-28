import { getCurrentUser } from "@/app/(auth)/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import { NotificationsForm } from "../../_components/notification-form";

export default async function NotificationSettingsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const settings = user.settings || {
    notifications: { newCourseAlerts: false, weeklyNewsletter: false },
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Manage how you receive notifications from LearnSphere.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NotificationsForm settings={settings} />
      </CardContent>
    </Card>
  );
}
