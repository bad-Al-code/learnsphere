"use client";

import { UploadCloud } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { getCourseThumbnailUploadUrl } from "@/app/(admin)/actions";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

interface ThumbnailUploaderProps {
  courseId: string;
  currentImageUrl: string | null | undefined;
}

export function ThumbnailUploader({
  courseId,
  currentImageUrl,
}: ThumbnailUploaderProps) {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const tempUrl = URL.createObjectURL(file);
    setPreviewUrl(tempUrl);

    startTransition(async () => {
      try {
        const { data, error } = await getCourseThumbnailUploadUrl(
          courseId,
          file.name
        );
        if (error || !data?.signedUrl) {
          throw new Error(error || "Could not get upload URL.");
        }

        const uploadResponse = await fetch(data.signedUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload thumbnail.");
        }

        toast.success("Thumbnail uploaded.", {
          description:
            "It may take a few moments for the change to appear everywhere.",
        });

        router.refresh();
      } catch (err: any) {
        toast.error("Upload failed", { description: err.message });
        setPreviewUrl(null);
      }
    });
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const displayUrl = previewUrl || currentImageUrl;

  return (
    <div className="space-y-4">
      <AspectRatio ratio={16 / 9} className="rounded-md border bg-muted">
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt="Course thumbnail"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <UploadCloud className="h-8 w-8" />
            <p className="text-sm mt-2">No thumbnail uploaded</p>
          </div>
        )}
      </AspectRatio>

      <input
        id="thumbnail-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isPending}
        className="hidden"
      />
      <Button asChild variant="outline" className="w-full" disabled={isPending}>
        <label
          htmlFor="thumbnail-upload"
          className={`cursor-pointer ${isPending ? "cursor-not-allowed" : ""}`}
        >
          {isPending ? "Uploading..." : "Change Thumbnail"}
        </label>
      </Button>
    </div>
  );
}
