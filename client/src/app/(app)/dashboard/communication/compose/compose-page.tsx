'use client';

import { RichTextEditor } from '@/components/text-editor';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  CalendarClock,
  Calendar as CalendarIcon,
  Eye,
  File,
  Image as ImageIcon,
  Save,
  Send,
} from 'lucide-react';
import { useState } from 'react';

export function ComposePage() {
  const [date, setDate] = useState<Date>();
  const [editorContent, setEditorContent] = useState('');

  const handleContentChange = (html: string) => {
    setEditorContent(html);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compose New Message</CardTitle>
        <CardDescription>
          Send a message to students or colleagues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="to">To</Label>
            <Select>
              <SelectTrigger id="to">
                <SelectValue placeholder="Select recipients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-students">All Students</SelectItem>
                <SelectItem value="data-science">
                  Data Science Students
                </SelectItem>
                <SelectItem value="web-dev">
                  Web Development Students
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="priority">Priority</Label>
            <Select defaultValue="normal">
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" placeholder="Enter message subject" />
        </div>

        <div>
          <Label className="text-sm">Quick Templates</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Assignment Extension
            </Button>
            <Button variant="outline" size="sm">
              General Feedback
            </Button>
            <Button variant="outline" size="sm">
              Office Hours Invitation
            </Button>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="message">Message</Label>
          <RichTextEditor
            initialContent={editorContent}
            editable={true}
            onChange={handleContentChange}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="schedule">Schedule Send (Optional)</Label>
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <Button
                  id="schedule"
                  variant={'outline'}
                  className={cn(
                    'justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>dd/mm/yyyy --:--</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  captionLayout="dropdown"
                  className="rounded-md border shadow-sm"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label>Attachments</Label>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <File className="h-4 w-4" /> Add Files
              </Button>
              <Button variant="outline" className="flex-1">
                <ImageIcon className="h-4 w-4" /> Add Image
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="ghost">
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button variant="ghost">
            <CalendarClock className="h-4 w-4" />
            Schedule
          </Button>
          <Button variant="ghost">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
        </div>
        <Button>
          <Send className="h-4 w-4" />
          Send Message
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ComposePageSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-64" />
        <Skeleton className="mt-1 h-5 w-80" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Skeleton className="h-5 w-8" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="grid gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-5 w-28" />
          <div className="mt-2 flex flex-wrap gap-2">
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-40" />
          </div>
        </div>
        <div className="grid gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-[180px] w-full" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="grid gap-2">
            <Skeleton className="h-5 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-10 w-36" />
      </CardFooter>
    </Card>
  );
}
