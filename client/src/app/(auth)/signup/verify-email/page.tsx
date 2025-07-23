import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MailCheck } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <MailCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="mt-4 text-2xl">Check your inbox</CardTitle>
          <CardDescription>
            We've sent a verification link to your email address. Please click
            the link to complete your registration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Didn't receive an email? Check your spam folder or try signing up
            again.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
