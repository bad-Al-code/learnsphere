'use client';

import { File as FileIcon, UploadCloud, X } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
  disabled?: boolean;
}

export function FileUploader({
  onFileSelect,
  onFileRemove,
  selectedFile,
  disabled,
}: FileUploaderProps) {
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
    multiple: false,
  });

  if (selectedFile) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center gap-3 p-3">
          <FileIcon className="text-primary h-5 w-5 flex-shrink-0" />
          <p className="flex-grow truncate text-sm font-medium">
            {selectedFile.name}
          </p>
          <Button
            variant="ghost"
            size="icon"
            onClick={onFileRemove}
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
    <Card
      {...getRootProps()}
      className={`cursor-pointer border-dashed transition-colors ${
        isDragActive ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
      } ${disabled ? 'pointer-events-none opacity-50' : ''}`}
    >
      <input {...getInputProps()} disabled={disabled} />
      <CardContent className="text-muted-foreground flex flex-col items-center justify-center gap-3 p-8 text-center">
        <UploadCloud className="text-primary h-10 w-10" />
        <p className="text-sm font-medium">
          Drag & drop a file here, or click to select
        </p>
      </CardContent>
    </Card>
  );
}
