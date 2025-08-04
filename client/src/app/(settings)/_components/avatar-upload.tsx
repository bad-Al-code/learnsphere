"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setError(null);
    const file = event.target.files?.[0];
    if (!file || !user) return;

    const tempUrl = URL.createObjectURL(file);
    setPreviewUrl(tempUrl);

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

        toast.success("Avatar uploaded successfully!");

        router.refresh();
      } catch (err: any) {
        toast.error(err.message || "Upload failed");
        setPreviewUrl(null);
        setError(err.message);
      }
    });
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const displayUrl = previewUrl || currentAvatarUrl;

  return (
    <Dialog>
      <div className="flex flex-col items-center space-y-4">
        <DialogTrigger asChild>
          <button
            disabled={!displayUrl}
            className="rounded-full ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none"
          >
            <Avatar className="h-24 w-24 cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage src={displayUrl} alt="User avatar" />
              <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
            </Avatar>
          </button>
        </DialogTrigger>

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
            className={`cursor-pointer ${
              isPending ? "cursor-not-allowed" : ""
            }`}
          >
            {isPending ? "Uploading..." : "Change Avatar"}
          </label>
        </Button>

        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}
      </div>

      {displayUrl && (
        <>
          <DialogContent className="p-0.5 shadow-2xl/20">
            <Image
              src={displayUrl}
              alt="User avatar preview"
              width={800}
              height={800}
              className="rounded-md object-cover"
            />
          </DialogContent>
        </>
      )}
    </Dialog>
  );
}
