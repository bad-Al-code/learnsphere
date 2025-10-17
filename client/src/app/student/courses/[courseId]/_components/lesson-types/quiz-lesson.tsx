'use client';

import { cn } from '@/lib/utils';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import type { Lesson } from '../../schema/course-detail.schema';

interface QuizLessonProps {
  lesson: Lesson;
}

const QUIZ_QUESTIONS = [
  {
    id: '1',
    question: 'What is the primary purpose of React hooks?',
    options: [
      'To manage component state and side effects',
      'To replace class components entirely',
      'To improve performance',
      'To simplify CSS styling',
    ],
    correct: 0,
  },
  {
    id: '2',
    question: 'Which hook is used for side effects?',
    options: ['useState', 'useEffect', 'useContext', 'useReducer'],
    correct: 1,
  },
  {
    id: '3',
    question: 'What does the dependency array in useEffect do?',
    options: [
      'It defines when the effect should run',
      'It stores component state',
      'It manages component props',
      'It handles error boundaries',
    ],
    correct: 0,
  },
];

export function QuizLesson({ lesson }: QuizLessonProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});
  const [showResults, setShowResults] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const question = QUIZ_QUESTIONS[currentQuestion];
  const isAnswered = selectedAnswers[question.id] !== undefined;
  const isLastQuestion = currentQuestion === QUIZ_QUESTIONS.length - 1;

  const handleSelectAnswer = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [question.id]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowSubmitDialog(true);
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
    setShowSubmitDialog(false);
  };

  const correctAnswers = QUIZ_QUESTIONS.filter(
    (q) => selectedAnswers[q.id] === q.correct
  ).length;

  if (showResults) {
    return (
      <div className="space-y-6">
        <div className="border-border bg-muted rounded-lg border p-6 text-center">
          <h3 className="text-foreground text-2xl font-bold">Quiz Complete!</h3>
          <p className="text-primary mt-2 text-4xl font-bold">
            {correctAnswers}/{QUIZ_QUESTIONS.length}
          </p>
          <p className="text-muted-foreground mt-2">
            You scored{' '}
            {((correctAnswers / QUIZ_QUESTIONS.length) * 100).toFixed(0)}%
          </p>
        </div>

        <div className="space-y-4">
          {QUIZ_QUESTIONS.map((q, idx) => {
            const userAnswer = selectedAnswers[q.id];
            const isCorrect = userAnswer === q.correct;

            return (
              <div
                key={q.id}
                className={cn(
                  'rounded-lg border p-4',
                  isCorrect
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-red-500 bg-red-500/10'
                )}
              >
                <p className="text-foreground font-medium">{q.question}</p>
                <p className="mt-2 text-sm">
                  <span
                    className={isCorrect ? 'text-green-600' : 'text-red-600'}
                  >
                    Your answer: {q.options[userAnswer]}
                  </span>
                </p>
                {!isCorrect && (
                  <p className="mt-1 text-sm text-green-600">
                    Correct answer: {q.options[q.correct]}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <Button onClick={() => window.location.reload()} className="w-full">
          Retake Quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm font-medium">
            Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
          </span>
          <span className="text-muted-foreground text-sm font-medium">
            {Object.keys(selectedAnswers).length} answered
          </span>
        </div>
        <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{
              width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="space-y-4">
        <h3 className="text-foreground text-lg font-semibold">
          {question.question}
        </h3>

        <RadioGroup value={selectedAnswers[question.id]?.toString() || ''}>
          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={idx.toString()}
                  id={`option-${idx}`}
                  onClick={() => handleSelectAnswer(idx)}
                />
                <Label
                  htmlFor={`option-${idx}`}
                  className="text-foreground cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Navigation */}
      <div className="border-border flex items-center justify-between border-t pt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>

        <Button onClick={handleNext} disabled={!isAnswered}>
          {isLastQuestion ? 'Submit Quiz' : 'Next Question'}
        </Button>
      </div>

      {/* Submit Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
          <AlertDialogDescription>
            You have answered {Object.keys(selectedAnswers).length} out of{' '}
            {QUIZ_QUESTIONS.length} questions. Are you sure you want to submit?
          </AlertDialogDescription>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Submit</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
