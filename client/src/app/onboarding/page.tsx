import { getCurrentUser } from "@/app/(auth)/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import { OnboardingForm } from "./_components/onboarding-form";

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.headline) {
    redirect("/");
  }

  return (
    <div className="flex items-center justify-center min-h-[90vh] ">
      <Card className="w-full max-w-lg min-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome, {user.firstName}!</CardTitle>
          <CardDescription>
            Just one more step. Let's complete your profile so you can get the
            most out of LearnSphere.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OnboardingForm userData={user} />
        </CardContent>
      </Card>
    </div>
  );
}
