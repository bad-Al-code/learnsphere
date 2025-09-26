'use client';

import { faker } from '@faker-js/faker';
import {
  AlertCircle,
  ChevronDownIcon,
  Clock,
  Filter,
  Lock,
  Monitor,
  Plus,
  RefreshCw,
  Search,
  Users,
  Video,
  Wifi,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
import {
  format,
  isBefore,
  isToday,
  parseISO,
  set,
  startOfToday,
} from 'date-fns';
import { useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import {
  useCategories,
  useCreateStudyRoom,
  useJoinStudyRoom,
  useStudyRooms,
} from '../hooks/use-study-room';
import {
  CreateStudyRoomInput,
  StudyRoom,
  createStudyRoomFormSchema,
} from '../schema/study-rooms.schema';

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
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const [isOpen, setIsOpen] = useState(false);

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
            <Select
              onValueChange={onTopicChange}
              disabled={isLoadingCategories}
            >
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
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
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
            <Button
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>

            <Button className="hidden md:flex" onClick={() => setIsOpen(true)}>
              <Plus className="h-4 w-4" />
              Create Room
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Create Room</p>
        </TooltipContent>
      </Tooltip>

      <CreateRoomDialog isOpen={isOpen} onOpenChange={setIsOpen} />
    </div>
  );
}

interface CreateRoomDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

function CreateRoomDialog({ isOpen, onOpenChange }: CreateRoomDialogProps) {
  const { mutate: createRoom, isPending } = useCreateStudyRoom();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const [open, setOpen] = useState(false);

  const form = useForm<CreateStudyRoomInput>({
    resolver: zodResolver(
      createStudyRoomFormSchema
    ) as Resolver<CreateStudyRoomInput>,
    defaultValues: {
      maxParticipants: 10,
      sessionType: 'now',
      durationInMinutes: 60,
    },
  });

  const sessionType = form.watch('sessionType');

  const onSubmit = (values: CreateStudyRoomInput) => {
    createRoom(values, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Study Room</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter room title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a short description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingCategories}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}{' '}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. React, Frontend, Workshop"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxParticipants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Participants</FormLabel>
                  <FormControl>
                    <Input type="number" min={2} max={50} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sessionType"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>When to start?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-2"
                    >
                      <FormItem className="flex items-center">
                        <FormControl>
                          <RadioGroupItem value="now" />
                        </FormControl>
                        <FormLabel className="font-normal">Start Now</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center">
                        <FormControl>
                          <RadioGroupItem value="later" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Schedule for Later
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {sessionType === 'later' && (
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => {
                  const date = field.value ? new Date(field.value) : undefined;

                  return (
                    <FormItem>
                      <div className="flex gap-4">
                        <div className="flex flex-col gap-3">
                          <Label>Start Time</Label>
                          <FormControl>
                            <Popover
                              modal={true}
                              open={open}
                              onOpenChange={setOpen}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-auto justify-between font-normal"
                                >
                                  {date ? format(date, 'PPP') : 'Select date'}
                                  {/* {date
                                    ? date.toLocaleDateString()
                                    : 'Select date'} */}
                                  <ChevronDownIcon />
                                </Button>
                              </PopoverTrigger>

                              <PopoverContent
                                className="w-auto overflow-hidden p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={date}
                                  captionLayout="dropdown"
                                  disabled={{ before: startOfToday() }}
                                  onSelect={(selectedDate) => {
                                    if (selectedDate) {
                                      let newDate = selectedDate;
                                      if (date) {
                                        newDate = set(selectedDate, {
                                          hours: date.getHours(),
                                          minutes: date.getMinutes(),
                                        });
                                      }

                                      field.onChange(newDate.toISOString());
                                    }
                                    setOpen(false);
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                        </div>

                        <div className="flex flex-col gap-3">
                          <Label htmlFor="time-picker" className="px-1">
                            Time
                          </Label>
                          <Input
                            type="time"
                            id="time-picker"
                            step="60"
                            value={date ? format(date, 'HH:mm') : ''}
                            onChange={(e) => {
                              if (!date) return;

                              const [hours, minutes] = e.target.value
                                .split(':')
                                .map(Number);

                              let newDate = set(date, { hours, minutes });
                              if (
                                isToday(newDate) &&
                                isBefore(newDate, new Date())
                              ) {
                                newDate = new Date();
                              }

                              field.onChange(newDate.toISOString());
                            }}
                            min={
                              isToday(date ?? new Date())
                                ? format(new Date(), 'HH:mm')
                                : undefined
                            }
                            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
                          />
                        </div>
                      </div>
                    </FormItem>
                  );
                }}
              />
            )}

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? 'Creating...' : 'Create Room'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function StudyRoomCard({ room }: { room: StudyRoom }) {
  const { mutate: joinRoom, isPending } = useJoinStudyRoom();

  const handleJoinClick = () => {
    if (room.isLive) {
      joinRoom(room.id);
    } else {
      toast.info('Reminder scheduled for this room!'); // Placeholder
    }
  };

  const formattedTime = room.time
    ? format(parseISO(room.time), 'dd MMM yyyy, HH:mm a')
    : 'No time available';

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="text-lg">{room.title}</CardTitle>
        <CardDescription className="">
          {room.isLive ? (
            <Badge variant="destructive">LIVE</Badge>
          ) : room.time ? (
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formattedTime}
            </Badge>
          ) : null}

          {room.isPrivate && <Lock className="text-muted-foreground h-4 w-4" />}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-2">
        <p className="text-muted-foreground text-sm">{room.subtitle}</p>
        <p className="text-sm">{room.host}</p>
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
          onClick={handleJoinClick}
          disabled={isPending}
        >
          {room.isLive ? 'Join Room' : 'Schedule Reminder'}
        </Button>
      </CardFooter>
    </Card>
  );
}

interface StudyRoomsErrorProps {
  onRetry?: () => void;
  error?: Error | null;
}

function StudyRoomsError({ onRetry, error }: StudyRoomsErrorProps) {
  const isNetworkError =
    error?.message?.toLowerCase().includes('network') ||
    error?.message?.toLowerCase().includes('fetch') ||
    !navigator.onLine;

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="text-center">
        <div className="bg-destructive/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full">
          {isNetworkError ? (
            <Wifi className="text-destructive h-6 w-6" />
          ) : (
            <AlertCircle className="text-destructive h-6 w-6" />
          )}
        </div>
        <CardTitle className="text-lg">
          {isNetworkError ? 'Connection Problem' : 'Loading Failed'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p className="text-muted-foreground text-sm">
          {isNetworkError
            ? "We couldn't connect to our servers. This might be due to a network issue."
            : 'We encountered an error while loading the study rooms. Please try again.'}
        </p>

        {onRetry && (
          <Button onClick={onRetry} className="w-full" variant="outline">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}

        <div className="text-muted-foreground space-y-2 text-xs">
          <p>If the problem persists:</p>
          <ul className="space-y-1">
            <li>• Check your internet connection</li>
            <li>• Refresh the page</li>
            <li>• Contact support if needed</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export function StudyRoomsTab() {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('all');
  const [debouncedQuery] = useDebounce(query, 500);
  const {
    data: studyRoomsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useStudyRooms(debouncedQuery, topic);

  const handleRetry = () => {
    refetch();
  };

  return (
    <div className="space-y-2">
      <StudyRoomsHeader onSearch={setQuery} onTopicChange={setTopic} />

      {isError ? (
        <StudyRoomsError onRetry={handleRetry} error={error} />
      ) : (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <StudyRoomCardSkeleton key={i} />
              ))
            : studyRoomsData?.map((room) => (
                <StudyRoomCard key={room.id} room={room} />
              ))}
        </div>
      )}
    </div>
  );
}

export function StudyRoomsTabSkeleton() {
  return (
    <div className="space-y-2">
      <StudyRoomsHeaderSkeleton />
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <StudyRoomCardSkeleton key={i} />
        ))}
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
