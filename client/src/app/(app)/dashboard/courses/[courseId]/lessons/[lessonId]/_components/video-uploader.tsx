'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, formatBytes } from '@/lib/utils';
import { Eye, FileVideo, Trash2, Upload } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface VideoFile {
  name: string;
  size: number;
}

interface VideoUploaderProps {
  initialFile?: VideoFile | null;
}

export function VideoUploader({
  initialFile = { name: 'lesson_intro.mp4', size: 243423432 },
}: VideoUploaderProps) {
  const [currentFile, setCurrentFile] = useState<VideoFile | null>(initialFile);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setCurrentFile({
        name: file.name,
        size: file.size,
      });

      console.log('File accepted:', file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': ['.mp4', '.mov', '.avi'] },
    multiple: false,
  });

  const handleRemove = () => {
    setCurrentFile(null);
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={cn(
          'relative flex w-full flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 text-center transition-colors',
          isDragActive
            ? 'border-primary bg-primary/10'
            : 'border-muted-foreground/30'
        )}
      >
        <input {...getInputProps()} />
        <FileVideo className="text-muted-foreground h-10 w-10" />
        <p className="font-semibold">Upload video file or paste video URL</p>
        <Button variant="outline" type="button">
          <Upload className="h-4 w-4" />
          Upload Video File
        </Button>
        {isDragActive && (
          <div className="bg-background/80 absolute inset-0 flex items-center justify-center backdrop-blur-sm">
            <p className="text-primary text-lg font-semibold">Drop it here!</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Input placeholder="Or paste video URL here..." />
        <Input placeholder="HLS stream URL (.m3u8)" />
      </div>

      {currentFile && (
        <div className="bg-muted/50 flex items-center justify-between rounded-lg border p-3">
          <div className="flex flex-col">
            <div className="text-muted-foreground text-sm">Current video: </div>
            <span className="text-foreground font-medium">
              {currentFile.name} ({formatBytes(currentFile.size)})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button variant="destructive" size="sm" onClick={handleRemove}>
              <Trash2 className="h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      )}
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
