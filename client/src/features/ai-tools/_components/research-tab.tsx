'use client';

import { faker } from '@faker-js/faker';
import { BookText, Eye, FileText, Save, Search, Star } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

type TQuickTopic = {
  label: string;
  icon: React.ElementType;
};

type TSearchResult = {
  id: string;
  title: string;
  source: string;
  description: string;
  tags: string[];
  relevance: number;
};

const quickResearchTopics: TQuickTopic[] = [
  { label: 'React Performance Optimization', icon: BookText },
  { label: 'Database Indexing Strategies', icon: BookText },
  { label: 'Machine Learning Basics', icon: BookText },
  { label: 'UI/UX Design Principles', icon: BookText },
];

const createSearchResult = (): TSearchResult => ({
  id: faker.string.uuid(),
  title: faker.lorem
    .words(faker.number.int({ min: 3, max: 6 }))
    .replace(/\b\w/g, (l) => l.toUpperCase()),
  source: faker.company.name(),
  description: faker.lorem.sentence(),
  tags: faker.helpers.arrayElements(['Documentation', 'Tutorial', 'Article'], {
    min: 1,
    max: 2,
  }),
  relevance: faker.number.int({ min: 85, max: 98 }),
});

const searchResultsData: TSearchResult[] = Array.from(
  { length: 2 },
  createSearchResult
);

function AiResearchAssistant() {
  return (
    <Card className="">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          <CardTitle>AI Research Assistant</CardTitle>
        </div>
        <CardDescription>
          Intelligent research with source verification and summarization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="What would you like to research?" />
        <Button variant="secondary" className="w-full">
          <Search className="h-4 w-4" />
          Start Research
        </Button>
        <div>
          <h3 className="mb-2 text-sm font-medium">Quick Research Topics:</h3>
          <div className="space-y-2">
            {quickResearchTopics.map((topic) => (
              <Button
                key={topic.label}
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <topic.icon className="h-4 w-4" />
                {topic.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ResearchResults() {
  return (
    <Card className="">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <CardTitle>Research Results</CardTitle>
        </div>
        <CardDescription>
          Curated and verified sources with AI summaries
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {searchResultsData.map((result) => (
          <Card key={result.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{result.title}</CardTitle>
                  <CardDescription>{result.source}</CardDescription>
                </div>
                <Badge className="border border-yellow-500/30 bg-yellow-500/20 text-yellow-600">
                  <Star className="mr-1 h-3 w-3" /> {result.relevance}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                {result.description}
              </p>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {result.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}

function AiResearchAssistantSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="mt-2 h-4 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function ResearchResultsSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-64" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-16" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-64" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-16" />
          </CardHeader>
        </Card>
      </CardContent>
    </Card>
  );
}

export function ResearchTab({ courseId }: { courseId?: string }) {
  return (
    <div className="grid h-full grid-cols-1 gap-2 lg:grid-cols-2">
      <AiResearchAssistant />
      <ResearchResults />
    </div>
  );
}

export function ResearchTabSkeleton() {
  return (
    <div className="grid h-full grid-cols-1 gap-2 lg:grid-cols-2">
      <AiResearchAssistantSkeleton />
      <ResearchResultsSkeleton />
    </div>
  );
}
