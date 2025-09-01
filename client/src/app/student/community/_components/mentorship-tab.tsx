'use client';

import { faker } from '@faker-js/faker';
import { Filter, PenTool, Search, Star, Users } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
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

type TMentorshipProgram = {
  id: string;
  title: string;
  mentorName: string;
  mentorInitials: string;
  mentorRole: string;
  rating: number;
  experience: number;
  duration: string;
  commitment: string;
  nextCohort: string;
  price: string;
  focusAreas: string[];
  spotsFilled: number;
  totalSpots: number;
};

const createProgram = (): TMentorshipProgram => {
  const name = faker.person.fullName();
  return {
    id: faker.string.uuid(),
    title: `${faker.person.jobArea()} Mentorship`,
    mentorName: name,
    mentorInitials: name
      .split(' ')
      .map((n) => n[0])
      .join(''),
    mentorRole: faker.person.jobTitle(),
    rating: faker.number.float({ min: 4.8, max: 4.9, fractionDigits: 1 }),
    experience: faker.number.int({ min: 8, max: 12 }),
    duration: `${faker.number.int({ min: 3, max: 6 })} months`,
    commitment: `${faker.number.int({ min: 2, max: 4 })} hours/week`,
    nextCohort: faker.date.future({ years: 0.2 }).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    price: faker.helpers.arrayElement(['Free', '$200/month']),
    focusAreas: faker.helpers.arrayElements(
      [
        'React',
        'TypeScript',
        'System Design',
        'Career Growth',
        'Full-Stack Development',
        'Leadership',
        'Interview Prep',
      ],
      { min: 3, max: 4 }
    ),
    spotsFilled: faker.number.int({ min: 1, max: 4 }),
    totalSpots: 5,
  };
};

const mentorshipData: TMentorshipProgram[] = Array.from(
  { length: 2 },
  createProgram
);

function MentorshipHeader() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full items-center gap-2">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input placeholder="Search mentorship programs..." className="pl-9" />
        </div>

        <Select>
          <SelectTrigger className="hidden shrink-0 md:flex">
            <SelectValue placeholder="Focus Area" />
          </SelectTrigger>
          {/* Mobile Filter */}
          <Tooltip>
            <TooltipTrigger asChild>
              <SelectTrigger className="w-auto shrink-0 p-0 md:hidden">
                <Button variant="outline" size="icon" className="border-0">
                  <Filter className="h-4 w-4" />
                </Button>
              </SelectTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Filter by Focus Area</p>
            </TooltipContent>
          </Tooltip>
          <SelectContent>
            <SelectItem value="all">All Areas</SelectItem>
            <SelectItem value="frontend">Frontend</SelectItem>
            <SelectItem value="backend">Backend</SelectItem>
          </SelectContent>
        </Select>

        <Button className="hidden shrink-0 md:flex">
          <Users className="h-4 w-4" />
          Become a Mentor
        </Button>
      </div>
      <Button className="w-full md:hidden">
        <Users className="h-4 w-4" />
        Become a Mentor
      </Button>
    </div>
  );
}

function MentorCard({ program }: { program: TMentorshipProgram }) {
  const progress = (program.spotsFilled / program.totalSpots) * 100;
  return (
    <Card className="">
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="text-lg">
              {program.mentorInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{program.title}</h3>
            <p className="text-sm">{program.mentorName}</p>
            <p className="text-muted-foreground text-sm">
              {program.mentorRole}
            </p>
            <div className="mt-1 flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 text-yellow-500" />
              {program.rating} • {program.experience} years
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
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
          <div className="flex flex-wrap gap-2">
            {program.focusAreas.map((area) => (
              <Badge key={area} variant="secondary">
                {area}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between text-xs">
            <p className="font-medium">Available Spots</p>
            <p className="text-muted-foreground">
              {program.spotsFilled}/{program.totalSpots}
            </p>
          </div>
          <Progress value={progress} />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="secondary">
          <PenTool className="h-4 w-4" />
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
}

function MentorshipHeaderSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10 md:w-32" />
        <Skeleton className="hidden h-10 w-40 md:block" />
      </div>
      <Skeleton className="h-10 w-full md:hidden" />
    </div>
  );
}

function MentorCardSkeleton() {
  return (
    <Card className="flex flex-col">
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
      <CardContent className="flex-1 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-2 w-full" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

export function MentorshipTab() {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="space-y-2">
        <MentorshipHeader />
        <Separator />
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {mentorshipData.map((program) => (
            <MentorCard key={program.id} program={program} />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}

export function MentorshipTabSkeleton() {
  return (
    <div className="space-y-2">
      <MentorshipHeaderSkeleton />
      <Separator />
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <MentorCardSkeleton />
        <MentorCardSkeleton />
      </div>
    </div>
  );
}
