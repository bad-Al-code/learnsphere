'use client';

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
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Eye,
  File,
  Image as ImageIcon,
  Save,
  Send,
} from 'lucide-react';
import React from 'react';

export function ComposeMessage() {
  const [date, setDate] = React.useState<Date>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compose New Message</CardTitle>
        <CardDescription>
          Send a message to students or colleagues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="to">To</Label>
            <Select>
              <SelectTrigger id="to">
                <SelectValue placeholder="Select recipients" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="priority">Priority</Label>
            <Select defaultValue="normal">
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" placeholder="Enter message subject" />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label>Quick Templates</Label>
          <div className="flex flex-wrap gap-2">
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
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Type your message here..."
            className="min-h-[150px]"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="grid w-full items-center gap-1.5">
            <Label>Schedule Send (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
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
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label>Attachments</Label>
            <div className="flex gap-2">
              <Button variant="outline">
                <File className="h-4 w-4" /> Add Files
              </Button>
              <Button variant="outline">
                <ImageIcon className="h-4 w-4" /> Add Image
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-2">
        <TooltipProvider>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  <Save className="md: h-4 w-4" />
                  <span className="hidden md:inline">Save Draft</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save Draft</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="md: h-4 w-4" />
                  <span className="hidden md:inline">Schedule</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Schedule Send</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  <Eye className="md: h-4 w-4" />
                  <span className="hidden md:inline">Preview</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Preview Message</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>

        <Button>
          <Send className="h-4 w-4" />
          Send Message
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ComposeMessageSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-48" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-24" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-36" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-[150px] w-full" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 md:w-28" />
          <Skeleton className="h-10 w-10 md:w-28" />
          <Skeleton className="h-10 w-10 md:w-24" />
        </div>
        <Skeleton className="h-10 w-32" />
      </CardFooter>
    </Card>
  );
}
