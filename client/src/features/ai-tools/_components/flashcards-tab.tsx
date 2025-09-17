'use client';

import {
  BookOpen,
  Brain,
  Check,
  Clock,
  HelpCircle,
  Info,
  Plus,
  RotateCcw,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FlashcardData {
  id: string;
  deckId: string;
  question: string;
  answer: string;
}

interface UserProgress {
  userId: string;
  cardId: string;
  deckId: string;
  status: 'New' | 'Learning' | 'Mastered';
  nextReviewAt: string;
  lastReviewedAt: string | null;
  correctStreaks: number;
}

interface StudySessionCard {
  ai_flashcards: FlashcardData;
  user_flashcard_progress: UserProgress | null;
}

interface FlashcardDeck {
  id: string;
  userId: string;
  courseId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  cards?: FlashcardData[];
}

interface CreateDeckInput {
  courseId: string;
  title: string;
}

interface GenerateCardsInput {
  deckId: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface RecordProgressInput {
  cardId: string;
  deckId: string;
  feedback: 'Hard' | 'Good' | 'Easy';
}

import {
  useCreateDeck,
  useDeleteDeck,
  useGenerateCards,
  useGetDecks,
  useGetStudySession,
  useRecordProgress,
} from '../hooks/useAiFlashcards';
import { CourseSelectionScreen } from './common/CourseSelectionScrren';

const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

function CreateDeckDialog({ courseId }: { courseId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const { mutate: createDeck, isPending } = useCreateDeck();
  const isMobile = useMobile();

  const onSubmit = () => {
    if (!title.trim()) return;

    const data: CreateDeckInput = { courseId, title: title.trim() };
    createDeck(data, {
      onSuccess: (result) => {
        if (result.data) {
          toast.success(`"${result.data.title}" created successfully!`);

          setIsOpen(false);
          setTitle('');
        } else if (result.error) {
          toast.error(result.error);
        }
      },

      onError: (error) => {
        toast.error(error.message || 'Failed to create deck');
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isPending && title.trim()) {
      onSubmit();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="border-muted-foreground/25 hover:border-primary/50 group flex cursor-pointer flex-col justify-center border-2 border-dashed p-6 text-center transition-all">
          <CardHeader
            className={cn(
              'flex flex-col items-center',
              isMobile ? 'pb-3' : 'pb-4'
            )}
          >
            <div className="bg-primary/10 group-hover:bg-primary/20 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full transition-colors">
              <Plus className="text-primary h-6 w-6" />
            </div>
            <CardTitle
              className={cn(
                'group-hover:text-primary transition-colors',
                isMobile ? 'text-base' : 'text-lg'
              )}
            >
              Create New Deck
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground text-sm">
              Start a new flashcard collection
            </p>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent
        className={cn(isMobile ? 'w-[95vw] rounded-lg' : 'max-w-md')}
      >
        <DialogHeader>
          <DialogTitle>Create New Flashcard Deck</DialogTitle>
          <DialogDescription>
            Give your new deck a descriptive name to organize your study
            materials.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-4">
            <label className="text-sm font-medium">Deck Title</label>
            <Input
              placeholder="e.g., JavaScript Fundamentals"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={100}
              disabled={isPending}
            />

            <p className="text-muted-foreground text-xs">
              {title.length}/100 characters
            </p>
          </div>

          <DialogFooter className={cn(isMobile ? 'flex-col space-y-2' : '')}>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
              className={cn(isMobile ? 'w-full' : '')}
            >
              Cancel
            </Button>

            <Button
              onClick={onSubmit}
              disabled={isPending || !title.trim() || title.length < 3}
              className={cn(isMobile ? 'w-full' : '')}
            >
              {isPending ? 'Creating...' : 'Create Deck'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function GenerateCardsDialog({ deck }: { deck: FlashcardDeck }) {
  const [isOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<
    'Beginner' | 'Intermediate' | 'Advanced'
  >('Intermediate');
  const { mutate: generateCards, isPending } = useGenerateCards();
  const isMobile = useMobile();

  const onSubmit = () => {
    if (!topic.trim()) return;

    const data: GenerateCardsInput = {
      deckId: deck.id,
      topic: topic.trim(),
      difficulty,
    };

    toast.info(
      `Generating 10 ${difficulty.toLowerCase()} cards for "${topic}"...`
    );

    generateCards(data, {
      onSuccess: (result) => {
        if (result.data) {
          toast.success(
            `${result.data.cards?.length || 10} new cards added to "${deck.title}"!`
          );

          setIsOpen(false);
          setTopic('');
          setDifficulty('Intermediate');
        } else if (result.error) {
          toast.error(result.error);
        }
      },

      onError: (error) => {
        toast.error(error.message || 'Failed to generate cards');
      },
    });
  };

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="flex-1">
                <Sparkles className="h-4 w-4" />
                {isMobile ? 'AI' : 'AI Generate'}
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Generate flashcards using AI</p>
          </TooltipContent>
        </Tooltip>

        <DialogContent
          className={cn(isMobile ? 'w-[95vw] rounded-lg' : 'max-w-md')}
        >
          <DialogHeader>
            <DialogTitle>Generate Cards for "{deck.title}"</DialogTitle>
            <DialogDescription>
              AI will create 10 high-quality flashcards based on your topic and
              difficulty level
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic</label>
              <Input
                placeholder="e.g., React Hooks, Closures, Data Structures"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                maxLength={100}
                disabled={isPending}
              />
              <p className="text-muted-foreground text-xs">
                {topic.length}/100 characters
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Difficulty Level</label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="text-muted-foreground h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Choose the complexity level for generated questions</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <Select
                onValueChange={(value) =>
                  setDifficulty(value as typeof difficulty)
                }
                value={difficulty}
                disabled={isPending}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      Beginner
                    </div>
                  </SelectItem>

                  <SelectItem value="Intermediate">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-yellow-500" />
                      Intermediate
                    </div>
                  </SelectItem>

                  <SelectItem value="Advanced">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      Advanced
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className={cn(isMobile ? 'flex-col space-y-2' : '')}>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className={cn(isMobile ? 'w-full' : '')}
              >
                Cancel
              </Button>

              <Button
                onClick={onSubmit}
                disabled={isPending || !topic.trim() || topic.length < 3}
                className={cn(isMobile ? 'w-full' : '')}
              >
                {isPending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate 10 Cards
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

function DeleteDeckDialog({ deck }: { deck: FlashcardDeck }) {
  const { mutate: deleteDeck, isPending } = useDeleteDeck();
  const cardCount = deck.cards?.length || 0;

  const handleDelete = () => {
    deleteDeck(deck.id, {
      onSuccess: (result) => {
        if (result.data) {
          toast.success(`"${deck.title}" deleted successfully`);
        } else if (result.error) {
          toast.error(result.error);
        }
      },

      onError: (error) => {
        toast.error(error.message || 'Failed to delete deck');
      },
    });
  };

  return (
    <TooltipProvider>
      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete deck</p>
          </TooltipContent>
        </Tooltip>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Deck</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deck.title}"? This action cannot
              be undone and will remove all {cardCount} card
              {cardCount !== 1 ? 's' : ''}.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? 'Deleting...' : 'Delete Deck'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}

function DeckStats({ deck }: { deck: FlashcardDeck }) {
  const cardCount = deck.cards?.length || 0;
  const newCards = Math.floor(cardCount * 0.6);
  const learningCards = Math.floor(cardCount * 0.3);
  const masteredCards = cardCount - newCards - learningCards;

  if (cardCount === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-muted-foreground text-sm">No cards yet</p>
        <p className="text-muted-foreground mt-1 text-xs">
          Generate some cards to start studying
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Cards</span>
          <Badge variant="secondary">{cardCount}</Badge>
        </div>

        <Separator />

        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex cursor-help items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  New
                </span>
                <span>{newCards}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cards you haven't studied yet</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex cursor-help items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  Learning
                </span>
                <span>{learningCards}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cards you're currently learning</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex cursor-help items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  Mastered
                </span>
                <span>{masteredCards}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cards you've mastered</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}

function DeckManager({
  onStartStudy,
  courseId,
}: {
  onStartStudy: (deck: FlashcardDeck) => void;
  courseId: string;
}) {
  const { data: decks, isLoading, error } = useGetDecks(courseId);
  const isMobile = useMobile();

  if (isLoading) {
    return <FlashcardsTabSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center">
        <div className="bg-destructive/10 flex h-16 w-16 items-center justify-center rounded-full">
          <X className="text-destructive h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Failed to Load Decks</h3>
          <p className="text-muted-foreground max-w-md">
            {error.message ||
              'Something went wrong while loading your flashcard decks.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className={cn(
          'flex items-center justify-between',
          isMobile && 'flex-col space-y-4'
        )}
      >
        <div className={cn(isMobile && 'text-center')}>
          <h2 className="text-3xl font-bold tracking-tight">
            My Flashcard Decks
          </h2>
          <p className="text-muted-foreground">
            Create and study with AI-powered flashcards
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {decks?.length || 0} deck{(decks?.length || 0) !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div
        className={cn(
          'grid gap-4',
          isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        )}
      >
        {decks?.map((deck) => (
          <Card key={deck.id} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-1">
                  <CardTitle
                    className={cn(
                      'line-clamp-2',
                      isMobile ? 'text-lg' : 'text-lg'
                    )}
                  >
                    {deck.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-xs">
                    Created {new Date(deck.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <DeleteDeckDialog deck={deck} />
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <DeckStats deck={deck} />
            </CardContent>

            <CardFooter
              className={cn(
                'gap-2',
                isMobile ? 'flex-col' : 'grid grid-cols-2'
              )}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className={cn('flex-1', isMobile && 'w-full')}
                    onClick={() => onStartStudy(deck)}
                    disabled={!deck.cards || deck.cards.length === 0}
                  >
                    <Brain className="h-4 w-4" />
                    Study
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {!deck.cards || deck.cards.length === 0
                    ? 'Generate cards first to start studying'
                    : 'Start studying this deck'}
                </TooltipContent>
              </Tooltip>
              <GenerateCardsDialog deck={deck} />
            </CardFooter>
          </Card>
        ))}

        <CreateDeckDialog courseId={courseId} />
      </div>
    </div>
  );
}

function StudySession({
  deck,
  onExit,
}: {
  deck: FlashcardDeck;
  onExit: () => void;
}) {
  const { data: studyCards, isLoading, error } = useGetStudySession(deck.id);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    total: 0,
    streak: 0,
    maxStreak: 0,
  });
  const { mutate: recordProgress } = useRecordProgress();
  const isMobile = useMobile();

  const handleFeedback = (feedback: 'Hard' | 'Good' | 'Easy') => {
    if (!studyCards) return;

    const card = studyCards[currentCardIndex];
    const data: RecordProgressInput = {
      cardId: card.ai_flashcards.id,
      deckId: deck.id,
      feedback,
    };

    recordProgress(data, {
      onSuccess: () => {
        toast.info('Progress Saved');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to save progress');
      },
    });

    const isCorrect = feedback === 'Easy' || feedback === 'Good';

    setSessionStats((prev) => {
      const newStreak = isCorrect ? prev.streak + 1 : 0;

      return {
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
        streak: newStreak,
        maxStreak: Math.max(prev.maxStreak, newStreak),
      };
    });

    setIsFlipped(false);

    if (currentCardIndex < studyCards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      toast.success(
        `Study session complete! You got ${sessionStats.correct + (isCorrect ? 1 : 0)} out of ${sessionStats.total + 1} cards right.`
      );

      onExit();
    }
  };

  const handleRestart = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setSessionStats({ correct: 0, total: 0, streak: 0, maxStreak: 0 });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();

      setIsFlipped((prev) => !prev);
    } else if (isFlipped && ['1', '2', '3'].includes(e.key)) {
      e.preventDefault();

      const feedbacks: ('Hard' | 'Good' | 'Easy')[] = ['Hard', 'Good', 'Easy'];
      handleFeedback(feedbacks[parseInt(e.key) - 1]);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, studyCards, currentCardIndex]);

  if (isLoading) {
    return <StudySessionSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center">
        <div className="bg-destructive/10 flex h-16 w-16 items-center justify-center rounded-full">
          <X className="text-destructive h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            Failed to Load Study Session
          </h3>

          <p className="text-muted-foreground max-w-md">
            {error.message ||
              'Something went wrong while loading your study session.'}
          </p>
        </div>

        <Button onClick={onExit} variant="outline">
          Back to Decks
        </Button>
      </div>
    );
  }

  if (!studyCards || studyCards.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4 text-center">
        <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
          <BookOpen className="text-muted-foreground h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">No Cards to Study</h3>
          <p className="text-muted-foreground max-w-md">
            This deck doesn't have any cards yet. Generate some cards using AI
            to start studying!
          </p>
        </div>

        <Button onClick={onExit} variant="outline">
          <Plus className="h-4 w-4" />
          Back to Decks
        </Button>
      </div>
    );
  }

  const currentCard = studyCards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / studyCards.length) * 100;
  const accuracy =
    sessionStats.total > 0
      ? (sessionStats.correct / sessionStats.total) * 100
      : 0;

  return (
    <TooltipProvider>
      <div className={cn('mx-auto space-y-6', isMobile ? 'px-4' : 'max-w-4xl')}>
        <div
          className={cn(
            'flex items-center justify-between',
            isMobile && 'flex-col space-y-4'
          )}
        >
          <div className={cn(isMobile && 'text-center')}>
            <h2 className="text-2xl font-bold">{deck.title}</h2>
            <p className="text-muted-foreground">
              Card {currentCardIndex + 1} of {studyCards.length}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={handleRestart}>
                  <RotateCcw className="h-4 w-4" />
                  Restart
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Restart the study session</p>
              </TooltipContent>
            </Tooltip>
            <Button variant="ghost" size="sm" onClick={onExit}>
              Exit
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div
          className={cn('grid gap-4', isMobile ? 'grid-cols-2' : 'grid-cols-3')}
        >
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">{Math.round(accuracy)}%</p>
                <p className="text-muted-foreground text-xs">Accuracy</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">{sessionStats.streak}</p>
                <p className="text-muted-foreground text-xs">Streak</p>
              </div>
            </div>
          </Card>

          {!isMobile && (
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">{sessionStats.total}</p>
                  <p className="text-muted-foreground text-xs">Reviewed</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        <Card
          className="flex min-h-[300px] transform cursor-pointer flex-col transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
          onClick={() => setIsFlipped((p) => !p)}
        >
          <CardContent className="flex flex-1 items-center justify-center p-8 text-center">
            <div className="space-y-4">
              <Badge
                variant={isFlipped ? 'secondary' : 'default'}
                className="mb-4"
              >
                {isFlipped ? 'Answer' : 'Question'}
              </Badge>

              <div
                className={cn(
                  'max-w-2xl leading-relaxed font-medium',
                  isMobile ? 'text-base' : 'text-lg'
                )}
              >
                {isFlipped
                  ? currentCard.ai_flashcards.answer
                  : currentCard.ai_flashcards.question}
              </div>

              {!isFlipped && (
                <div className="text-muted-foreground mt-4 flex items-center gap-2 text-sm">
                  <Info className="h-4 w-4" />
                  <span>Click or press Space to reveal answer</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {!isMobile && (
          <div className="text-center">
            <p className="text-muted-foreground text-xs">
              Keyboard shortcuts: Space/Enter to flip • 1/2/3 for Hard/Good/Easy
            </p>
          </div>
        )}

        {isFlipped && (
          <div
            className={cn(
              'mx-auto max-w-lg gap-4',
              isMobile ? 'flex flex-col' : 'grid grid-cols-3'
            )}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => handleFeedback('Hard')}
                  className={cn(
                    'hover:border-red-200 hover:bg-red-50 hover:text-red-700',
                    isMobile && 'w-full'
                  )}
                >
                  <X className="h-4 w-4" />
                  Hard {!isMobile && '(1)'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Difficult - you'll see this card again soon</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => handleFeedback('Good')}
                  className={cn(
                    'hover:border-yellow-200 hover:bg-yellow-50 hover:text-yellow-700',
                    isMobile && 'w-full'
                  )}
                >
                  <Clock className="h-4 w-4" />
                  Good {!isMobile && '(2)'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Moderate - you'll see this card in a few days</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => handleFeedback('Easy')}
                  className={cn(
                    'hover:border-green-200 hover:bg-green-50 hover:text-green-700',
                    isMobile && 'w-full'
                  )}
                >
                  <Check className="h-4 w-4" />
                  Easy {!isMobile && '(3)'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Easy - you'll see this card much later</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

function StudySessionSkeleton() {
  const isMobile = useMobile();

  return (
    <div className={cn('mx-auto space-y-6', isMobile ? 'px-4' : 'max-w-4xl')}>
      <div
        className={cn(
          'flex items-center justify-between',
          isMobile && 'flex-col space-y-4'
        )}
      >
        <div className={cn('space-y-2', isMobile && 'text-center')}>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-16" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-8" />
        </div>
        <Skeleton className="h-2 w-full" />
      </div>

      <div
        className={cn('grid gap-4', isMobile ? 'grid-cols-2' : 'grid-cols-3')}
      >
        {Array.from({ length: isMobile ? 2 : 3 }).map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-12 w-full" />
          </Card>
        ))}
      </div>

      <Skeleton className="h-[300px] w-full rounded-lg" />

      {!isMobile && <Skeleton className="mx-auto h-4 w-64" />}

      <div
        className={cn(
          'mx-auto max-w-lg gap-4',
          isMobile ? 'flex flex-col' : 'grid grid-cols-3'
        )}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn('h-10', isMobile ? 'w-full' : 'w-full')}
          />
        ))}
      </div>
    </div>
  );
}

export function FlashcardsTab({ courseId }: { courseId?: string }) {
  const [view, setView] = useState<'deck_manager' | 'study_session'>(
    'deck_manager'
  );
  const [activeDeck, setActiveDeck] = useState<FlashcardDeck | null>(null);

  if (!courseId) {
    return (
      <div className="h-[calc(100vh-12.5rem)]">
        <CourseSelectionScreen />
      </div>
    );
  }

  const handleStartStudy = (deck: FlashcardDeck) => {
    setActiveDeck(deck);
    setView('study_session');
  };

  const handleExitStudy = () => {
    setActiveDeck(null);
    setView('deck_manager');
  };

  return (
    <div className="container mx-auto py-6">
      {view === 'deck_manager' ? (
        <DeckManager onStartStudy={handleStartStudy} courseId={courseId} />
      ) : (
        activeDeck && (
          <StudySession deck={activeDeck} onExit={handleExitStudy} />
        )
      )}
    </div>
  );
}

export function FlashcardsTabSkeleton() {
  const isMobile = useMobile();

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div
        className={cn(
          'flex items-center justify-between',
          isMobile && 'flex-col space-y-4'
        )}
      >
        <div className={cn('space-y-2', isMobile && 'text-center')}>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-6 w-16" />
      </div>

      <div
        className={cn(
          'grid gap-6',
          isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        )}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-8" />
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-8" />
                </div>
                <Skeleton className="h-px w-full" />
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="flex items-center justify-between">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-4" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter
              className={cn(
                'gap-2',
                isMobile ? 'flex-col' : 'grid grid-cols-2'
              )}
            >
              <Skeleton className={cn('h-9', isMobile ? 'w-full' : 'w-full')} />
              <Skeleton className={cn('h-9', isMobile ? 'w-full' : 'w-full')} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
