'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatBytes } from '@/lib/utils';
import { FileVideo, Upload, X } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

interface VideoUploaderProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  disabled?: boolean;
}
export function VideoUploader({
  onFileSelect,
  selectedFile,
  disabled,
}: VideoUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onFileSelect(file);
      } else {
        toast.error('Invalid file type selected.');
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': ['.mp4', '.mov', '.avi', '.mkv'] },
    multiple: false,
    disabled,
  });

  if (selectedFile) {
    return (
      <Card>
        <CardContent className="">
          <FileVideo className="text-primary h-5 w-5 flex-shrink-0" />
          <p className="flex-grow truncate text-sm font-medium">
            {selectedFile.name} ({formatBytes(selectedFile.size)})
          </p>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onFileSelect(null)}
            disabled={disabled}
            className="hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
        isDragActive ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
      } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="text-muted-foreground flex flex-col items-center gap-2">
        <Upload className="h-8 w-8" />
        <p className="font-semibold">
          Drag & drop a new video file here, or click to select
        </p>
      </div>
    </div>
  );
}

export function VideoUploaderSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex w-full flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-5 w-56" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="flex items-center justify-between rounded-lg border p-3">
        <Skeleton className="h-5 w-64" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}
