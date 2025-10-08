'use client';

import { faker } from '@faker-js/faker';
import {
  AlertCircle,
  BookMarked,
  Check,
  CheckCircle2,
  Clock,
  Filter,
  Heart,
  Info,
  Loader,
  MoreVertical,
  PenTool,
  Search,
  Share2,
  Shield,
  Star,
  ThumbsUp,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import { useBecomeMentor, useMentorships, useMentorStatus } from '../hooks';
import {
  becomeMentorFormSchema,
  BecomeMentorInput,
  TMentorshipProgram,
} from '../schema';

// type TMentorshipProgram = {
//   id: string;
//   title: string;
//   mentorName: string;
//   mentorInitials: string;
//   mentorRole: string;
//   mentorBio: string;
//   rating: number;
//   reviews: number;
//   experience: number;
//   duration: string;
//   commitment: string;
//   nextCohort: string;
//   price: string;
//   focusAreas: string[];
//   spotsFilled: number;
//   totalSpots: number;
//   isFavorite: boolean;
//   likes: number;
//   status: 'open' | 'filling-fast' | 'full';
// };

type TApplicationInput = {
  name: string;
  email: string;
  experience: string;
  motivation: string;
};

type TBecomeMentorInput = {
  name: string;
  email: string;
  expertise: string;
  experience: string;
  availability: string;
};

const generateMockMentorships = (): TMentorshipProgram[] =>
  [
    {
      title: 'Full-Stack Web Development',
      mentorBio:
        'Former tech lead at major FAANG company with 12 years of experience building scalable applications.',
    },
    {
      title: 'Data Science & ML',
      mentorBio:
        'PhD in Machine Learning with extensive industry experience in AI product development.',
    },
    {
      title: 'Product Management',
      mentorBio:
        'Senior PM with track record of launching successful products reaching millions of users.',
    },
    {
      title: 'UI/UX Design',
      mentorBio:
        'Award-winning designer specializing in user-centered design and design systems.',
    },
  ].map((p) => {
    const name = faker.person.fullName();
    return {
      ...p,
      id: faker.string.uuid(),
      mentorName: name,
      mentorInitials: name
        .split(' ')
        .map((n) => n[0])
        .join(''),
      mentorRole: faker.person.jobTitle(),
      rating: faker.number.float({ min: 4.7, max: 4.9, fractionDigits: 1 }),
      reviews: faker.number.int({ min: 45, max: 150 }),
      experience: faker.number.int({ min: 8, max: 15 }),
      duration: `${faker.number.int({ min: 3, max: 6 })} months`,
      commitment: `${faker.number.int({ min: 2, max: 4 })} hours/week`,
      nextCohort: faker.date
        .future({ years: 0.2 })
        .toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      price: faker.helpers.arrayElement([
        'Free',
        '$150/month',
        '$200/month',
        '$250/month',
      ]),
      focusAreas: faker.helpers.arrayElements(
        [
          'React',
          'TypeScript',
          'System Design',
          'Career Growth',
          'Full-Stack Development',
          'Leadership',
          'Interview Prep',
          'Portfolio Review',
          'Code Review',
        ],
        { min: 3, max: 5 }
      ),
      spotsFilled: faker.number.int({ min: 1, max: 5 }),
      totalSpots: 5,
      isFavorite: false,
      likes: faker.number.int({ min: 15, max: 89 }),
      status: faker.helpers.arrayElement([
        'open',
        'filling-fast',
        'full',
      ]) as TMentorshipProgram['status'],
    };
  });

let mockMentorshipData = generateMockMentorships();

const fetchMentorships = async (): Promise<TMentorshipProgram[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return mockMentorshipData;
};

// function useMentorships() {
//   const [data, setData] = useState<TMentorshipProgram[] | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isError, setIsError] = useState(false);
//   const [error, setError] = useState<Error | null>(null);

//   const refetch = () => {
//     setIsLoading(true);
//     setIsError(false);
//     setTimeout(() => {
//       try {
//         setData(generateMockMentorships());
//         setIsLoading(false);
//       } catch (e) {
//         setError(e as Error);
//         setIsError(true);
//         setIsLoading(false);
//       }
//     }, 1000);
//   };

//   useEffect(() => {
//     refetch();
//   }, []);

//   return { data, isLoading, isError, error, refetch };
// }

function MentorshipHeader({
  onBecomeMentor,
  onRefetch,
  isRefetching,
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
}: {
  onBecomeMentor: () => void;
  onRefetch: () => void;
  isRefetching: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search mentorship programs..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <Select value={filterStatus} onValueChange={onFilterChange}>
          <Tooltip>
            <TooltipTrigger asChild>
              <SelectTrigger className="w-auto">
                <div className="hidden md:flex">
                  <SelectValue placeholder="Filter" />
                </div>
                <div className="flex md:hidden">
                  <Filter className="h-4 w-4" />
                </div>
              </SelectTrigger>
            </TooltipTrigger>
            <TooltipContent className="md:hidden">
              Filter Programs
            </TooltipContent>
          </Tooltip>
          <SelectContent>
            <SelectItem value="all">All Programs</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="filling-fast">Filling Fast</SelectItem>
          </SelectContent>
        </Select>

        <Button className="hidden shrink-0 md:flex" onClick={onBecomeMentor}>
          <Users className="h-4 w-4" />
          Become a Mentor
        </Button>
      </div>
      <Button className="w-full md:hidden" onClick={onBecomeMentor}>
        <Users className="h-4 w-4" />
        Become a Mentor
      </Button>
    </div>
  );
}

function ProgramDetailsDialog({
  program,
  open,
  onOpenChange,
  onApply,
}: {
  program: TMentorshipProgram;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-xl">
                {program.mentorInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{program.title}</DialogTitle>
              <DialogDescription className="mt-1">
                with {program.mentorName}
              </DialogDescription>
              <p className="text-muted-foreground mt-1 text-sm">
                {program.mentorRole}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <h4 className="mb-2 font-semibold">About the Mentor</h4>
            <p className="text-muted-foreground text-sm">{program.mentorBio}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground text-xs">Duration</p>
              <p className="font-semibold">{program.duration}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Time Commitment</p>
              <p className="font-semibold">{program.commitment}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Next Cohort</p>
              <p className="font-semibold">{program.nextCohort}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Investment</p>
              <p className="font-semibold">{program.price}</p>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-semibold">What You'll Learn</h4>
            <div className="flex flex-wrap gap-2">
              {program.focusAreas.map((area) => (
                <Badge key={area} variant="secondary">
                  {area}
                </Badge>
              ))}
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Available Spots</p>
                <p className="text-muted-foreground text-xs">
                  {program.totalSpots - program.spotsFilled} of{' '}
                  {program.totalSpots} remaining
                </p>
              </div>
              <Progress
                value={(program.spotsFilled / program.totalSpots) * 100}
                className="w-32"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={onApply}>
            <PenTool className="h-4 w-4" />
            Apply Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ApplicationDialog({
  program,
  open,
  onOpenChange,
}: {
  program: TMentorshipProgram;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [formData, setFormData] = useState<TApplicationInput>({
    name: '',
    email: '',
    experience: '',
    motivation: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onOpenChange(false);
      setFormData({ name: '', email: '', experience: '', motivation: '' });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply to {program.title}</DialogTitle>
          <DialogDescription>
            Submit your application to join this mentorship program.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="john@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="experience">Your Experience Level</Label>
            <Select
              value={formData.experience}
              onValueChange={(value) =>
                setFormData({ ...formData, experience: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="motivation">Why do you want to join?</Label>
            <Textarea
              id="motivation"
              value={formData.motivation}
              onChange={(e) =>
                setFormData({ ...formData, motivation: e.target.value })
              }
              placeholder="Tell us about your goals and what you hope to achieve..."
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !formData.name ||
              !formData.email ||
              !formData.motivation
            }
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BecomeMentorTrigger({
  children,
  onOpenChange,
}: {
  children: React.ReactNode;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: status, isLoading } = useMentorStatus();

  const handleClick = () => {
    if (isLoading) return;

    if (status?.hasApplication) {
      if (status.status === 'pending') {
        toast.info('Application Pending', {
          description: 'Your application is currently under review.',
        });
      } else if (status.status === 'approved') {
        toast.success('Already a Mentor', {
          description: 'You are already an approved mentor!',
        });
      } else if (status.status === 'rejected') {
        toast.error('Application Previously Rejected', {
          description: 'Please contact support to reapply.',
        });
      }
      return;
    }

    onOpenChange(true);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {children}
    </div>
  );
}

function BecomeMentorDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    mutate: apply,
    isPending,
    isError,
    error,
    isSuccess,
    reset,
  } = useBecomeMentor();

  const {
    data: mentorStatus,
    isLoading: isLoadingStatus,
    isError: isStatusError,
  } = useMentorStatus();

  const [characterCount, setCharacterCount] = useState(0);

  const form = useForm<BecomeMentorInput>({
    resolver: zodResolver(becomeMentorFormSchema),
    defaultValues: { expertise: '', experience: '', availability: '' },
    mode: 'onBlur',
  });

  const expertiseValue = form.watch('expertise');

  useEffect(() => {
    setCharacterCount(expertiseValue?.length || 0);
  }, [expertiseValue]);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        form.reset();
        reset();
        setCharacterCount(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, form, reset]);

  const onSubmit = (values: BecomeMentorInput) => {
    const sanitizedValues = {
      expertise: values.expertise.trim(),
      experience: values.experience,
      availability: values.availability,
    };

    apply(sanitizedValues, {
      onSuccess: () => {
        setTimeout(() => {
          onOpenChange(false);
        }, 1500);
      },
    });
  };

  const handleCancel = () => {
    if (isPending) return;

    const hasChanges = form.formState.isDirty;
    if (hasChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to close?'
      );
      if (!confirmed) return;
    }

    onOpenChange(false);
  };

  if (isLoadingStatus) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Become a Mentor</DialogTitle>
            <DialogDescription>
              Share your knowledge and help others grow in their development
              journey.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-20 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (mentorStatus?.hasApplication) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="">
          <DialogHeader>
            <DialogTitle>Application Status</DialogTitle>
            <DialogDescription>
              You already have a mentorship application on file.
            </DialogDescription>
          </DialogHeader>

          {mentorStatus.status === 'pending' && (
            <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
              <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertTitle className="text-blue-900 dark:text-blue-100">
                Application Under Review
              </AlertTitle>
              <AlertDescription className="text-blue-700 dark:text-blue-300">
                Your application is currently being reviewed by our team. We'll
                notify you once a decision has been made.
                {mentorStatus.submittedAt && (
                  <p className="mt-2 text-sm">
                    Submitted on{' '}
                    {new Date(mentorStatus.submittedAt).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}

          {mentorStatus.status === 'approved' && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle className="text-green-900 dark:text-green-100">
                You're Already a Mentor!
              </AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-300">
                Congratulations! Your application has been approved and you are
                now an active mentor on our platform.
                {mentorStatus.submittedAt && (
                  <p className="mt-2 text-sm">
                    Approved on{' '}
                    {new Date(mentorStatus.submittedAt).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}

          {mentorStatus.status === 'rejected' && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Application Not Approved</AlertTitle>
              <AlertDescription>
                Unfortunately, your previous application was not approved at
                this time. If you'd like to discuss this decision or reapply,
                please contact our support team.
                {mentorStatus.submittedAt && (
                  <p className="mt-2 text-sm">
                    Reviewed on{' '}
                    {new Date(mentorStatus.submittedAt).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={isPending ? undefined : onOpenChange}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Become a Mentor</DialogTitle>
          <DialogDescription>
            Share your knowledge and help others grow in their development
            journey.
          </DialogDescription>
        </DialogHeader>

        {isSuccess && (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-700 dark:text-green-300">
              Application submitted successfully! We'll review it soon.
            </AlertDescription>
          </Alert>
        )}

        {isError && error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message || 'Something went wrong. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        {isStatusError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load application status. Please try again.
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="expertise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Area of Expertise{' '}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <ScrollArea className="rounded-md pr-3">
                      <Textarea
                        placeholder="e.g., Full-Stack Development with React and Node.js. I specialize in building scalable applications..."
                        className="max-h-[300px] min-h-[105px] resize-none"
                        disabled={isPending || isSuccess}
                        {...field}
                      />
                    </ScrollArea>
                  </FormControl>
                  <FormDescription className="flex justify-between text-xs">
                    <span>
                      Describe your technical skills and areas of expertise in
                      detail.
                    </span>
                    <span
                      className={
                        characterCount > 1000
                          ? 'text-destructive'
                          : 'text-muted-foreground'
                      }
                    >
                      {characterCount}/1000
                    </span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Years of Experience{' '}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending || isSuccess}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="3-5 years">3-5 years</SelectItem>
                      <SelectItem value="5-8 years">5-8 years</SelectItem>
                      <SelectItem value="8-10 years">8-10 years</SelectItem>
                      <SelectItem value="10+ years">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    Select your total years of professional experience.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Weekly Availability{' '}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isPending || isSuccess}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hours per week" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="2-3 hours/week">
                        2-3 hours/week
                      </SelectItem>
                      <SelectItem value="3-4 hours/week">
                        3-4 hours/week
                      </SelectItem>
                      <SelectItem value="4-5 hours/week">
                        4-5 hours/week
                      </SelectItem>
                      <SelectItem value="5+ hours/week">
                        5+ hours/week
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs">
                    How much time can you dedicate to mentoring each week?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isPending || isSuccess}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending || isSuccess || !form.formState.isValid}
              >
                {isPending && <Loader className="h-4 w-4 animate-spin" />}
                {isPending
                  ? 'Submitting...'
                  : isSuccess
                    ? 'Submitted!'
                    : 'Submit Application'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function ShareProgramDialog({
  program,
  open,
  onOpenChange,
}: {
  program: TMentorshipProgram;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);
  const shareLink = `https://example.com/mentorship/${program.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share {program.title}</DialogTitle>
          <DialogDescription>
            Share this mentorship program with your friends.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Program Link</Label>
            <div className="flex gap-2">
              <Input value={shareLink} readOnly className="flex-1" />
              <Button onClick={handleCopy} size="icon" variant="outline">
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MentorCard({
  program,
  onToggleFavorite,
  onLike,
}: {
  program: TMentorshipProgram;
  onToggleFavorite: (id: string) => void;
  onLike: (id: string) => void;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const progress = (program.spotsFilled / program.totalSpots) * 100;

  const statusConfig = {
    open: { badge: 'Open', className: 'border-emerald-500 text-emerald-500' },
    'filling-fast': {
      badge: 'Filling Fast',
      className: 'border-amber-500 text-amber-500',
    },
    full: { badge: 'Full', className: 'border-red-500 text-red-500' },
  };

  return (
    <>
      <Card className="group">
        <CardHeader>
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-lg">
                {program.mentorInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{program.title}</h3>
                  <p className="text-sm">{program.mentorName}</p>
                  <p className="text-muted-foreground text-sm">
                    {program.mentorRole}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Badge
                    variant="outline"
                    className={statusConfig[program.status].className}
                  >
                    {statusConfig[program.status].badge}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setDetailsOpen(true)}>
                        <Info className="h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShareOpen(true)}>
                        <Share2 className="h-4 w-4" />
                        Share Program
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onToggleFavorite(program.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${program.isFavorite ? 'fill-red-500 text-red-500' : ''}`}
                        />
                        {program.isFavorite
                          ? 'Remove from Favorites'
                          : 'Add to Favorites'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-medium">{program.rating}</span>
                  <span className="text-muted-foreground">
                    ({program.reviews})
                  </span>
                </div>
                <div className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {program.experience} years exp
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="font-semibold">Duration</p>
              <p className="text-muted-foreground">{program.duration}</p>
            </div>
            <div>
              <p className="font-semibold">Commitment</p>
              <p className="text-muted-foreground">{program.commitment}</p>
            </div>
            <div>
              <p className="font-semibold">Next Cohort</p>
              <p className="text-muted-foreground">{program.nextCohort}</p>
            </div>
            <div>
              <p className="font-semibold">Price</p>
              <p className="text-muted-foreground">{program.price}</p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold">Focus Areas</p>
            <div className="flex flex-wrap gap-1">
              {program.focusAreas.slice(0, 4).map((area) => (
                <Badge key={area} variant="secondary" className="text-xs">
                  {area}
                </Badge>
              ))}
              {program.focusAreas.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{program.focusAreas.length - 4}
                </Badge>
              )}
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between text-xs">
              <p className="font-medium">Available Spots</p>
              <p className="text-muted-foreground">
                {program.totalSpots - program.spotsFilled}/{program.totalSpots}
              </p>
            </div>
            <Progress value={progress} />
          </div>
        </CardContent>

        <CardFooter className="mt-auto flex items-center justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(program.id)}
            className="gap-1"
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="text-xs">{program.likes}</span>
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDetailsOpen(true)}
            >
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">Details</span>
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setApplyOpen(true)}
              disabled={program.status === 'full'}
            >
              <PenTool className="h-4 w-4" />
              Apply Now
            </Button>
          </div>
        </CardFooter>
      </Card>

      <ProgramDetailsDialog
        program={program}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onApply={() => {
          setDetailsOpen(false);
          setApplyOpen(true);
        }}
      />
      <ApplicationDialog
        program={program}
        open={applyOpen}
        onOpenChange={setApplyOpen}
      />
      <ShareProgramDialog
        program={program}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />
    </>
  );
}

function MentorCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
        <Skeleton className="h-2 w-full" />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Skeleton className="h-8 w-16" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-24" />
        </div>
      </CardFooter>
    </Card>
  );
}

function MentorshipHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="hidden h-10 w-40 md:block" />
      </div>
      <Skeleton className="h-10 w-full md:hidden" />
    </div>
  );
}

function EmptyState({ onBecomeMentor }: { onBecomeMentor: () => void }) {
  return (
    <Card className="flex flex-col items-center justify-center p-12 text-center">
      <BookMarked className="text-muted-foreground mb-4 h-16 w-16" />
      <h3 className="mb-2 text-xl font-semibold">
        No mentorship programs found
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Try adjusting your filters or become a mentor yourself to help others
        grow.
      </p>
      <Button onClick={onBecomeMentor}>
        <Users className="h-4 w-4" />
        Become a Mentor
      </Button>
    </Card>
  );
}

function ErrorState({
  error,
  onRetry,
}: {
  error: Error | null;
  onRetry: () => void;
}) {
  return (
    <Card className="flex flex-col items-center justify-center p-12 text-center">
      <X className="text-destructive mb-4 h-16 w-16" />
      <h3 className="mb-2 text-xl font-semibold">Something went wrong</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        {error?.message ||
          'Failed to load mentorship programs. Please try again.'}
      </p>
      <Button onClick={onRetry}>Try Again</Button>
    </Card>
  );
}

export function MentorshipTab() {
  const [becomeMentorOpen, setBecomeMentorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isRefetching, setIsRefetching] = useState(false);
  const [debouncedQuery] = useDebounce(searchQuery, 500);
  const filters = {
    query: debouncedQuery,
    status: filterStatus,
    isFree: filterStatus === 'free',
    isFavorite: filterStatus === 'favorites',
  };

  const {
    data: mentorships,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useMentorships(filters);
  const allPrograms =
    mentorships?.pages.flatMap((page) => page?.programs) ?? [];

  const handleRefetch = () => {
    setIsRefetching(true);
    refetch();
    setTimeout(() => setIsRefetching(false), 1000);
  };

  const handleToggleFavorite = (id: string) => {
    // if (mentorships) {
    //   const updated = allPrograms.map((m) =>
    //     m?.id === id ? { ...m, isFavorite: !m.isFavorite } : m
    //   );
    //   mockMentorshipData = updated;
    // }
  };

  const handleLike = (id: string) => {
    // if (mentorships) {
    //   const updated = allPrograms.map((m) =>
    //     m?.id === id ? { ...m, likes: m.likes + 1 } : m
    //   );
    //   mockMentorshipData = updated;
    // }
  };

  if (isLoading) {
    return <MentorshipTabSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-2">
        <MentorshipHeader
          onBecomeMentor={() => setBecomeMentorOpen(true)}
          onRefetch={handleRefetch}
          isRefetching={isRefetching}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
        />
        <ErrorState error={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <MentorshipHeader
        onBecomeMentor={() => setBecomeMentorOpen(true)}
        onRefetch={handleRefetch}
        isRefetching={isRefetching}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />

      {allPrograms && allPrograms.length === 0 ? (
        <EmptyState onBecomeMentor={() => setBecomeMentorOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {allPrograms.map((program) => (
            <MentorCard
              key={program?.id}
              program={program!}
              onToggleFavorite={handleToggleFavorite}
              onLike={handleLike}
            />
          ))}
        </div>
      )}

      {hasNextPage && (
        <div className="text-center">
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? 'Loading More...' : 'Load More'}
          </Button>
        </div>
      )}

      <BecomeMentorDialog
        open={becomeMentorOpen}
        onOpenChange={setBecomeMentorOpen}
      />
    </div>
  );
}

export function MentorshipTabSkeleton() {
  return (
    <div className="space-y-3">
      <MentorshipHeaderSkeleton />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <MentorCardSkeleton />
        <MentorCardSkeleton />
      </div>
    </div>
  );
}
