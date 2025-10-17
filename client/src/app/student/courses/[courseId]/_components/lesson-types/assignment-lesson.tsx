'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CheckCircle2, Clock, FileText, Upload } from 'lucide-react';
import { useState } from 'react';
import type { Lesson } from '../../schema/course-detail.schema';

interface AssignmentLessonProps {
  lesson: Lesson;
}

export function AssignmentLesson({ lesson }: AssignmentLessonProps) {
  const [submitted, setSubmitted] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);

  return (
    <div className="space-y-6">
      {/* Assignment Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{lesson.title}</CardTitle>
              <CardDescription className="mt-2">
                {lesson.description}
              </CardDescription>
            </div>
            <Badge variant={submitted ? 'default' : 'secondary'}>
              {submitted ? 'Submitted' : 'Pending'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="text-muted-foreground h-4 w-4" />
              <div>
                <p className="text-muted-foreground text-xs">Due Date</p>
                <p className="font-medium">{dueDate.toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="text-muted-foreground h-4 w-4" />
              <div>
                <p className="text-muted-foreground text-xs">Points</p>
                <p className="font-medium">100 points</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rubric */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Grading Rubric</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { criteria: 'Code Quality', points: 30 },
              { criteria: 'Functionality', points: 40 },
              { criteria: 'Documentation', points: 20 },
              { criteria: 'Testing', points: 10 },
            ].map((item) => (
              <div
                key={item.criteria}
                className="bg-muted flex items-center justify-between rounded-lg p-3"
              >
                <span className="text-sm font-medium">{item.criteria}</span>
                <span className="text-muted-foreground text-sm">
                  {item.points} pts
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submission */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Submission</CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="flex items-center gap-3 rounded-lg bg-green-50 p-4 dark:bg-green-950">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">
                  Submitted Successfully
                </p>
                <p className="text-sm text-green-700 dark:text-green-200">
                  Submitted on {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
              <DialogTrigger asChild>
                <Button className="w-full gap-2">
                  <Upload className="h-4 w-4" />
                  Submit Assignment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Assignment</DialogTitle>
                  <DialogDescription>
                    Upload your assignment files below
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="border-border rounded-lg border-2 border-dashed p-8 text-center">
                    <Upload className="text-muted-foreground mx-auto h-8 w-8" />
                    <p className="mt-2 text-sm font-medium">
                      Drag and drop files here
                    </p>
                    <p className="text-muted-foreground text-xs">
                      or click to browse
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setSubmitted(true);
                      setShowSubmitDialog(false);
                    }}
                    className="w-full"
                  >
                    Submit
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
