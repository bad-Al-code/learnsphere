import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  Calendar,
  Clock,
  MapPin,
  MoreVertical,
  Pencil,
  Users,
  Video,
} from 'lucide-react';

type EventType = 'lecture' | 'workshop' | 'office hours';
type Event = {
  id: number;
  type: EventType;
  course: string;
  title: string;
  date: string;
  time: string;
  location: string;
  locationType: 'physical' | 'online';
  description: string;
  attendees: { current: number; max: number };
};
const events: Event[] = [
  {
    id: 1,
    type: 'lecture',
    course: 'Data Science',
    title: 'Data Science - Introduction to Python',
    date: '12/16/2024',
    time: '09:00 - 10:30',
    location: 'Room 101',
    locationType: 'physical',
    description:
      'Introduction to Python programming fundamentals for data science applications.',
    attendees: { current: 25, max: 30 },
  },
  {
    id: 2,
    type: 'workshop',
    course: 'Web Development',
    title: 'Web Development - React Hooks Workshop',
    date: '12/16/2024',
    time: '14:00 - 16:00',
    location: 'Online',
    locationType: 'online',
    description:
      'Hands-on workshop covering React Hooks including useState, useEffect, and custom hooks.',
    attendees: { current: 18, max: 20 },
  },
  {
    id: 3,
    type: 'office hours',
    course: 'All Courses',
    title: 'Office Hours - General Q&A',
    date: '12/16/2024',
    time: '16:30 - 17:30',
    location: 'Office 205',
    locationType: 'physical',
    description:
      'Open office hours for students to ask questions about any course material.',
    attendees: { current: 8, max: 15 },
  },
];

const eventTypeColors: Record<EventType, string> = {
  lecture: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  workshop: 'bg-green-100 text-green-800 hover:bg-green-100',
  'office hours': 'bg-purple-100 text-purple-800 hover:bg-purple-100',
};

export async function UpcomingEvents() {
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  await sleep(2000);

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold">Upcoming Events</h2>
      <div className="space-y-2">
        {events.map((event) => (
          <Card key={event.id}>
            <CardContent className="">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      className={cn('capitalize', eventTypeColors[event.type])}
                    >
                      {event.type}
                    </Badge>
                    <Badge variant="outline">{event.course}</Badge>
                  </div>
                  <h3 className="text-lg font-bold">{event.title}</h3>
                  <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {event.locationType === 'physical' ? (
                        <MapPin className="h-4 w-4" />
                      ) : (
                        <Video className="h-4 w-4" />
                      )}
                      {event.location}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <Users className="h-4 w-4" />
                    {event.attendees.current}/{event.attendees.max} attendees
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function UpcomingEventsSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-7 w-48" />
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-28 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-80" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-5 w-full max-w-lg" />
                  <Skeleton className="h-5 w-32" />
                </div>
                <div className="flex gap-1">
                  <Skeleton className="h-10 w-10" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
