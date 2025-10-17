'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Reply, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

interface DiscussionsTabProps {
  courseId: string;
}

export function DiscussionsTab({ courseId }: DiscussionsTabProps) {
  const [discussions, setDiscussions] = useState([
    {
      id: '1',
      author: 'John Doe',
      title: 'How to use custom hooks effectively?',
      content:
        "I'm struggling with understanding when to create custom hooks vs using regular functions.",
      replies: 3,
      likes: 5,
      timestamp: '2 hours ago',
      isAnswered: true,
    },
    {
      id: '2',
      author: 'Jane Smith',
      title: 'Best practices for React performance',
      content:
        'What are the best practices for optimizing React component performance?',
      replies: 7,
      likes: 12,
      timestamp: '1 day ago',
      isAnswered: true,
    },
  ]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handlePostDiscussion = () => {
    if (newTitle.trim() && newContent.trim()) {
      setDiscussions([
        {
          id: Date.now().toString(),
          author: 'You',
          title: newTitle,
          content: newContent,
          replies: 0,
          likes: 0,
          timestamp: 'just now',
          isAnswered: false,
        },
        ...discussions,
      ]);
      setNewTitle('');
      setNewContent('');
    }
  };

  return (
    <div className="space-y-6">
      {/* New Discussion */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Start a Discussion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Discussion title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Textarea
            placeholder="Share your question or thought..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="min-h-24"
          />
          <Button onClick={handlePostDiscussion} className="w-full">
            Post Discussion
          </Button>
        </CardContent>
      </Card>

      {/* Discussions List */}
      <div className="space-y-3">
        {discussions.map((discussion) => (
          <Card
            key={discussion.id}
            className="hover:bg-muted/50 transition-colors"
          >
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-foreground font-semibold">
                        {discussion.title}
                      </h3>
                      {discussion.isAnswered && (
                        <Badge variant="default" className="text-xs">
                          Answered
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {discussion.content}
                    </p>
                  </div>
                </div>
                <div className="text-muted-foreground flex items-center justify-between text-xs">
                  <span>
                    {discussion.author} • {discussion.timestamp}
                  </span>
                  <div className="flex items-center gap-4">
                    <button className="hover:text-foreground flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {discussion.likes}
                    </button>
                    <button className="hover:text-foreground flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {discussion.replies}
                    </button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="hover:text-foreground flex items-center gap-1">
                          <Reply className="h-3 w-3" />
                          Reply
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reply to Discussion</DialogTitle>
                          <DialogDescription>
                            {discussion.title}
                          </DialogDescription>
                        </DialogHeader>
                        <Textarea
                          placeholder="Your reply..."
                          className="min-h-24"
                        />
                        <Button className="w-full">Post Reply</Button>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
