import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UpdatePasswordForm } from '../../_components/update-password-form';
import { SessionHistory } from './_components/session-history';

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Change your password here. It's a good practice to use a strong
            password that you're not using elsewhere.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UpdatePasswordForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session history</CardTitle>
          <CardDescription>
            This is a list of devices that have logged into your account. Remove
            any sessions you do not recognize.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SessionHistory />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Authenticator app</CardTitle>
          <CardDescription>
            Use an authenticator app (e.g., Google Authenticator) on your phone
            to generate verification codes for an extra layer of security.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between border-t p-6">
          <div>
            <p className="text-sm font-medium">Enable Authenticator App</p>
            <p className="text-muted-foreground text-sm">
              Codes are sent via your authenticator app.
            </p>
          </div>
          <Button variant="outline" disabled>
            Enable (Coming Soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
