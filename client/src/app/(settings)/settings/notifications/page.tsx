import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function NotificationSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Manage how you receive notifications from LearnSphere.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="invoice-email" className="font-semibold">
              Invoice in email
            </Label>
            <p className="text-sm text-muted-foreground">
              You can receive your invoices in email (to your primary email
              address) attached as PDF.
            </p>
          </div>
          <Switch id="invoice-email" disabled />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <Label htmlFor="failed-deployments" className="font-semibold">
              Failed deployments
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive automatic notifications for failed app and static site
              deployments.
            </p>
          </div>
          <Switch id="failed-deployments" disabled />
        </div>
      </CardContent>
    </Card>
  );
}
