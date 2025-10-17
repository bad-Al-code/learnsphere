'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Bookmark,
  Download,
  Maximize2,
  MessageSquare,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useState } from 'react';
import type { Lesson } from '../../schema/course-detail.schema';

interface VideoLessonProps {
  lesson: Lesson;
}

export function VideoLesson({ lesson }: VideoLessonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1');
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [notes, setNotes] = useState<
    Array<{ id: string; timestamp: number; content: string }>
  >([]);
  const [newNote, setNewNote] = useState('');
  const [comments, setComments] = useState<
    Array<{ id: string; author: string; content: string; replies: number }>
  >([
    {
      id: '1',
      author: 'John Doe',
      content: 'Great explanation of React hooks!',
      replies: 2,
    },
    {
      id: '2',
      author: 'Jane Smith',
      content: 'Can you clarify the useEffect dependency array?',
      replies: 1,
    },
  ]);
  const [newComment, setNewComment] = useState('');

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes([
        ...notes,
        { id: Date.now().toString(), timestamp: currentTime, content: newNote },
      ]);
      setNewNote('');
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: Date.now().toString(),
          author: 'You',
          content: newComment,
          replies: 0,
        },
      ]);
      setNewComment('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="mb-4 text-6xl">🎬</div>
            <p className="text-white">Video Player</p>
            <p className="text-sm text-gray-400">{lesson.videoUrl}</p>
          </div>
        </div>

        {/* Video Controls */}
        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black to-transparent p-4">
          <div className="mb-3 h-1 bg-gray-700">
            <div className="bg-primary h-full w-1/3"></div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? '⏸' : '▶'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <span className="text-xs text-white">2:45 / 15:30</span>
            </div>

            <div className="flex items-center gap-2">
              <Select value={playbackSpeed} onValueChange={setPlaybackSpeed}>
                <SelectTrigger className="h-8 w-20 border-0 bg-white/20 text-xs text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5x</SelectItem>
                  <SelectItem value="1">1x</SelectItem>
                  <SelectItem value="1.5">1.5x</SelectItem>
                  <SelectItem value="2">2x</SelectItem>
                </SelectContent>
              </Select>

              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => setShowSubtitles(!showSubtitles)}
              >
                {showSubtitles ? 'CC' : 'CC'}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark
                  className={`h-4 w-4 ${isBookmarked ? 'fill-white' : ''}`}
                />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Subtitles */}
        {showSubtitles && (
          <div className="absolute right-0 bottom-20 left-0 text-center">
            <p className="bg-black/70 px-4 py-2 text-sm text-white">
              Welcome to this video lesson on advanced React patterns...
            </p>
          </div>
        )}
      </div>

      {/* Tabs for Transcript, Notes, Comments */}
      <Tabs defaultValue="transcript" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
          <TabsTrigger value="comments">
            Comments ({comments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transcript" className="space-y-3">
          <Card>
            <CardContent className="pt-6">
              <ScrollArea className="h-48">
                <p className="text-muted-foreground pr-4 text-sm leading-relaxed">
                  In this lesson, we'll explore advanced React patterns
                  including custom hooks, render props, and compound components.
                  These patterns will help you write more maintainable and
                  reusable code. We'll start by understanding the problem each
                  pattern solves, then implement them step by step.
                </p>
              </ScrollArea>
            </CardContent>
          </Card>
          <Button variant="outline" className="w-full gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Download Transcript
          </Button>
        </TabsContent>

        <TabsContent value="notes" className="space-y-3">
          <div className="space-y-2">
            <Textarea
              placeholder="Add a note at timestamp 2:45..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-20"
            />
            <Button onClick={handleAddNote} className="w-full">
              Add Note
            </Button>
          </div>

          <ScrollArea className="h-48">
            <div className="space-y-2 pr-4">
              {notes.map((note) => (
                <Card key={note.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-2">
                          {Math.floor(note.timestamp)}:00
                        </Badge>
                        <p className="text-foreground text-sm">
                          {note.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="comments" className="space-y-3">
          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-20"
            />
            <Button onClick={handleAddComment} className="w-full">
              Post Comment
            </Button>
          </div>

          <ScrollArea className="h-48">
            <div className="space-y-3 pr-4">
              {comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold">
                        {comment.author[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{comment.author}</p>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {comment.content}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-xs"
                        >
                          <MessageSquare className="mr-1 h-3 w-3" />
                          Reply ({comment.replies})
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
