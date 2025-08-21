import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { ImageUploadDialogProps, VideoEmbedDialogProps } from './types';

export function VideoEmbedDialog({ onSetVideo }: VideoEmbedDialogProps) {
  const [videoUrl, setVideoUrl] = useState('');

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  const handleSetVideo = () => {
    if (videoUrl) {
      const embedUrl = getEmbedUrl(videoUrl);
      onSetVideo(embedUrl);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Embed Video</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="video-url">Video URL</Label>
          <Input
            id="video-url"
            placeholder="Paste a YouTube or Vimeo URL"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={handleSetVideo}>Embed Video</Button>
      </DialogFooter>
    </DialogContent>
  );
}

export function ImageUploadDialog({ onSetImage }: ImageUploadDialogProps) {
  const [imageUrl, setImageUrl] = useState('');

  const handleSetImage = () => {
    if (imageUrl) {
      onSetImage(imageUrl);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Image</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="image-url">Image URL</Label>
          <Input
            id="image-url"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>
        <Separator className="my-2" />
        <div className="grid gap-2">
          <Label htmlFor="upload">Or upload a file</Label>
          <Input id="upload" type="file" disabled />
          <p className="text-muted-foreground text-xs">
            File upload is not implemented. Please use a URL.
          </p>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={handleSetImage}>Set Image</Button>
      </DialogFooter>
    </DialogContent>
  );
}
