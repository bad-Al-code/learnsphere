'use client';

import { faker } from '@faker-js/faker';
import { Bookmark, Check, Clock, Plus, TrendingUp, X } from 'lucide-react';
import { useState } from 'react';

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
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type TFlashcard = {
  id: string;
  question: string;
  answer: string;
  subject: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  masteryScore: number;
  lastReviewed: string;
};

const createFlashcard = (): TFlashcard => ({
  id: faker.string.uuid(),
  question: faker.lorem.sentence().replace('.', '?'),
  answer: faker.lorem.paragraph(),
  subject: faker.helpers.arrayElement([
    'JavaScript Fundamentals',
    'JavaScript Advanced',
    'React',
  ]),
  difficulty: 'Intermediate',
  masteryScore: faker.number.int({ min: 50, max: 95 }),
  lastReviewed: `${faker.number.int({ min: 1, max: 5 })} days ago`,
});

const flashcardsData: TFlashcard[] = Array.from({ length: 3 }, createFlashcard);

function AiFlashcards() {
  const [isFlipped, setIsFlipped] = useState(false);
  const currentCard = flashcardsData[0];

  return (
    <Card className="">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bookmark className="h-5 w-5" />
          <CardTitle>AI Flashcards</CardTitle>
        </div>
        <CardDescription>
          Spaced repetition learning with AI-generated cards
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Card 1 of {flashcardsData.length}
          </p>
          <Badge variant="outline">{currentCard.difficulty}</Badge>
        </div>
        <Card
          className="flex flex-1 cursor-pointer items-center justify-center p-4 text-center"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {isFlipped ? (
            <p className="text-sm">{currentCard.answer}</p>
          ) : (
            <div>
              <h3 className="text-lg font-semibold">{currentCard.question}</h3>
              <p className="text-muted-foreground mt-2 text-xs">
                Click to reveal answer
              </p>
            </div>
          )}
        </Card>
      </CardContent>
      <CardFooter className="grid grid-cols-3 gap-2">
        <Button variant="outline">
          <X className="h-4 w-4" />
          Hard
        </Button>
        <Button variant="outline">
          <Clock className="h-4 w-4" />
          Good
        </Button>
        <Button variant="secondary">
          <Check className="h-4 w-4" />
          Easy
        </Button>
      </CardFooter>
    </Card>
  );
}

function StudyProgress() {
  const getScoreColor = (score: number) => {
    if (score > 80) return 'text-emerald-500';
    if (score > 65) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <Card className="">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          <CardTitle>Study Progress</CardTitle>
        </div>
        <CardDescription>
          Track your flashcard learning progress
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <p className="text-sm font-medium">Overall Progress</p>
            <p className="text-sm font-semibold">73%</p>
          </div>
          <Progress value={73} />
        </div>
        <div className="space-y-2">
          {flashcardsData.map((card) => (
            <Card key={card.id}>
              <CardContent className="flex items-center justify-between p-3">
                <div>
                  <p className="text-sm font-medium">{card.question}</p>
                  <p className="text-muted-foreground text-xs">
                    {card.subject}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      'text-sm font-semibold',
                      getScoreColor(card.masteryScore)
                    )}
                  >
                    ● {card.masteryScore}%
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {card.lastReviewed}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" className="w-full">
          <Plus className="h-4 w-4" /> Generate New Cards
        </Button>
      </CardFooter>
    </Card>
  );
}

function AiFlashcardsSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="mt-2 h-4 w-3/4" />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="mt-4 flex-1" />
      </CardContent>
      <CardFooter className="grid grid-cols-3 gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

function StudyProgressSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-2 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

export function FlashcardsTab() {
  return (
    <div className="grid h-full min-h-[500px] grid-cols-1 gap-2 lg:grid-cols-2">
      <AiFlashcards />
      <StudyProgress />
    </div>
  );
}

export function FlashcardsTabSkeleton() {
  return (
    <div className="grid h-full min-h-[500px] grid-cols-1 gap-2 lg:grid-cols-2">
      <AiFlashcardsSkeleton />
      <StudyProgressSkeleton />
    </div>
  );
}
