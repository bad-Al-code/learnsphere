import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UpdatePasswordForm } from "../../_components/update-password-form";

export default function SecuritySettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>
          Manage your account security settings, including changing your
          password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold mb-4">Change Password</h3>
        <UpdatePasswordForm />
      </CardContent>
    </Card>
  );
}
