'use client';

import { faker } from '@faker-js/faker';
import {
  BookMarked,
  Check,
  Clock,
  Filter,
  Heart,
  Info,
  MoreVertical,
  PenTool,
  RefreshCw,
  Search,
  Share2,
  Star,
  ThumbsUp,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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

type TMentorshipProgram = {
  id: string;
  title: string;
  mentorName: string;
  mentorInitials: string;
  mentorRole: string;
  mentorBio: string;
  rating: number;
  reviews: number;
  experience: number;
  duration: string;
  commitment: string;
  nextCohort: string;
  price: string;
  focusAreas: string[];
  spotsFilled: number;
  totalSpots: number;
  isFavorite: boolean;
  likes: number;
  status: 'open' | 'filling-fast' | 'full';
};

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

function useMentorships() {
  const [data, setData] = useState<TMentorshipProgram[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = () => {
    setIsLoading(true);
    setIsError(false);
    setTimeout(() => {
      try {
        setData(generateMockMentorships());
        setIsLoading(false);
      } catch (e) {
        setError(e as Error);
        setIsError(true);
        setIsLoading(false);
      }
    }, 1000);
  };

  useEffect(() => {
    refetch();
  }, []);

  return { data, isLoading, isError, error, refetch };
}

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
            <SelectItem value="free">Free Only</SelectItem>
            <SelectItem value="favorites">My Favorites</SelectItem>
          </SelectContent>
        </Select>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={onRefetch}
              disabled={isRefetching}
              className="shrink-0"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Refresh</TooltipContent>
        </Tooltip>

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

function BecomeMentorDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [formData, setFormData] = useState<TBecomeMentorInput>({
    name: '',
    email: '',
    expertise: '',
    experience: '',
    availability: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onOpenChange(false);
      setFormData({
        name: '',
        email: '',
        expertise: '',
        experience: '',
        availability: '',
      });
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Become a Mentor</DialogTitle>
          <DialogDescription>
            Share your knowledge and help others grow in their careers.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="mentor-name">Full Name</Label>
            <Input
              id="mentor-name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Jane Smith"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mentor-email">Email</Label>
            <Input
              id="mentor-email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="jane@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expertise">Area of Expertise</Label>
            <Input
              id="expertise"
              value={formData.expertise}
              onChange={(e) =>
                setFormData({ ...formData, expertise: e.target.value })
              }
              placeholder="e.g., Full-Stack Development, Data Science"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mentor-experience">Years of Experience</Label>
            <Select
              value={formData.experience}
              onValueChange={(value) =>
                setFormData({ ...formData, experience: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3-5">3-5 years</SelectItem>
                <SelectItem value="5-8">5-8 years</SelectItem>
                <SelectItem value="8-10">8-10 years</SelectItem>
                <SelectItem value="10+">10+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="availability">Weekly Availability</Label>
            <Select
              value={formData.availability}
              onValueChange={(value) =>
                setFormData({ ...formData, availability: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Hours per week" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2-3">2-3 hours/week</SelectItem>
                <SelectItem value="3-4">3-4 hours/week</SelectItem>
                <SelectItem value="4-5">4-5 hours/week</SelectItem>
                <SelectItem value="5+">5+ hours/week</SelectItem>
              </SelectContent>
            </Select>
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
              !formData.expertise ||
              !formData.experience ||
              !formData.availability
            }
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </Button>
        </DialogFooter>
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
  const {
    data: mentorships,
    isLoading,
    isError,
    error,
    refetch,
  } = useMentorships();
  const [isRefetching, setIsRefetching] = useState(false);

  const handleRefetch = () => {
    setIsRefetching(true);
    refetch();
    setTimeout(() => setIsRefetching(false), 1000);
  };

  const handleToggleFavorite = (id: string) => {
    if (mentorships) {
      const updated = mentorships.map((m) =>
        m.id === id ? { ...m, isFavorite: !m.isFavorite } : m
      );
      mockMentorshipData = updated;
    }
  };

  const handleLike = (id: string) => {
    if (mentorships) {
      const updated = mentorships.map((m) =>
        m.id === id ? { ...m, likes: m.likes + 1 } : m
      );
      mockMentorshipData = updated;
    }
  };

  const filteredMentorships = mentorships?.filter((program) => {
    const matchesSearch =
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.mentorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.focusAreas.some((area) =>
        area.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (!matchesSearch) return false;

    if (filterStatus === 'all') return true;
    if (filterStatus === 'open') return program.status === 'open';
    if (filterStatus === 'filling-fast')
      return program.status === 'filling-fast';
    if (filterStatus === 'free') return program.price === 'Free';
    if (filterStatus === 'favorites') return program.isFavorite;

    return true;
  });

  if (isLoading) {
    return <MentorshipTabSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-3">
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
    <div className="space-y-3">
      <MentorshipHeader
        onBecomeMentor={() => setBecomeMentorOpen(true)}
        onRefetch={handleRefetch}
        isRefetching={isRefetching}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
      />

      {filteredMentorships && filteredMentorships.length === 0 ? (
        <EmptyState onBecomeMentor={() => setBecomeMentorOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {filteredMentorships?.map((program) => (
            <MentorCard
              key={program.id}
              program={program}
              onToggleFavorite={handleToggleFavorite}
              onLike={handleLike}
            />
          ))}
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
