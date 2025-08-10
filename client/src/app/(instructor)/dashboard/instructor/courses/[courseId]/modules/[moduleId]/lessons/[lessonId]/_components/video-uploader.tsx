'use client';

import { Progress } from '@/components/ui/progress';
import { VideoPlayer } from '@/components/video-player/video-player';
import axios from 'axios';
import { AlertTriangle, UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { getLessonVideoUploadUrl } from '../../../../../actions';

interface VideoUploaderProps {
  courseId: string;
  lessonId: string;
  initialVideoUrl: string | null | undefined;
}

export function VideoUploader({
  courseId,
  lessonId,
  initialVideoUrl,
}: VideoUploaderProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState(initialVideoUrl);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const res = await getLessonVideoUploadUrl(lessonId, file.name);
      if (res.error || !res.data?.signedUrl) {
        throw new Error(res.error || 'Could not get upload URL.');
      }
      const { signedUrl } = res.data;

      await axios.put(signedUrl, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(percentCompleted);
        },
      });

      toast.success('Upload complete! Your video is now processing.', {
        description:
          "This may take a few minutes. We will refresh the page when it's ready.",
      });

      const pollForProcessing = setInterval(async () => {
        router.refresh();
      }, 5000);

      setTimeout(() => clearInterval(pollForProcessing), 60000 * 5);
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': ['.mp4', '.mov'] },
    multiple: false,
  });

  return (
    <div className="space-y-4">
      {videoUrl && !isUploading && (
        <div className="space-y-2">
          <p className="font-medium">Current Video:</p>
          <VideoPlayer src={videoUrl} />
        </div>
      )}

      {initialVideoUrl && !videoUrl && !isUploading && (
        <div className="flex items-center gap-2 rounded-md border p-4 text-center">
          <AlertTriangle className="h-8 w-8" />
          <div className="text-left">
            <p className="font-semibold">Video is processing</p>
            <p className="text-muted-foreground text-xs">
              The page will automatically update when your video is ready.
            </p>
          </div>
        </div>
      )}

      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-10 text-center ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'} ${isUploading ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <input {...getInputProps()} disabled={isUploading} />
        <UploadCloud className="text-muted-foreground mx-auto h-10 w-10" />
        <p className="text-muted-foreground mt-2 text-sm">
          {isUploading
            ? 'Uploading...'
            : 'Drag & drop a video, or click to browse'}
        </p>
      </div>

      {isUploading && (
        <div className="mt-4">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-muted-foreground mt-2 text-center text-sm">
            {uploadProgress}% complete
          </p>
        </div>
      )}
    </div>
  );
}
