"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSessionStore } from "@/stores/session-store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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
  const [isPending, setIsPending] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setError(null);
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsPending(true);

    try {
      const payload = {
        filename: file.name,
        uploadType: "avatar" as const,
        metadata: { userId: user.userId },
      };

      const { data, error: urlError } = await getAvatarUploadUrl(payload);

      if (urlError || !data?.signedUrl) {
        toast.error(urlError || "Could not get upload url");
        throw new Error(urlError || "Could not get upload URL.");
      }

      const uploadResponse = await fetch(data.signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadResponse.ok) {
        toast.error("Failed to upload image.");
        throw new Error("Failed to upload image.");
      }

      toast.success("Image uploaded successfully");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPending(false);
    }
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

      <Button asChild variant="outline" disabled={isPending}>
        <label htmlFor="avatar-upload" className="cursor-pointer">
          {isPending ? "Uploading..." : "Change Avatar"}
        </label>
      </Button>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}
