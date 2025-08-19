'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Calendar as CalendarIcon,
  FileUp,
  Plus,
  Upload,
  Video,
} from 'lucide-react';
import React, { useState } from 'react';

interface FormDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  form: React.ReactNode;
  footer: React.ReactNode;
}

export function FormDialog({
  trigger,
  title,
  description,
  form,
  footer,
}: FormDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">{form}</div>
        <DialogFooter>{footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function AddModuleForm() {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="title">Module Title</Label>
        <Input id="title" placeholder="Enter module title" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Module Description</Label>
        <Textarea
          id="description"
          placeholder="Describe what students will learn"
        />
      </div>
    </>
  );
}

export function AddLessonForm() {
  const [lessonType, setLessonType] = useState('text');

  const renderLessonContent = () => {
    switch (lessonType) {
      case 'video':
        return (
          <div className="grid gap-2">
            <Label>Video Content</Label>

            <div className="flex h-32 w-full flex-col items-center justify-center rounded-md border-2 border-dashed p-2">
              <Upload className="text-muted-foreground mb-2 h-8 w-8" />
              <Button variant="outline">
                <Video className="h-4 w-4" /> Upload Video
              </Button>
              <Input className="mt-2" placeholder="Or paste video URL..." />
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Quiz Content</Label>
              <Textarea placeholder="Quiz instructions and description..." />
            </div>
            <div className="grid gap-2">
              <Label>Sample Question</Label>
              <Input placeholder="Enter your question..." />
            </div>
            <div className="grid gap-2">
              <Label>Options</Label>
              <Input placeholder="Option A" />
              <Input placeholder="Option B" />
            </div>
          </div>
        );

      case 'text':
      default:
        return (
          <div className="grid gap-2">
            <Label>Text Content</Label>
            <Textarea
              placeholder="Write your lesson content here..."
              className="min-h-32"
            />
          </div>
        );
    }
  };

  return (
    <>
      <div className="grid gap-2">
        <Label>Lesson Title</Label>
        <Input placeholder="Enter lesson title" />
      </div>
      <div className="grid gap-2">
        <Label>Lesson Type</Label>
        <Select value={lessonType} onValueChange={setLessonType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text/Reading</SelectItem>
            <SelectItem value="video">Video Lesson</SelectItem>
            <SelectItem value="quiz">Quiz/Assessment</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {renderLessonContent()}
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label>Duration (minutes)</Label>
          <Input type="number" placeholder="15" />
        </div>
        <div className="grid gap-2">
          <Label>Lesson Order</Label>
          <Input type="number" placeholder="1" />
        </div>
      </div>
    </>
  );
}

export function CreateAssignmentForm() {
  const [date, setDate] = useState<Date>();
  return (
    <>
      <div className="grid gap-2">
        <Label>Assignment Title</Label>
        <Input placeholder="Enter assignment title" />
      </div>
      <div className="grid gap-2">
        <Label>Description</Label>
        <Textarea placeholder="Describe the assignment requirements" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="grid gap-2">
          <Label>Points</Label>
          <Input type="number" placeholder="100" />
        </div>
        <div className="grid gap-2">
          <Label>Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="project">Project</SelectItem>
              <SelectItem value="quiz">Quiz</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Due Date</Label>
          <Popover modal={false}>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="h-4 w-4" />
                {date ? format(date, 'PPP') : <span>dd/mm/yyyy</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow-sm"
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </>
  );
}

export function AddResourceForm() {
  return (
    <>
      <div className="grid gap-2">
        <Label>Resource Title</Label>
        <Input placeholder="Enter resource title" />
      </div>
      <div className="grid gap-2">
        <Label>Resource Type</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="link">Link</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label>Content</Label>
        <div className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed">
          <Button variant="outline">
            <FileUp className="h-4 w-4" /> Choose File
          </Button>
          <span className="text-muted-foreground text-xs">or</span>
          <Input placeholder="Paste URL here..." />
        </div>
      </div>
    </>
  );
}

export function PageWithModals() {
  return (
    <div className="space-y-4 p-8">
      <h2 className="text-xl font-bold">Content Management</h2>
      <div className="flex gap-2">
        <FormDialog
          trigger={
            <Button variant="outline">
              <Plus className="h-4 w-4" /> Add Module
            </Button>
          }
          title="Add New Module"
          description="Create a new module for your course content."
          form={<AddModuleForm />}
          footer={<Button>Create Module</Button>}
        />
        <FormDialog
          trigger={
            <Button variant="outline">
              <Plus className="h-4 w-4" /> Add Lesson
            </Button>
          }
          title="Add New Lesson"
          description="Create a new lesson in Introduction to Data Science."
          form={<AddLessonForm />}
          footer={<Button>Create Lesson</Button>}
        />
      </div>

      <h2 className="text-xl font-bold">Assignment & Resource Management</h2>
      <div className="flex gap-2">
        <FormDialog
          trigger={
            <Button>
              <Plus className="h-4 w-4" /> Create Assignment
            </Button>
          }
          title="Create New Assignment"
          description="Set up a new assignment for your students."
          form={<CreateAssignmentForm />}
          footer={<Button>Create Assignment</Button>}
        />
        <FormDialog
          trigger={
            <Button>
              <Plus className="h-4 w-4" /> Add Resource
            </Button>
          }
          title="Add New Resource"
          description="Upload a file or add a link for students to access."
          form={<AddResourceForm />}
          footer={<Button>Add Resource</Button>}
        />
      </div>
    </div>
  );
}
