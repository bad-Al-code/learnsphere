'use client';

import { Mic, Play } from 'lucide-react';

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

const voiceFeatures: string[] = [
  'Natural conversation flow',
  'Multi-language support',
  'Real-time transcription',
  'Voice-to-text notes',
];

const trySayingPrompts: string[] = [
  '"Explain React hooks to me"',
  '"Quiz me on JavaScript"',
  '"Help me with my assignment"',
  '"Create a study plan"',
];

function VoiceAiTutor() {
  return (
    <Card className="">
      <CardHeader className="flex items-center justify-start gap-2">
        <div className="from-muted to-primary/30 text-foreground flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br">
          <Mic className="h-6 w-6" />
        </div>

        <div className="">
          <CardTitle>Voice AI Tutor</CardTitle>
          <CardDescription>
            Interactive voice conversations with your AI learning assistant
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col items-center justify-center">
        <div className="bg-muted flex h-24 w-24 items-center justify-center rounded-full">
          <Mic className="text-muted-foreground h-10 w-10" />
        </div>
        <p className="mt-4 font-semibold">Ready to help!</p>
        <p className="text-muted-foreground text-sm">
          Click the microphone to start a voice conversation
        </p>
      </CardContent>
      <CardFooter className="mx-auto">
        <Button variant="outline">
          <Play className="h-4 w-4" />
          Start Voice Chat
        </Button>
      </CardFooter>
    </Card>
  );
}

function VoiceFeatures() {
  return (
    <Card className="h-full border-blue-500/20 bg-blue-500/10">
      <CardContent className="p-4">
        <h3 className="font-semibold text-blue-800 dark:text-blue-300">
          Voice Features:
        </h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-blue-700 dark:text-blue-400">
          {voiceFeatures.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function TrySaying() {
  return (
    <Card className="h-full border-emerald-500/20 bg-emerald-500/10">
      <CardContent className="p-4">
        <h3 className="font-semibold text-emerald-800 dark:text-emerald-300">
          Try Saying:
        </h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-emerald-700 dark:text-emerald-400">
          {trySayingPrompts.map((prompt) => (
            <li key={prompt}>{prompt}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function VoiceAiTutorSkeleton() {
  return (
    <Card className="flex h-[400px] flex-col items-center justify-center">
      <CardHeader className="items-center space-y-2">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center justify-center gap-2">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-72" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-40" />
      </CardFooter>
    </Card>
  );
}

function FeatureCardSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <Skeleton className="h-5 w-1/3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </CardContent>
    </Card>
  );
}

export function VoiceTutorTab() {
  return (
    <div className="space-y-4">
      <VoiceAiTutor />
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <VoiceFeatures />
        <TrySaying />
      </div>
    </div>
  );
}

export function VoiceTutorTabSkeleton() {
  return (
    <div className="space-y-4">
      <VoiceAiTutorSkeleton />
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <FeatureCardSkeleton />
        <FeatureCardSkeleton />
      </div>
    </div>
  );
}
