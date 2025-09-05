'use client';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import axios from 'axios';
import { ImageOff, UploadCloud, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import {
  getCourseThumbnailUploadUrl,
  removeCourseThumbnail,
} from '../../actions';

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
  const [uploadProgress, setUploadProgress] = useState(0);
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
          throw new Error(error || 'Could not get upload URL.');
        }

        await axios.put(data.signedUrl, file, {
          headers: { 'Content-Type': file.type },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total ?? file.size)
            );
            setUploadProgress(percent);
          },
        });

        toast.success('Thumbnail uploaded successfully!', {
          description:
            'It may take a moment for the new image to appear everywhere.',
        });

        router.refresh();
      } catch (err: any) {
        toast.error('Upload failed', { description: err.message });

        setPreviewUrl(null);
      } finally {
        setUploadProgress(0);
      }
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      const result = await removeCourseThumbnail(courseId);

      if (result.error) {
        toast.error('Failed to remove thumbnail', {
          description: result.error,
        });
      } else {
        toast.success('Thumbnail removed successfully.');

        setPreviewUrl(null);
        router.refresh();
      }
    });
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    setPreviewUrl(null);
  }, [currentImageUrl]);

  const displayUrl = previewUrl || currentImageUrl;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Thumbnail</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AspectRatio ratio={16 / 9} className="bg-muted rounded-md border">
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt="Course thumbnail"
              fill
              className="object-cover"
            />
          ) : (
            <div className="text-muted-foreground flex h-full flex-col items-center justify-center">
              <ImageOff className="h-8 w-8" />
              <p className="mt-2 text-sm">No thumbnail</p>
            </div>
          )}
        </AspectRatio>

        {isPending && <Progress value={uploadProgress} className="w-full" />}

        <input
          id="thumbnail-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isPending}
          className="hidden"
        />
        <div className="flex justify-center gap-2">
          <Button
            asChild
            variant="outline"
            className="flex-1"
            disabled={isPending}
          >
            <label
              htmlFor="thumbnail-upload"
              className={`cursor-pointer ${isPending ? 'cursor-not-allowed' : ''}`}
            >
              <UploadCloud className="h-4 w-4" />
              {isPending ? `Uploading... ${uploadProgress}%` : 'Change Image'}
            </label>
          </Button>

          {displayUrl && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={handleRemove}
                    disabled={isPending}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Remove thumbnail</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
