'use client';

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Lightbulb,
  RotateCcw,
  SkipForward,
  Sparkles,
  XCircle,
} from 'lucide-react';

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
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useGenerateQuiz } from '../hooks/useAiQuiz';
import {
  GenerateQuizInput,
  generateQuizInputSchema,
  Quiz,
  QuizOption,
} from '../schemas/quiz.schema';

function PracticeQuiz({ quiz }: { quiz: Quiz | null }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [showResults, setShowResults] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);

  useEffect(() => {
    if (quiz) {
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setShowResults(false);
      setReviewMode(false);
      setIsAdvancing(false);
    }
  }, [quiz?.id]);

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const totalQuestions = quiz?.questions?.length || 0;
  const progress =
    totalQuestions > 0
      ? ((currentQuestionIndex + 1) / totalQuestions) * 100
      : 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const hasAnsweredCurrent = currentQuestion
    ? selectedAnswers[currentQuestion.id]
    : false;

  const score = quiz
    ? Object.entries(selectedAnswers).reduce(
        (correct, [questionId, answerId]) => {
          const question = quiz.questions.find((q) => q.id === questionId);
          const option = question?.options.find((opt) => opt.id === answerId);
          return correct + (option?.isCorrect ? 1 : 0);
        },
        0
      )
    : 0;

  const handleOptionSelect = async (option: QuizOption) => {
    if (!currentQuestion || reviewMode || isAdvancing) return;

    const newAnswers = {
      ...selectedAnswers,
      [currentQuestion.id]: option.id,
    };
    setSelectedAnswers(newAnswers);
    setIsAdvancing(true);

    setTimeout(() => {
      if (isLastQuestion) {
        setShowResults(true);
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
      setIsAdvancing(false);
    }, 600);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setReviewMode(false);
    setIsAdvancing(false);
  };

  const handleReview = () => {
    setReviewMode(true);
    setShowResults(false);
    setCurrentQuestionIndex(0);
  };

  const getOptionVariant = (option: QuizOption) => {
    if (!currentQuestion) return 'outline';

    const isSelected = selectedAnswers[currentQuestion.id] === option.id;

    if (!reviewMode) {
      if (isSelected && isAdvancing) return 'default';
      return isSelected ? 'secondary' : 'outline';
    }

    if (isSelected && option.isCorrect) return 'default';
    if (isSelected && !option.isCorrect) return 'destructive';
    if (option.isCorrect) return 'secondary';
    return 'outline';
  };

  const getOptionIcon = (option: QuizOption) => {
    if (!currentQuestion) return null;

    const isSelected = selectedAnswers[currentQuestion.id] === option.id;

    if (!reviewMode) return null;

    if (option.isCorrect) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    if (isSelected && !option.isCorrect) {
      return <XCircle className="h-4 w-4 text-red-600" />;
    }
    return null;
  };

  if (!quiz) {
    return (
      <Card className="flex h-full flex-col justify-center text-center">
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

  if (showResults) {
    const percentage =
      totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const getScoreColor = () => {
      if (percentage >= 80) return 'text-green-600';
      if (percentage >= 60) return 'text-yellow-600';

      return 'text-red-600';
    };

    const getScoreEmoji = () => {
      if (percentage >= 90) return '🏆';
      if (percentage >= 80) return '🎉';
      if (percentage >= 70) return '👏';
      if (percentage >= 60) return '👍';
      return '💪';
    };

    return (
      <Card className="flex h-full flex-col">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-500" />
            <CardTitle>Quiz Complete!</CardTitle>
          </div>
          <CardDescription>Topic: {quiz.topic}</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-2">
            <div className="text-4xl font-bold">{getScoreEmoji()}</div>
            <h3 className="text-2xl font-bold">Well Done!</h3>
            <div className="space-y-1">
              <p className="text-lg">
                Your Score:{' '}
                <span className={`text-2xl font-bold ${getScoreColor()}`}>
                  {score} / {totalQuestions}
                </span>
              </p>
              <p className={`text-sm ${getScoreColor()}`}>
                {percentage}% Correct
              </p>
            </div>
          </div>

          <div className="w-full max-w-sm space-y-3">
            <Button onClick={handleReview} variant="outline" className="w-full">
              <CheckCircle className="mr-2 h-4 w-4" />
              Review Answers
            </Button>
            <Button onClick={handleRestart} className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-blue-500" />
          <CardTitle>{reviewMode ? 'Review Mode' : 'Practice Quiz'}</CardTitle>
        </div>
        <CardDescription>Topic: {quiz.topic}</CardDescription>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <Badge variant="outline">{quiz.difficulty}</Badge>
          </div>
          <Progress value={progress} className="h-2 w-full" />
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        {currentQuestion && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg leading-relaxed font-semibold">
                {currentQuestion.questionText}
              </h3>
              {reviewMode && (
                <div className="text-muted-foreground text-sm">
                  {selectedAnswers[currentQuestion.id] ? (
                    currentQuestion.options.find(
                      (opt) => opt.id === selectedAnswers[currentQuestion.id]
                    )?.isCorrect ? (
                      <span className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        You got this right!
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-red-600">
                        <XCircle className="h-5 w-5" />
                        You got this wrong.
                      </span>
                    )
                  ) : (
                    <span className="flex items-center gap-2 text-gray-500">
                      <SkipForward className="h-5 w-5" />
                      You skipped this question.
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <Button
                  key={option.id}
                  variant={getOptionVariant(option)}
                  className={`h-auto w-full justify-between p-4 text-left whitespace-normal transition-all hover:scale-[1.02] ${
                    isAdvancing ? 'pointer-events-none' : ''
                  }`}
                  onClick={() => handleOptionSelect(option)}
                  disabled={reviewMode || isAdvancing}
                >
                  <span className="flex-1">{option.optionText}</span>
                  {getOptionIcon(option)}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        {reviewMode ? (
          <Button onClick={handleRestart} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            New Quiz
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!hasAnsweredCurrent && !reviewMode}
            className="flex items-center gap-2"
            variant={hasAnsweredCurrent ? 'default' : 'outline'}
          >
            {isLastQuestion ? 'Finish' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
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

          form.reset({ courseId, topic: '', difficulty: 'Intermediate' });
          toast.success(`Quiz "${result.data.topic}" is ready! 🎯`);
        } else if (result.error) {
          toast.error(result.error);
        }
      },

      onError: (error) => {
        toast.error(error.message || 'Failed to generate quiz');
      },
    });
  };

  return (
    <Card className="h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-full flex-col"
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <CardTitle>Generate New Quiz</CardTitle>
            </div>
            <CardDescription>
              Create a custom practice quiz on any topic from your course.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1 space-y-4">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., React Hooks, JavaScript Closures, CSS Grid"
                      {...field}
                      className="transition-all focus:scale-[1.02]"
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
                  <FormLabel>Difficulty Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="transition-all focus:scale-[1.02]">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Beginner">
                        <div className="flex items-center gap-2">
                          🟢 <span>Beginner</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Intermediate">
                        <div className="flex items-center gap-2">
                          🟡 <span>Intermediate</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="Advanced">
                        <div className="flex items-center gap-2">
                          🔴 <span>Advanced</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted/50 space-y-2 rounded-lg p-4">
              <h4 className="text-sm font-medium">
                💡 Tips for better quizzes:
              </h4>
              <ul className="text-muted-foreground space-y-1 text-sm">
                <li>• Be specific about the topic</li>
                <li>• Choose appropriate difficulty level</li>
                <li>• Include multiple concepts for variety</li>
              </ul>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={isPending}
              size="lg"
            >
              {isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current" />
                  Generating Quiz...
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
    <div className="grid h-full min-h-[600px] grid-cols-1 gap-2 lg:grid-cols-2">
      <PracticeQuiz quiz={activeQuiz} />
      <GenerateNewQuiz onQuizGenerated={setActiveQuiz} courseId={courseId} />
    </div>
  );
}

export function QuizTabSkeleton() {
  return (
    <div className="grid h-full min-h-[600px] grid-cols-1 gap-2 lg:grid-cols-2">
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
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-4 w-48" />
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  );
}

function GenerateNewQuizSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-40" />
        </div>
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-20 w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-12 w-full" />
      </CardFooter>
    </Card>
  );
}
