'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  AlertCircle,
  Award,
  CalendarIcon,
  CheckCircle,
  ChevronDownIcon,
  Clock,
  Edit,
  Filter,
  Globe,
  Loader,
  MapPin,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Tag,
  Trash2,
  UserMinus,
  UserPlus,
  Users,
  X,
  XCircle,
} from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormDescription,
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
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getInitials } from '@/lib/utils';
import { useSessionStore } from '@/stores/session-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, isBefore, isToday, set, startOfToday } from 'date-fns';
import { useEffect, useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import {
  useCreateEvent,
  useDeleteEvent,
  useEventAttendees,
  useEvents,
  useRegisterForEvent,
  useRegistrationStatus,
  useUnregisterFromEvent,
  useUpdateEvent,
} from '../hooks';
import {
  createEventFormSchema,
  CreateEventInput,
  TEvent,
  updateEventFormSchema,
  UpdateEventInput,
} from '../schema';

const EVENT_TYPES = ['Workshop', 'Competition', 'Networking'] as const;

interface CreateEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateEventDialog({
  isOpen,
  onOpenChange,
}: CreateEventDialogProps) {
  const { mutate: createEvent, isPending, error, reset } = useCreateEvent();
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const form = useForm<CreateEventInput>({
    resolver: zodResolver(createEventFormSchema) as Resolver<CreateEventInput>,
    defaultValues: { maxAttendees: 50, prize: '', tags: '' },
  });

  const onSubmit = (values: CreateEventInput) => {
    const submitData = {
      ...values,
      tags: tags.length > 0 ? tags.join(',') : '',
      date: new Date(values.date),
    };

    createEvent(submitData, {
      onSuccess: () => {
        onOpenChange(false);
        handleReset();
      },
    });
  };

  const handleReset = () => {
    form.reset();
    setTags([]);
    setTagInput('');
    reset();
  };

  const handleDialogClose = (open: boolean) => {
    if (!open && !isPending) {
      handleReset();
    }
    onOpenChange(open);
  };

  const addTag = (tagValue: string) => {
    const newTag = tagValue.trim().toLowerCase();
    if (newTag && !tags.includes(newTag) && tags.length < 10) {
      setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const formatDateTimeLocal = (date: Date | undefined) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return formatDateTimeLocal(now);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Create New Event
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new community event. All
            fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message || 'An error occurred while creating the event.'}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => onSubmit(values))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Event Title *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., React Hooks Deep Dive Workshop"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose a clear, descriptive title for your event.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EVENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          <div className="flex items-center gap-2">
                            {type === 'Workshop' && (
                              <Clock className="h-4 w-4" />
                            )}
                            {type === 'Competition' && (
                              <Award className="h-4 w-4" />
                            )}
                            {type === 'Networking' && (
                              <Users className="h-4 w-4" />
                            )}
                            {type}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* 
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date & Time *</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        min={getMinDateTime()}
                        value={formatDateTimeLocal(field.value)}
                        onChange={(e) => {
                          const date = e.target.value
                            ? new Date(e.target.value)
                            : undefined;
                          field.onChange(date);
                        }}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => {
                const date = field.value ? new Date(field.value) : undefined;

                return (
                  <FormItem>
                    <div className="flex gap-2">
                      <div className="flex flex-col gap-3">
                        <Label>Start Date *</Label>
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

                                    field.onChange(newDate);
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
                          Time *
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

                            field.onChange(newDate);
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
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Location *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Online via Zoom, Conference Room A, Central Library"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Specify where the event will take place (online or physical
                    address).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxAttendees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Maximum Attendees *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="2"
                      max="10000"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    How many people can attend this event? (2-10,000)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                Tags (Optional)
              </FormLabel>
              <div className="space-y-2">
                <Input
                  placeholder="Add tags (press Enter or comma to add)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyPress}
                  onBlur={() => tagInput.trim() && addTag(tagInput)}
                  disabled={isPending || tags.length >= 10}
                />

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-destructive-foreground ml-1 rounded-full"
                          disabled={isPending}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                <p className="text-muted-foreground text-sm">
                  Add relevant tags to help people discover your event.{' '}
                  {tags.length}/10 tags used.
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="prize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    Prize (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., $100 Amazon Gift Card, Certificate of Achievement"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Mention any prizes or awards for participants (competitions
                    only).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogClose(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="">
                {isPending ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Event'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface EditEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event: TEvent;
}

export function EditEventDialog({
  isOpen,
  onOpenChange,
  event,
}: EditEventDialogProps) {
  const { mutate: updateEvent, isPending, error, reset } = useUpdateEvent();
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const form = useForm<UpdateEventInput>({
    resolver: zodResolver(updateEventFormSchema) as Resolver<UpdateEventInput>,
    defaultValues: {
      title: event.title,
      type: event.type,
      date: new Date(event.date),
      location: event.location,
      maxAttendees: event.maxAttendees,
      tags: event.tags || [],
      prize: event.prize || '',
    },
  });

  useEffect(() => {
    if (isOpen && event) {
      setTags(event.tags || []);
      form.reset({
        title: event.title,
        type: event.type,
        date: new Date(event.date),
        location: event.location,
        maxAttendees: event.maxAttendees,
        tags: event.tags || [],
        prize: event.prize || '',
      });
    }
  }, [isOpen, event, form]);

  const onSubmit = (values: UpdateEventInput) => {
    const submitData: Partial<UpdateEventInput> = {};

    if (values.title !== undefined && values.title !== event.title) {
      submitData.title = values.title;
    }
    if (values.type !== undefined && values.type !== event.type) {
      submitData.type = values.type;
    }
    if (
      values.date &&
      new Date(values.date).getTime() !== new Date(event.date).getTime()
    ) {
      submitData.date = values.date;
    }
    if (values.location !== undefined && values.location !== event.location) {
      submitData.location = values.location;
    }
    if (
      values.maxAttendees !== undefined &&
      values.maxAttendees !== event.maxAttendees
    ) {
      submitData.maxAttendees = values.maxAttendees;
    }
    if (JSON.stringify(tags) !== JSON.stringify(event.tags || [])) {
      submitData.tags = tags.length > 0 ? tags : undefined;
    }
    if (values.prize !== undefined && values.prize !== (event.prize || '')) {
      submitData.prize = values.prize;
    }

    if (Object.keys(submitData).length === 0) {
      toast.error('No changes detected', {
        description: 'Please modify at least one field to update the event.',
      });
      return;
    }

    updateEvent(
      { eventId: event.id, data: submitData as UpdateEventInput },
      {
        onSuccess: () => {
          onOpenChange(false);
          handleReset();
        },
      }
    );
  };

  const handleReset = () => {
    form.reset();
    setTags(event.tags || []);
    setTagInput('');
    reset();
  };

  const handleDialogClose = (open: boolean) => {
    if (!open && !isPending) {
      handleReset();
    }
    onOpenChange(open);
  };

  const addTag = (tagValue: string) => {
    const newTag = tagValue.trim().toLowerCase();
    if (newTag && !tags.includes(newTag) && tags.length < 10) {
      setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const formatDateTimeLocal = (date: Date | undefined) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return formatDateTimeLocal(now);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Event
          </DialogTitle>
          <DialogDescription>
            Update the details of your event. Only modified fields will be
            updated.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message || 'An error occurred while updating the event.'}
            </AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., React Hooks Deep Dive Workshop"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EVENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          <div className="flex items-center gap-2">
                            {type === 'Workshop' && (
                              <Clock className="h-4 w-4" />
                            )}
                            {type === 'Competition' && (
                              <Award className="h-4 w-4" />
                            )}
                            {type === 'Networking' && (
                              <Users className="h-4 w-4" />
                            )}
                            {type}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => {
                const date = field.value ? new Date(field.value) : undefined;

                return (
                  <FormItem>
                    <div className="flex gap-2">
                      <div className="flex flex-col gap-3">
                        <Label>Start Date *</Label>
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

                                    field.onChange(newDate);
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
                          Time *
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

                            field.onChange(newDate);
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
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Location
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Online via Zoom, Conference Room A"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxAttendees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Maximum Attendees
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="2"
                      max="10000"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Current attendees: {event.attendees}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                Tags (Optional)
              </FormLabel>
              <div className="space-y-2">
                <Input
                  placeholder="Add tags (press Enter or comma to add)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyPress}
                  onBlur={() => tagInput.trim() && addTag(tagInput)}
                  disabled={isPending || tags.length >= 10}
                />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:bg-destructive hover:text-destructive-foreground ml-1 rounded-full"
                          disabled={isPending}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-muted-foreground text-sm">
                  {tags.length}/10 tags used.
                </p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="prize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    Prize (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., $100 Amazon Gift Card"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogClose(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="min-w-[120px]"
              >
                {isPending ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Event'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  event: TEvent;
}

export function DeleteEventDialog({
  isOpen,
  onOpenChange,
  event,
}: DeleteEventDialogProps) {
  const { mutate: deleteEvent, isPending, error } = useDeleteEvent();

  const handleDelete = () => {
    deleteEvent(event.id, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="text-destructive h-5 w-5" />
            Delete Event
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            Are you sure you want to delete <strong>"{event.title}"</strong>?
            <p className="text-sm">
              This action cannot be undone. All event data and attendee
              registrations will be permanently deleted.
            </p>
            {event.attendees > 1 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Warning:</strong> This event has {event.attendees}{' '}
                  registered attendees who will lose access.
                </AlertDescription>
              </Alert>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message || 'Failed to delete event. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/80"
          >
            {isPending ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete Event
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface EventRegistrationButtonProps {
  event: TEvent;
  currentUserId?: string;
}

export function EventRegistrationButton({
  event,
  currentUserId,
}: EventRegistrationButtonProps) {
  const [showUnregisterDialog, setShowUnregisterDialog] = useState(false);

  const { mutate: register, isPending: isRegistering } = useRegisterForEvent();
  const { mutate: unregister, isPending: isUnregistering } =
    useUnregisterFromEvent();
  const { data: registrationStatus, isLoading: isCheckingStatus } =
    useRegistrationStatus(event.id, !!currentUserId);

  const isHost = currentUserId === event.hostId;
  const isRegistered = registrationStatus?.isRegistered || false;
  const isFull =
    registrationStatus?.isFull || event.attendees >= event.maxAttendees;
  const isPending = isRegistering || isUnregistering;

  if (!currentUserId) {
    return null;
  }

  if (isHost) {
    return (
      <Button variant="outline" disabled className="w-full">
        <CheckCircle className="h-4 w-4" />
        Your Event
      </Button>
    );
  }

  const handleRegister = () => {
    register(event.id);
  };

  const handleUnregister = () => {
    setShowUnregisterDialog(false);
    unregister(event.id);
  };

  if (isCheckingStatus) {
    return (
      <Button variant="secondary" disabled className="w-full">
        <Loader className="h-4 w-4 animate-spin" />
        Checking...
      </Button>
    );
  }

  if (isRegistered) {
    return (
      <>
        <Button
          variant="outline"
          onClick={() => setShowUnregisterDialog(true)}
          disabled={isPending}
          className="w-full border-green-500 text-green-600 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-950"
        >
          {isUnregistering ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Unregistering...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              Registered
            </>
          )}
        </Button>

        <AlertDialog
          open={showUnregisterDialog}
          onOpenChange={setShowUnregisterDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unregister from event?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to unregister from "{event.title}"? You
                can register again later if spots are still available.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleUnregister}
                className="bg-destructive hover:bg-destructive/90"
              >
                <UserMinus className="h-4 w-4" />
                Unregister
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  if (isFull) {
    return (
      <Button variant="secondary" disabled className="w-full">
        <XCircle className="h-4 w-4" />
        Event Full
      </Button>
    );
  }

  return (
    <Button onClick={handleRegister} disabled={isPending} className="w-full">
      {isRegistering ? (
        <>
          <Loader className="h-4 w-4 animate-spin" />
          Registering...
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          Register Now
        </>
      )}
    </Button>
  );
}

interface AttendeesDialogProps {
  eventId: string;
  eventTitle: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AttendeesDialog({
  eventId,
  eventTitle,
  isOpen,
  onOpenChange,
}: AttendeesDialogProps) {
  const {
    data: attendees,
    isLoading,
    error,
  } = useEventAttendees(eventId, {
    enabled: isOpen,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attendees for "{eventTitle}"</DialogTitle>
          <DialogDescription>
            {attendees?.length || 0} members registered.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-2">
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <AttendeeSkeleton key={i} />
                ))
              : attendees?.map((attendee) => (
                  <div
                    key={attendee.user.id}
                    className="hover:bg-muted flex items-center gap-3 rounded-md p-2"
                  >
                    <Avatar>
                      <AvatarImage src={attendee.user.avatarUrl ?? undefined} />
                      <AvatarFallback>
                        {getInitials(attendee.user.name)}
                      </AvatarFallback>
                    </Avatar>

                    <span className="font-medium">{attendee.user.name}</span>
                  </div>
                ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

interface EventsHeaderProps {
  onSearch: (query: string) => void;
  onTypeChange: (type: string) => void;
  onCreateEvent?: () => void;
  isSearching?: boolean;
  searchValue: string;
  typeValue: string;
  onAttendingToggle: (val: boolean) => void;
  isAttending: boolean;
}

function EventsHeader({
  onSearch,
  onTypeChange,
  onCreateEvent,
  isSearching = false,
  searchValue,
  typeValue,
  onAttendingToggle,
  isAttending,
}: EventsHeaderProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onSearch(val);
  };

  const handleTypeChange = (val: string) => {
    onTypeChange(val);
  };

  const handleCreateClick = () => {
    setIsCreateDialogOpen(true);
    onCreateEvent?.();
  };

  return (
    <div className="flex w-full items-center gap-2">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        {isSearching && (
          <Loader className="text-muted-foreground absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin" />
        )}

        <Input
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search events by title, host, or tags..."
          className="pr-9 pl-9"
          disabled={isSearching}
        />
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Select onValueChange={handleTypeChange} value={typeValue}>
              <SelectTrigger className="">
                <div className="hidden md:flex">
                  <SelectValue placeholder="Event Type" />
                </div>
                <div className="flex md:hidden">
                  <Filter className="h-4 w-4" />
                </div>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="Workshop">Workshops</SelectItem>
                <SelectItem value="Competition">Competitions</SelectItem>
                <SelectItem value="Networking">Networking</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TooltipTrigger>

        <TooltipContent className="md:hidden">
          Filter by event type
        </TooltipContent>
      </Tooltip>

      <div className="flex items-center space-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1">
              <Switch
                id="my-events-filter"
                checked={isAttending}
                onCheckedChange={onAttendingToggle}
                className="cursor-pointer"
              />
              <Label htmlFor="my-events-filter" className="hidden md:inline">
                My Events
              </Label>
            </div>
          </TooltipTrigger>
          <TooltipContent className="md:hidden">My Events</TooltipContent>
        </Tooltip>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="shrink-0"
            onClick={handleCreateClick}
            size="default"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline">Create Event</span>
          </Button>
        </TooltipTrigger>

        <TooltipContent className="md:hidden">Create New Event</TooltipContent>
      </Tooltip>

      <CreateEventDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}

interface EventCardProps {
  event: TEvent;
  onJoinEvent?: (eventId: string) => void;
  onRegisterEvent?: (eventId: string) => void;
  currentUserId?: string;
  onViewAttendees?: (eventId: string, eventTitle: string) => void;
}

function EventCard({
  event,
  onJoinEvent,
  onViewAttendees,
  onRegisterEvent,
  currentUserId,
}: EventCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const attendanceProgress = Math.min(
    (event.attendees / event.maxAttendees) * 100,
    100
  );

  const isFull = event.attendees >= event.maxAttendees;
  const isAlmostFull = attendanceProgress >= 90;
  const isHost = currentUserId === event.hostId;

  const handleActionClick = () => {
    if (event.isLive && onJoinEvent) {
      onJoinEvent(event.id);
    } else if (!event.isLive && onRegisterEvent) {
      onRegisterEvent(event.id);
    }
  };

  const displayDate = format(new Date(event.date), 'MMM d, yyyy • p');

  return (
    <>
      <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
        <CardHeader className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-2 text-lg leading-tight">
              {event.title}
            </CardTitle>

            <div className="flex items-center gap-2">
              {event.prize && (
                <div className="flex shrink-0 items-center gap-1 rounded-full bg-yellow-50 px-2 py-1 text-xs text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
                  <Award className="h-3 w-3" />
                  <span className="font-medium">{event.prize}</span>
                </div>
              )}

              {isHost && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                      <Edit className="h-4 w-4" />
                      Edit Event
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Event
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <Badge variant="secondary" className="text-xs">
              {event.type}
            </Badge>
            {event.isLive && (
              <Badge variant="destructive" className="text-xs">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                LIVE
              </Badge>
            )}
            {isFull && !event.isLive && (
              <Badge
                variant="outline"
                className="text-xs text-red-600 dark:text-red-400"
              >
                FULL
              </Badge>
            )}
            {isAlmostFull && !isFull && !event.isLive && (
              <Badge
                variant="outline"
                className="text-xs text-orange-600 dark:text-orange-400"
              >
                ALMOST FULL
              </Badge>
            )}
            {isHost && (
              <Badge variant="outline" className="text-xs">
                Your Event
              </Badge>
            )}
          </div>

          <p className="text-muted-foreground text-sm font-medium">
            {event.host}
          </p>
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          <div className="text-muted-foreground space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 shrink-0" />
              <span className="truncate">{displayDate}</span>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>

            <div
              className="flex cursor-pointer items-center gap-2 text-sm hover:underline"
              onClick={() => onViewAttendees?.(event.id, event.title)}
            >
              <Users className="h-4 w-4 shrink-0" />
              <span>
                {event.attendees.toLocaleString()}/
                {event.maxAttendees.toLocaleString()} attendees
              </span>
            </div>
          </div>

          {event.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {event.tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {event.tags.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{event.tags.length - 4} more
                </Badge>
              )}
            </div>
          )}

          <div className="space-y-1">
            <div className="text-muted-foreground flex justify-between text-xs">
              <span>Attendance</span>
              <span>{Math.round(attendanceProgress)}%</span>
            </div>
            <Progress
              value={attendanceProgress}
              className="h-2"
              aria-label={`${attendanceProgress}% filled`}
            />
          </div>
        </CardContent>

        <CardFooter className="pt-auto">
          <EventRegistrationButton
            event={event}
            currentUserId={currentUserId}
          />
        </CardFooter>
      </Card>

      {isHost && (
        <>
          <EditEventDialog
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            event={event}
          />
          <DeleteEventDialog
            isOpen={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            event={event}
          />
        </>
      )}
    </>
  );
}

function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <Card className="mx-auto flex max-w-md flex-col items-center justify-center space-y-4 p-4">
      <Alert variant="destructive" className="">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription className="mt-2">
          {error.message || 'Failed to load events. Please try again.'}
        </AlertDescription>
      </Alert>
      <Button variant="outline" onClick={onRetry}>
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </Card>
  );
}

function EmptyState({
  query,
  type,
  onReset,
}: {
  query: string;
  type: string;
  onReset: () => void;
}) {
  const hasSearch = query.trim().length > 0;
  const hasTypeFilter = type !== 'all';
  const hasFilters = hasSearch || hasTypeFilter;

  const getButtonText = () => {
    if (hasSearch && hasTypeFilter) {
      return 'Clear All Filters';
    } else if (hasSearch) {
      return 'Clear Search';
    } else if (hasTypeFilter) {
      return 'Clear Filter';
    }
    return 'Clear Filters';
  };

  return (
    <Card className="mx-auto flex max-w-md flex-col items-center justify-center space-y-4 p-4 text-center">
      <div className="bg-muted rounded-full p-4">
        <CalendarIcon className="text-muted-foreground h-8 w-8" />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          {hasFilters ? 'No events found' : 'No events yet'}
        </h3>

        <p className="text-muted-foreground max-w-sm text-sm">
          {hasFilters
            ? 'Try adjusting your search terms or filters to find more events.'
            : 'Events will appear here when they become available. Check back later or create your own event.'}
        </p>
      </div>

      {hasFilters && (
        <Button variant="outline" onClick={onReset}>
          <RefreshCw className="h-4 w-4" />
          {getButtonText()}
        </Button>
      )}
    </Card>
  );
}

export function EventsTab() {
  const { user } = useSessionStore();
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [debouncedQuery] = useDebounce(query, 500);
  const [isAttending, setIsAttending] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedEventTitle, setSelectedEventTitle] = useState('');
  const [isAttendeesDialogOpen, setIsAttendeesDialogOpen] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isPending,
    error,
    refetch,
    isRefetching,
  } = useEvents(debouncedQuery, type, isAttending);

  const allEvents = data?.pages.flatMap((page) => page?.events ?? []) ?? [];

  const handleReset = () => {
    setQuery('');
    setType('all');
  };

  const handleCreateEvent = () => {};

  const handleJoinEvent = (eventId: string) => {};

  const handleRegisterEvent = (eventId: string) => {};

  const handleViewAttendees = (eventId: string, eventTitle: string) => {
    setSelectedEventId(eventId);
    setSelectedEventTitle(eventTitle);
    setIsAttendeesDialogOpen(true);
  };

  if (error) {
    return (
      <div className="space-y-4">
        <EventsHeader
          onSearch={setQuery}
          onTypeChange={setType}
          onCreateEvent={handleCreateEvent}
          isSearching={isRefetching}
          searchValue={query}
          typeValue={type}
          isAttending={isAttending}
          onAttendingToggle={setIsAttending}
        />

        <ErrorState error={error} onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <EventsHeader
        onSearch={setQuery}
        onTypeChange={setType}
        onCreateEvent={handleCreateEvent}
        isSearching={isPending || isRefetching}
        searchValue={query}
        typeValue={type}
        isAttending={isAttending}
        onAttendingToggle={setIsAttending}
      />

      {(isLoading || isPending) && !data ? (
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : allEvents.length === 0 && !isLoading && !isPending ? (
        <EmptyState query={debouncedQuery} type={type} onReset={handleReset} />
      ) : allEvents.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
            {allEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onJoinEvent={handleJoinEvent}
                onRegisterEvent={handleRegisterEvent}
                onViewAttendees={handleViewAttendees}
                currentUserId={user?.userId}
              />
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="outline"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Loading More...
                  </>
                ) : (
                  'Load More Events'
                )}
              </Button>
            </div>
          )}

          {!hasNextPage && allEvents.length > 0 && (
            <div className="flex justify-center pt-4">
              <p className="text-muted-foreground text-sm">
                You've reached the end of the events list.
              </p>
            </div>
          )}
        </>
      ) : (
        <EmptyState query={debouncedQuery} type={type} onReset={handleReset} />
      )}

      {selectedEventId && (
        <AttendeesDialog
          eventId={selectedEventId}
          eventTitle={selectedEventTitle}
          isOpen={isAttendeesDialogOpen}
          onOpenChange={setIsAttendeesDialogOpen}
        />
      )}
    </div>
  );
}

export function EventsTabSkeleton() {
  return (
    <div className="space-y-2">
      <EventsHeaderSkeleton />
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <EventCardSkeleton />
        <EventCardSkeleton />
        <EventCardSkeleton />
      </div>
    </div>
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
    <Card className="flex h-full flex-col">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-12" />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

const AttendeeSkeleton = () => (
  <div className="flex items-center gap-3">
    <Skeleton className="h-10 w-10 rounded-full" />
    <Skeleton className="h-5 w-40" />
  </div>
);
