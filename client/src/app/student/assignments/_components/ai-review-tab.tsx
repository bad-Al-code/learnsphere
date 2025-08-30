'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Brain, ShieldCheck, Upload } from 'lucide-react';

export function AIReviewTab() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <CardTitle>AI Assignment Reviewer</CardTitle>
        </div>
        <CardDescription>
          Upload your draft and get instant AI feedback before submission
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="">
          <label htmlFor="assignment-content" className="text-sm font-medium">
            Paste your assignment content:
          </label>
          <Textarea
            id="assignment-content"
            placeholder="Paste your assignment text here for AI review..."
            className="min-h-[250px] resize-y"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center gap-2">
        <Button>
          <Brain className="h-4 w-4" />
          Get AI Review
        </Button>
        <Button variant="outline">
          <Upload className="h-4 w-4" />
          Upload File
        </Button>
        <Button variant="outline">
          <ShieldCheck className="h-4 w-4" />
          Plagiarism Check
        </Button>
      </CardFooter>
    </Card>
  );
}

export function AIReviewTabSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-64" />
        <Skeleton className="mt-2 h-4 w-72" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-[250px] w-full" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </CardFooter>
    </Card>
  );
}
