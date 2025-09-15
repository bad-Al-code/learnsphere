'use client';

import { Lightbulb, Sparkles } from 'lucide-react';

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useGenerateQuiz } from '../hooks/useAiQuiz';
import {
  GenerateQuizInput,
  generateQuizInputSchema,
  Quiz,
  QuizOption,
} from '../schemas/quiz.schema';

type TQuizOption = {
  id: string;
  label: string;
  text: string;
};

type TQuizQuestion = {
  id: string;
  question: string;
  options: TQuizOption[];
};

const quizQuestion: TQuizQuestion = {
  id: 'q1',
  question:
    'What is the difference between function declarations and function expressions?',
  options: [
    {
      id: 'a',
      label: 'A',
      text: 'Function declarations are hoisted, expressions are not',
    },
    {
      id: 'b',
      label: 'B',
      text: 'Function expressions are hoisted, declarations are not',
    },
    { id: 'c', label: 'C', text: 'Both are hoisted the same way' },
    { id: 'd', label: 'D', text: 'Neither are hoisted' },
  ],
};

function PracticeQuiz({ quiz }: { quiz: Quiz | null }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const score = quiz
    ? Object.values(selectedAnswers).reduce((correct, answerId) => {
        const question = quiz.questions.find((q) =>
          q.options.some((opt) => opt.id === answerId)
        );
        const option = question?.options.find((opt) => opt.id === answerId);

        return correct + (option?.isCorrect ? 1 : 0);
      }, 0)
    : 0;

  const handleOptionSelect = (options: QuizOption) => {
    if (!submitted || !currentQuestion) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: options.id,
    }));

    if (currentQuestionIndex < quiz!.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setSubmitted(true);
    }
  };

  if (!quiz) {
    return (
      <Card className="flex flex-col items-center justify-center text-center">
        <CardHeader>
          <div className="bg-muted mx-auto flex h-12 w-12 items-center justify-center rounded-full">
            <Lightbulb className="text-muted-foreground h-6 w-6" />
          </div>
          <CardTitle>Practice Quiz</CardTitle>
          <CardDescription>
            Generate a new quiz to start practicing.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-blue-500" />
          <CardTitle>Practice Quiz</CardTitle>
        </div>
        <CardDescription>Topic: {quiz.topic}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-2">
        {submitted ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <h3 className="text-2xl font-bold">Quiz Complete!</h3>
            <p className="text-lg">
              Your Score:{' '}
              <span className="text-primary font-bold">
                {score} / {quiz.questions.length}
              </span>
            </p>
          </div>
        ) : (
          currentQuestion && (
            <div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </p>
                <Badge variant="outline">{quiz.difficulty}</Badge>
              </div>

              <div>
                <h3 className="mt-2 font-semibold">
                  {currentQuestion.questionText}
                </h3>
                <div className="mt-4 space-y-2">
                  {currentQuestion.options.map((option) => (
                    <Button
                      key={option.id}
                      variant="outline"
                      className="h-auto w-full justify-start gap-3 p-3 text-left whitespace-normal"
                      onClick={() => handleOptionSelect(option)}
                    >
                      {option.optionText}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}

function GenerateNewQuiz({
  onQuizGenerated,
  courseId,
}: {
  onQuizGenerated: (quiz: Quiz) => void;
  courseId?: string;
}) {
  const { mutate: generateQuiz, isPending } = useGenerateQuiz();

  const form = useForm<GenerateQuizInput>({
    resolver: zodResolver(generateQuizInputSchema),
    defaultValues: {
      courseId,
      topic: '',
      difficulty: 'Intermediate',
    },
  });

  const onSubmit = (values: GenerateQuizInput) => {
    generateQuiz(values, {
      onSuccess: (result) => {
        if (result.data) {
          onQuizGenerated(result.data);

          toast.success('Your new practice quiz is ready!');
        } else if (result.error) {
          toast.error(result.error);
        }
      },
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <CardTitle>Generate New Quiz</CardTitle>
            </div>
            <CardDescription>
              Create a custom practice quiz on any topic from your course.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., React Hooks, Choreography"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Quiz
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export function QuizTab({ courseId }: { courseId?: string }) {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  return (
    <div className="grid h-full min-h-[500px] grid-cols-1 gap-2 lg:grid-cols-2">
      <PracticeQuiz quiz={activeQuiz} />
      <GenerateNewQuiz onQuizGenerated={setActiveQuiz} courseId={courseId} />
    </div>
  );
}

export function QuizTabSkeleton() {
  return (
    <div className="grid h-full min-h-[500px] grid-cols-1 gap-2 lg:grid-cols-2">
      <PracticeQuizSkeleton />
      <GenerateNewQuizSkeleton />
    </div>
  );
}

function PracticeQuizSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <div className="mt-4 space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GenerateNewQuizSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-40" />
        </div>
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
