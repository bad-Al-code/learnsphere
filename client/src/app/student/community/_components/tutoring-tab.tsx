'use client';

import { faker } from '@faker-js/faker';
import {
  Book,
  BookOpen,
  DollarSign,
  MessageSquare,
  Plus,
  Search,
  Star,
} from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type TAvailability = 'now' | 'hours' | 'tomorrow';
type TTutor = {
  id: string;
  name: string;
  initials: string;
  title: string;
  description: string;
  rate: number;
  sessionLength: number;
  rating: number;
  reviews: number;
  tags: string[];
  sessions: number;
  successRate: number;
  availability: TAvailability;
};

const createTutor = (): TTutor => {
  const name = faker.person.fullName();
  return {
    id: faker.string.uuid(),
    name,
    initials: name
      .split(' ')
      .map((n) => n[0])
      .join(''),
    title: faker.person.jobTitle(),
    description: faker.lorem.sentence(),
    rate: faker.helpers.arrayElement([25, 30, 35]),
    sessionLength: faker.helpers.arrayElement([30, 60]),
    rating: faker.number.float({ min: 4.7, max: 4.9, fractionDigits: 1 }),
    reviews: faker.number.int({ min: 80, max: 200 }),
    tags: faker.helpers.arrayElements(
      [
        'React',
        'JavaScript',
        'Frontend Development',
        'Database',
        'SQL',
        'Backend',
        'UI/UX Design',
        'Figma',
        'Design Systems',
      ],
      { min: 2, max: 3 }
    ),
    sessions: faker.number.int({ min: 200, max: 500 }),
    successRate: faker.number.int({ min: 92, max: 98 }),
    availability: faker.helpers.arrayElement(['now', 'hours', 'tomorrow']),
  };
};

const tutorsData: TTutor[] = Array.from({ length: 3 }, createTutor);

export function TutorsHeader() {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center">
      <div className="flex flex-1 gap-2">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input placeholder="Search tutors or subjects..." className="pl-9" />
        </div>

        <Select>
          <Tooltip>
            <TooltipTrigger asChild>
              <SelectTrigger className="">
                <div className="md:hidden">
                  <BookOpen className="h-4 w-4" />
                </div>

                <div className="hidden md:flex">
                  <SelectValue placeholder="Subject" />
                </div>
              </SelectTrigger>
            </TooltipTrigger>
            <TooltipContent className="md:hidden">Subject</TooltipContent>
          </Tooltip>

          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            <SelectItem value="math">Math</SelectItem>
            <SelectItem value="science">Science</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <Tooltip>
            <TooltipTrigger asChild>
              <SelectTrigger className="">
                <div className="hidden md:flex">
                  <SelectValue placeholder="Price Range" />
                </div>

                <div className="md:hidden">
                  <DollarSign className="h-4 w-4" />
                </div>
              </SelectTrigger>
            </TooltipTrigger>
            <TooltipContent className="md:hidden">Price Range</TooltipContent>
          </Tooltip>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="low">$0 - $50</SelectItem>
            <SelectItem value="mid">$50 - $100</SelectItem>
            <SelectItem value="high">$100+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button className="w-full md:w-auto">
        <Plus className="h-4 w-4" /> Become a Tutor
      </Button>
    </div>
  );
}

function TutorCard({ tutor }: { tutor: TTutor }) {
  const availabilityText = {
    now: 'Available now',
    hours: 'Available in 2 hours',
    tomorrow: 'Busy until tomorrow',
  };
  const availabilityColor = {
    now: 'text-emerald-500',
    hours: 'text-amber-500',
    tomorrow: 'text-red-500',
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-2">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="text-lg">
              {tutor.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{tutor.name}</p>
              <div className="flex items-center justify-center gap-1 text-sm">
                <Star className="h-4 w-4 text-yellow-500" /> {tutor.rating}{' '}
                <span className="text-muted-foreground">({tutor.reviews})</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">{tutor.title}</p>
            <p className="text-sm">{tutor.description}</p>
          </div>
        </div>

        <div className="text-muted-foreground mt-4 flex items-center gap-4 text-sm">
          <span>${tutor.rate}/hr</span>
          <span>&lt;{tutor.sessionLength} min</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {tutor.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        <Separator className="" />

        <div className="grid grid-cols-3 text-center">
          <div>
            <p className="font-bold">{tutor.sessions}</p>
            <p className="text-muted-foreground text-xs">Sessions</p>
          </div>
          <div>
            <p className="font-bold">{tutor.successRate}%</p>
            <p className="text-muted-foreground text-xs">Success Rate</p>
          </div>
          <div>
            <p
              className={cn('font-bold', availabilityColor[tutor.availability])}
            >
              {availabilityText[tutor.availability]}
            </p>
            <p className="text-muted-foreground text-xs">Availability</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="mt-auto gap-2">
        <Button variant="secondary" className="flex-1">
          <Book className="h-4 w-4" />
          Book Session
        </Button>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Message</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Message</TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  );
}

function TutorsHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center">
      <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
        <Skeleton className="h-10 w-full sm:col-span-1" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full md:w-36" />
    </div>
  );
}

function TutorCardSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Separator className="" />
        <div className="grid grid-cols-3 text-center">
          <Skeleton className="mx-auto h-8 w-12" />
          <Skeleton className="mx-auto h-8 w-12" />
          <Skeleton className="mx-auto h-8 w-16" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-12 md:w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

export function TutoringTab() {
  return (
    <div className="space-y-2">
      <TutorsHeader />
      <Separator />
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        {tutorsData.map((tutor) => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </div>
    </div>
  );
}

export function TutoringTabSkeleton() {
  return (
    <div className="space-y-2">
      <TutorsHeaderSkeleton />
      <Separator />
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <TutorCardSkeleton />
        <TutorCardSkeleton />
      </div>
    </div>
  );
}
