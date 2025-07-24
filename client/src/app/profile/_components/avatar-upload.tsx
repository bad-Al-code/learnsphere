"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setError(null);
    const file = event.target.files?.[0];
    if (!file) return;

    startTransition(async () => {
      try {
        // 1. Get the presigned URL from our server
        const { data, error: urlError } = await getAvatarUploadUrl({
          filename: file.name,
        });
        if (urlError || !data?.uploadUrl) {
          throw new Error(urlError || "Could not get upload URL.");
        }

        // 2. Upload the file directly to S3
        const uploadResponse = await fetch(data.uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image.");
        }

        // 3. Refresh the page to show the new avatar
        // Note: There might be a short delay as the backend processes the image.
        router.refresh();
      } catch (err: any) {
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
        className="hidden"
      />
      <Button asChild variant="outline">
        <label htmlFor="avatar-upload" className="cursor-pointer">
          {isPending ? "Uploading..." : "Change Avatar"}
        </label>
      </Button>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}
