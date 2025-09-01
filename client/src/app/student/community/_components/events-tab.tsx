'use client';

import { faker } from '@faker-js/faker';
import {
  Award,
  Calendar,
  Filter,
  Globe,
  Play,
  Plus,
  Search,
  Ticket,
  Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
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

type TEventType = 'Workshop' | 'Competition' | 'Networking';
type TEvent = {
  id: string;
  title: string;
  type: TEventType;
  host: string;
  date: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  tags: string[];
  isLive: boolean;
  prize?: string;
};

const createEvent = (type: TEventType, isLive: boolean): TEvent => ({
  id: faker.string.uuid(),
  title: faker.lorem.words(3).replace(/\b\w/g, (l) => l.toUpperCase()),
  type,
  host: `Hosted by ${faker.company.name()}`,
  date: `Jan 25, 2024 • 2:00 PM - 4:00 PM`,
  location: faker.helpers.arrayElement(['Online Event', 'Main Campus Hall']),
  attendees: faker.number.int({ min: 40, max: 250 }),
  maxAttendees: faker.helpers.arrayElement([50, 200, 300]),
  tags: faker.helpers.arrayElements(
    [
      'React',
      'Hooks',
      'JavaScript',
      'Algorithms',
      'Problem Solving',
      'Career',
      'Tech Jobs',
    ],
    3
  ),
  isLive,
  prize: type === 'Competition' ? '$500 Amazon Gift Card' : undefined,
});

const eventsData: TEvent[] = [
  createEvent('Workshop', false),
  createEvent('Competition', true),
  createEvent('Networking', false),
];

function EventsHeader() {
  return (
    <div className="flex w-full items-center gap-2">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input placeholder="Search events..." className="pl-9" />
      </div>

      <Select>
        {/* Desktop Filter */}
        <SelectTrigger className="hidden md:flex">
          <SelectValue placeholder="Event Type" />
        </SelectTrigger>

        {/* Mobile Filter */}
        <div className="md:hidden">
          <Tooltip>
            <TooltipTrigger asChild>
              <SelectTrigger className="justify-center">
                <Filter className="h-4 w-4" />
              </SelectTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Filter by event type</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <SelectContent>
          <SelectItem value="all">All Events</SelectItem>
          <SelectItem value="workshops">Workshops</SelectItem>
          <SelectItem value="competitions">Competitions</SelectItem>
          <SelectItem value="networking">Networking</SelectItem>
        </SelectContent>
      </Select>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="shrink-0">
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline">Create Event</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="md:hidden">
          <p>Create Event</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

function EventCard({ event }: { event: TEvent }) {
  const attendanceProgress = (event.attendees / event.maxAttendees) * 100;
  return (
    <Card className="">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle>{event.title}</CardTitle>
          {event.prize && (
            <div className="flex items-center gap-2 text-sm text-yellow-500">
              <Award className="h-4 w-4" />
              {event.prize}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{event.type}</Badge>
          {event.isLive && <Badge variant="destructive">LIVE</Badge>}
        </div>
        <p className="text-muted-foreground text-sm">{event.host}</p>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="text-muted-foreground space-y-2 text-sm">
          <p className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {event.date}
          </p>
          <p className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {event.location}
          </p>
          <p className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {event.attendees}/{event.maxAttendees} attendees
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <Progress value={attendanceProgress} />
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={event.isLive ? 'default' : 'secondary'}
        >
          {event.isLive ? (
            <>
              <Play className="h-4 w-4" />
              Join Now
            </>
          ) : (
            <>
              <Ticket className="h-4 w-4" />
              Register
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

function EventsHeaderSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-10 flex-1" />
      <Skeleton className="h-10 w-10 md:w-32" />
      <Skeleton className="h-10 w-10 md:w-36" />
    </div>
  );
}

function EventCardSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="space-y-2">
        <Skeleton className="h-7 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-2 w-full" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

export function EventsTab() {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="space-y-2">
        <EventsHeader />
        <Separator />
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {eventsData.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}

export function EventsTabSkeleton() {
  return (
    <div className="space-y-2">
      <EventsHeaderSkeleton />
      <Separator />
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <EventCardSkeleton />
        <EventCardSkeleton />
        <EventCardSkeleton />
      </div>
    </div>
  );
}
