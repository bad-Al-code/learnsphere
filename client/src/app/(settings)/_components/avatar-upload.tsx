"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { getCurrentUser } from "@/app/(auth)/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSessionStore } from "@/stores/session-store";
import { getAvatarUploadUrl } from "../actions";

interface AvatarUploadProps {
  currentAvatarUrl: string | undefined;
  initials: string;
}

export function AvatarUpload({
  currentAvatarUrl,
  initials,
}: AvatarUploadProps) {
  const router = useRouter();
  const user = useSessionStore((state) => state.user);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setError(null);
    const file = event.target.files?.[0];
    if (!file || !user) return;

    startTransition(async () => {
      try {
        const payload = {
          filename: file.name,
          uploadType: "avatar" as const,
          metadata: { userId: user.userId },
        };
        const { data, error: urlError } = await getAvatarUploadUrl(payload);
        if (urlError || !data?.signedUrl) {
          throw new Error(urlError || "Could not get upload URL.");
        }

        const uploadResponse = await fetch(data.signedUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });
        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image.");
        }

        toast.info("Upload complete. Processing image...");

        const poll = async (retries: number): Promise<void> => {
          if (retries <= 0) {
            toast.error("Profile did not update in time.", {
              description: "Please refresh the page manually in a few moments.",
            });
            return;
          }

          const updatedUser = await getCurrentUser();

          if (
            updatedUser?.avatarUrls?.large &&
            updatedUser.avatarUrls.large !== currentAvatarUrl
          ) {
            toast.success("Avatar updated successfully!");
            router.refresh();
            return;
          }

          setTimeout(() => poll(retries - 1), 2000);
        };

        await poll(10);
      } catch (err: any) {
        toast.error("Upload failed", { description: err.message });
        setError(err.message);
      }
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={currentAvatarUrl} alt="User avatar" />
        <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
      </Avatar>

      <Input
        id="avatar-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isPending}
        className="hidden"
      />

      <Button asChild variant="outline" disabled={isPending}>
        <label
          htmlFor="avatar-upload"
          className={`cursor-pointer ${isPending ? "cursor-not-allowed" : ""}`}
        >
          {isPending ? "Uploading..." : "Change Avatar"}
        </label>
      </Button>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}
