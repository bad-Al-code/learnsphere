'use client';

import {
  ArrowLeft,
  ArrowRight,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Hash,
  Lightbulb,
  Play,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
  XCircle,
} from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { Separator } from '@/components/ui/separator';
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
  QuizQuestion,
} from '../schemas/quiz.schema';

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Unknown';
  }
};

function QuizStats({
  quiz,
  selectedAnswers,
  currentQuestionIndex,
}: {
  quiz: Quiz;
  selectedAnswers: Record<string, string>;
  currentQuestionIndex: number;
}) {
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = Object.entries(selectedAnswers).reduce(
    (acc, [questionId, answerId]) => {
      const question = quiz.questions.find((q) => q.id === questionId);
      const option = question?.options.find((opt) => opt.id === answerId);
      return acc + (option?.isCorrect ? 1 : 0);
    },
    0
  );

  return (
    <div className="grid grid-cols-2 gap-4 rounded-lg border bg-gradient-to-r from-blue-50 to-indigo-50 p-4 md:grid-cols-4 dark:from-blue-950/20 dark:to-indigo-950/20">
      <div className="space-y-1 text-center">
        <div className="text-2xl font-bold text-blue-600">
          {currentQuestionIndex + 1}
        </div>
        <div className="text-muted-foreground text-xs">Current</div>
      </div>
      <div className="space-y-1 text-center">
        <div className="text-2xl font-bold text-green-600">{correctCount}</div>
        <div className="text-muted-foreground text-xs">Correct</div>
      </div>
      <div className="space-y-1 text-center">
        <div className="text-2xl font-bold text-orange-600">
          {answeredCount}
        </div>
        <div className="text-muted-foreground text-xs">Answered</div>
      </div>
      <div className="space-y-1 text-center">
        <div className="text-2xl font-bold text-purple-600">
          {totalQuestions}
        </div>
        <div className="text-muted-foreground text-xs">Total</div>
      </div>
    </div>
  );
}

function QuestionNavigation({
  quiz,
  currentQuestionIndex,
  selectedAnswers,
  onQuestionSelect,
  reviewMode = false,
}: {
  quiz: Quiz;
  currentQuestionIndex: number;
  selectedAnswers: Record<string, string>;
  onQuestionSelect: (index: number) => void;
  reviewMode?: boolean;
}) {
  const getQuestionStatus = (question: QuizQuestion, index: number) => {
    const isAnswered = selectedAnswers[question.id];
    const isCurrent = index === currentQuestionIndex;

    if (reviewMode && isAnswered) {
      const option = question.options.find(
        (opt) => opt.id === selectedAnswers[question.id]
      );
      const isCorrect = option?.isCorrect;
      return isCorrect ? 'correct' : 'incorrect';
    }

    if (isCurrent) return 'current';
    if (isAnswered) return 'answered';
    return 'unanswered';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'correct':
        return 'bg-green-500 text-white border-green-500';
      case 'incorrect':
        return 'bg-red-500 text-white border-red-500';
      case 'current':
        return 'bg-blue-500 text-white border-blue-500';
      case 'answered':
        return 'bg-gray-500 text-white border-gray-500';
      default:
        return 'bg-gray-200 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="flex items-center gap-2 text-sm font-medium">
        <Hash className="h-4 w-4" />
        Question Navigation
      </h4>
      <div className="grid grid-cols-5 gap-2">
        {quiz.questions.map((question, index) => {
          const status = getQuestionStatus(question, index);
          return (
            <Button
              key={question.id}
              variant="outline"
              size="sm"
              className={`h-10 w-10 p-0 ${getStatusColor(status)} transition-all hover:scale-110`}
              onClick={() => onQuestionSelect(index)}
            >
              {index + 1}
            </Button>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-blue-500"></div>
          <span>Current</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded bg-gray-500"></div>
          <span>Answered</span>
        </div>
        {reviewMode && (
          <>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-green-500"></div>
              <span>Correct</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-red-500"></div>
              <span>Wrong</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PracticeQuiz({ quiz }: { quiz: Quiz | null }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [showResults, setShowResults] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);

  useEffect(() => {
    if (quiz) {
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setShowResults(false);
      setReviewMode(false);
      setIsAdvancing(false);
      setStartTime(new Date());
      setEndTime(null);
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

  const scoreData = quiz
    ? (() => {
        const score = Object.entries(selectedAnswers).reduce(
          (correct, [questionId, answerId]) => {
            const question = quiz.questions.find((q) => q.id === questionId);
            const option = question?.options.find((opt) => opt.id === answerId);
            return correct + (option?.isCorrect ? 1 : 0);
          },
          0
        );

        const totalAnswered = Object.keys(selectedAnswers).length;
        const percentage =
          totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
        const answeredPercentage =
          totalQuestions > 0
            ? Math.round((totalAnswered / totalQuestions) * 100)
            : 0;

        return { score, totalAnswered, percentage, answeredPercentage };
      })()
    : { score: 0, totalAnswered: 0, percentage: 0, answeredPercentage: 0 };

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
        setEndTime(new Date());
        setShowResults(true);
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
      setIsAdvancing(false);
    }, 800);
  };

  const handleNext = () => {
    if (isLastQuestion && !reviewMode) {
      setEndTime(new Date());
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
    setStartTime(new Date());
    setEndTime(null);
  };

  const handleReview = () => {
    setReviewMode(true);
    setShowResults(false);
    setCurrentQuestionIndex(0);
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestionIndex(index);
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

  const timeTaken =
    startTime && endTime
      ? Math.round((endTime.getTime() - startTime.getTime()) / 1000)
      : 0;

  function TimerBadge({
    startTime,
    endTime,
  }: {
    startTime: Date | null;
    endTime: Date | null;
  }) {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
      if (!startTime) return;

      if (endTime) {
        setElapsed(
          Math.round((endTime.getTime() - startTime.getTime()) / 1000)
        );
        return;
      }

      const interval = setInterval(() => {
        setElapsed(Math.round((Date.now() - startTime.getTime()) / 1000));
      }, 1000);

      return () => clearInterval(interval);
    }, [startTime, endTime]);

    if (!startTime) return null;

    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        {elapsed}s
      </Badge>
    );
  }

  if (!quiz) {
    return (
      <Card className="flex h-full min-h-[500px] flex-col justify-center text-center">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
            <Lightbulb className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Ready to Practice?</CardTitle>
          <CardDescription className="text-lg">
            Generate a new quiz to start your learning journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="text-muted-foreground flex items-center space-x-4 text-sm">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span>Adaptive Difficulty</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Timed Practice</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Progress Tracking</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showResults) {
    const getScoreColor = () => {
      if (scoreData.percentage >= 80) return 'text-green-600';
      if (scoreData.percentage >= 60) return 'text-yellow-600';
      return 'text-red-600';
    };

    const getScoreEmoji = () => {
      if (scoreData.percentage >= 90) return '🏆';
      if (scoreData.percentage >= 80) return '🎉';
      if (scoreData.percentage >= 70) return '👏';
      if (scoreData.percentage >= 60) return '👍';
      return '💪';
    };

    const getPerformanceMessage = () => {
      if (scoreData.percentage >= 90)
        return "Outstanding! You're mastering this topic!";
      if (scoreData.percentage >= 80)
        return 'Great job! You have a solid understanding!';
      if (scoreData.percentage >= 70)
        return "Good work! You're on the right track!";
      if (scoreData.percentage >= 60)
        return 'Not bad! A bit more practice will help!';
      return "Keep practicing! You'll get there!";
    };

    return (
      <Card className="flex h-full flex-col">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            <CardTitle>Quiz Complete!</CardTitle>
          </div>
          <CardDescription>
            <div className="flex items-center gap-4 text-sm">
              <span>Topic: {quiz.topic}</span>
              <Badge variant="outline">{quiz.difficulty}</Badge>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(quiz.createdAt)}
              </span>
            </div>
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 space-y-6">
          <div className="space-y-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 text-center dark:from-blue-950/20 dark:to-indigo-950/20">
            <div className="text-6xl">{getScoreEmoji()}</div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold">Well Done!</h3>
              <div className="space-y-1">
                <p className="text-2xl">
                  <span className={`font-bold ${getScoreColor()}`}>
                    {scoreData.score} / {totalQuestions}
                  </span>
                </p>
                <p className={`text-lg font-semibold ${getScoreColor()}`}>
                  {scoreData.percentage}% Correct
                </p>
                <p className="text-muted-foreground text-sm">
                  {getPerformanceMessage()}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Time Taken</span>
              </div>
              <div className="text-2xl font-bold">
                {timeTaken > 60
                  ? `${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s`
                  : `${timeTaken}s`}
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Completion</span>
              </div>
              <div className="text-2xl font-bold">
                {scoreData.answeredPercentage}%
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Button
              onClick={handleReview}
              variant="outline"
              className="h-12 w-full text-lg"
              size="lg"
            >
              <Eye className="h-5 w-5" />
              Review Answers
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleRestart}
                variant="secondary"
                className="h-12"
                size="lg"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
              <Button
                onClick={() => window.location.reload()}
                className="h-12"
                size="lg"
              >
                <Sparkles className="h-4 w-4" />
                New Topic
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-500" />
            <CardTitle>
              {reviewMode ? 'Review Mode' : 'Practice Quiz'}
            </CardTitle>
          </div>
          {reviewMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReviewMode(false)}
            >
              <Play className="h-4 w-4" />
              Exit Review
            </Button>
          )}
        </div>

        <CardDescription>
          <div className="flex items-center gap-4 text-sm">
            <span>Topic: {quiz.topic}</span>
            <Badge variant="outline">{quiz.difficulty}</Badge>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(quiz.createdAt)}
            </span>
          </div>
        </CardDescription>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <div className="flex items-center gap-2">
              <TimerBadge startTime={startTime} endTime={endTime} />

              <Badge variant="outline">{scoreData.percentage}% Correct</Badge>
            </div>
          </div>
          <Progress value={progress} className="h-2 w-full" />
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-6">
        <QuizStats
          quiz={quiz}
          selectedAnswers={selectedAnswers}
          currentQuestionIndex={currentQuestionIndex}
        />

        {currentQuestion && (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="mt-1">
                  Q{currentQuestion.order + 1}
                </Badge>
                <h3 className="flex-1 text-lg leading-relaxed font-semibold">
                  {currentQuestion.questionText}
                </h3>
              </div>

              {reviewMode && (
                <Alert>
                  <AlertDescription className="flex items-center gap-2">
                    {selectedAnswers[currentQuestion.id] ? (
                      currentQuestion.options.find(
                        (opt) => opt.id === selectedAnswers[currentQuestion.id]
                      )?.isCorrect ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-700">
                            Correct! Well done!
                          </span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span className="font-medium text-red-700">
                            Incorrect. The right answer is highlighted below.
                          </span>
                        </>
                      )
                    ) : (
                      <>
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="font-medium text-orange-700">
                          You didn't answer this question.
                        </span>
                      </>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <Button
                  key={option.id}
                  variant={getOptionVariant(option)}
                  className={`h-auto w-full justify-between p-4 text-left whitespace-normal transition-all hover:scale-[1.01] ${
                    isAdvancing ? 'pointer-events-none' : ''
                  } ${reviewMode && option.isCorrect ? 'ring-2 ring-green-500' : ''}`}
                  onClick={() => handleOptionSelect(option)}
                  disabled={reviewMode || isAdvancing}
                >
                  <span className="flex-1 text-sm">{option.optionText}</span>
                  <div className="flex items-center gap-2">
                    {getOptionIcon(option)}
                    {isAdvancing &&
                      selectedAnswers[currentQuestion.id] === option.id && (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current" />
                      )}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {(reviewMode || totalQuestions > 5) && <Separator />}

        {(reviewMode || totalQuestions > 5) && (
          <QuestionNavigation
            quiz={quiz}
            currentQuestionIndex={currentQuestionIndex}
            selectedAnswers={selectedAnswers}
            onQuestionSelect={handleQuestionSelect}
            reviewMode={reviewMode}
          />
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

        <div className="flex items-center gap-2">
          {reviewMode && (
            <Button
              onClick={handleRestart}
              variant="secondary"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              New Quiz
            </Button>
          )}

          <Button
            onClick={handleNext}
            disabled={!reviewMode && !hasAnsweredCurrent}
            className="flex items-center gap-2"
            variant={!reviewMode && hasAnsweredCurrent ? 'default' : 'outline'}
          >
            {isLastQuestion ? 'Finish' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
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
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-current" />
                  Generating Quiz...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
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
