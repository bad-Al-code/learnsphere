'use client';

import { faker } from '@faker-js/faker';
import {
  Clock,
  Filter,
  Lock,
  Monitor,
  Plus,
  Search,
  Users,
  Video,
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
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useStudyRooms } from '../hooks/use-study-room';
import { StudyRoom } from '../schema/study-rooms.schema';

type TStudyRoom = {
  id: string;
  title: string;
  subtitle: string;
  host: string;
  participants: number;
  maxParticipants: number;
  duration: string;
  tags: string[];
  progress: number;
  isLive: boolean;
  isPrivate: boolean;
  time?: string;
};

const studyRoomsData: TStudyRoom[] = [
  {
    isLive: true,
    isPrivate: false,
    title: 'React Study Session',
    tags: ['React', 'JavaScript', 'Frontend'],
  },
  {
    isLive: false,
    isPrivate: false,
    title: 'Database Design Workshop',
    tags: ['Database', 'SQL', 'Backend'],
    time: '3:00 PM',
  },
  {
    isLive: true,
    isPrivate: true,
    title: 'Algorithm Practice',
    tags: ['Algorithms', 'Problem Solving'],
  },
].map((room) => ({
  ...room,
  id: faker.string.uuid(),
  subtitle: faker.lorem.words(3).replace(/\b\w/g, (l) => l.toUpperCase()),
  host: `Hosted By ${faker.person.fullName()}`,
  participants: faker.number.int({ min: 5, max: 10 }),
  maxParticipants: faker.helpers.arrayElement([10, 15, 20]),
  duration: `${faker.number.int({ min: 0, max: 2 })}h ${faker.number.int({ min: 15, max: 59 })}m`,
  progress: faker.number.int({ min: 20, max: 80 }),
}));

function StudyRoomsHeader({
  onSearch,
  onTopicChange,
}: {
  onSearch: (q: string) => void;
  onTopicChange: (t: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search study rooms..."
          className="pl-9"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="">
            <Select onValueChange={onTopicChange}>
              <SelectTrigger>
                <div className="md:hidden">
                  <Filter className="h-4 w-4" />
                </div>
                <div className="hidden md:flex">
                  <SelectValue className="" placeholder="Filter by topic" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="database">Database</SelectItem>
                <SelectItem value="algorithms">Algorithms</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Filter by topic</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="">
            <Button size="icon" className="md:hidden">
              <Plus className="h-4 w-4" />
            </Button>

            <Button className="hidden md:flex">
              <Plus className="h-4 w-4" />
              Create Room
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create Room</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

function StudyRoomCard({ room }: { room: StudyRoom }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between space-x-1">
          <CardTitle className="text-lg">{room.title}</CardTitle>
          <div className="flex items-center gap-2">
            {room.isLive ? (
              <Badge variant="destructive">LIVE</Badge>
            ) : (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {room.time}
              </Badge>
            )}
            {room.isPrivate && (
              <Lock className="text-muted-foreground h-4 w-4" />
            )}
          </div>
        </div>
        <p className="text-muted-foreground text-sm">{room.subtitle}</p>
        <p className="text-sm">{room.host}</p>
      </CardHeader>

      <CardContent className="flex-1 space-y-2">
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {room.participants}/{room.maxParticipants}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {room.duration}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <Monitor className="h-4 w-4" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {room.tags?.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <Progress value={room.progress} />
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          className="w-full"
          variant={room.isLive ? 'default' : 'secondary'}
        >
          {room.isLive ? 'Join Room' : 'Schedule Reminder'}
        </Button>
      </CardFooter>
    </Card>
  );
}

export function StudyRoomsTab() {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('all');
  const [debouncedQuery] = useDebounce(query, 500);
  const { data: studyRoomsData, isLoading } = useStudyRooms(
    debouncedQuery,
    topic
  );

  return (
    <TooltipProvider delayDuration={0}>
      <div className="space-y-2">
        <StudyRoomsHeader onSearch={setQuery} onTopicChange={setTopic} />

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <StudyRoomCardSkeleton key={i} />
              ))
            : studyRoomsData?.map((room) => (
                <StudyRoomCard key={room.id} room={room} />
              ))}
        </div>
      </div>
    </TooltipProvider>
  );
}

export function StudyRoomsTabSkeleton() {
  return (
    <div className="space-y-2">
      <StudyRoomsHeaderSkeleton />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        <StudyRoomCardSkeleton />
        <StudyRoomCardSkeleton />
        <StudyRoomCardSkeleton />
      </div>
    </div>
  );
}

function StudyRoomsHeaderSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <Skeleton className="h-10 flex-1" />
      <Skeleton className="hidden h-10 w-32 md:block" />
      <Skeleton className="h-10 w-10 md:hidden" />
      <Skeleton className="hidden h-10 w-32 md:block" />
      <Skeleton className="h-10 w-10 md:hidden" />
    </div>
  );
}

function StudyRoomCardSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-12" />
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
