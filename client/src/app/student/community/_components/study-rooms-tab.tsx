'use client';

import {
  AlertCircle,
  CheckCircle2,
  ChevronDownIcon,
  Clock,
  Copy,
  Download,
  Edit,
  ExternalLink,
  Filter,
  Loader,
  Lock,
  Mail,
  MessageCircle,
  Monitor,
  MoreVertical,
  Plus,
  QrCode,
  RefreshCw,
  Search,
  Share,
  Trash2,
  Twitter,
  Upload,
  User,
  UserPlus,
  Users,
  Video,
  Wifi,
  X,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useInView } from 'react-intersection-observer';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardAction,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSessionStore } from '@/stores/session-store';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  format,
  isBefore,
  isToday,
  parseISO,
  set,
  startOfToday,
} from 'date-fns';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import {
  useCategories,
  useCreateStudyRoom,
  useDeleteStudyRoom,
  useJoinStudyRoom,
  useScheduleReminder,
  useStudyRooms,
  useUpdateStudyRoom,
} from '../hooks/use-study-room';
import {
  CreateStudyRoomInput,
  StudyRoom,
  UpdateStudyRoomInput,
  createStudyRoomFormSchema,
  updateStudyRoomFormSchema,
} from '../schema/study-rooms.schema';

function StudyRoomsHeader({
  onSearch,
  onTopicChange,
  onCreateRoom,
}: {
  onSearch: (q: string) => void;
  onTopicChange: (t: string) => void;
  onCreateRoom: () => void;
}) {
  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCategories();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      onSearch(value);
    },
    [onSearch]
  );

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search study rooms..."
          className="pl-9"
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          disabled={isLoadingCategories}
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
                {categoriesError ? (
                  <SelectItem
                    value=""
                    disabled
                    className="text-destructive text-xs"
                  >
                    Failed to load categories
                  </SelectItem>
                ) : (
                  categories?.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </TooltipTrigger>
        <TooltipContent className="md:hidden">Filter by topic</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <div className="">
            <Button
              size="icon"
              className="md:hidden"
              onClick={onCreateRoom}
              disabled={isLoadingCategories}
            >
              <Plus className="h-4 w-4" />
            </Button>

            <Button
              className="hidden md:flex"
              disabled={isLoadingCategories}
              onClick={onCreateRoom}
            >
              <Plus className="h-4 w-4" />
              Create Room
            </Button>
          </div>
        </TooltipTrigger>

        <TooltipContent className="md:hidden">Create Room</TooltipContent>
      </Tooltip>
    </div>
  );
}

interface EditRoomDialogProps {
  room: StudyRoom;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditRoomDialog({
  room,
  isOpen,
  onOpenChange,
}: EditRoomDialogProps) {
  const {
    mutate: updateRoom,
    isPending,
    error,
    isError,
    reset,
  } = useUpdateStudyRoom();
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCategories();

  const form = useForm<UpdateStudyRoomInput>({
    resolver: zodResolver(
      updateStudyRoomFormSchema
    ) as Resolver<UpdateStudyRoomInput>,
    defaultValues: {
      title: room.title,
      description: room.subtitle || '',
      category: room.tags?.[0] || undefined,
      tags: room.tags?.join(', ') || '',
      maxParticipants: room.maxParticipants || 10,
      isPrivate: room.isPrivate,
    },
  });

  const onSubmit = (values: UpdateStudyRoomInput) => {
    updateRoom(
      { roomId: room.id, data: values },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Edit Study Room</DialogTitle>
        </DialogHeader>

        {categoriesError && (
          <div className="border-destructive/50 bg-destructive/10 rounded-md border p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-destructive h-4 w-4" />
              <p className="text-destructive text-sm">
                Unable to load categories. Some options may not be available.
              </p>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter room title" />
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
                    <Input {...field} placeholder="Enter description" />
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
                      value={field.value || undefined}
                      disabled={isLoadingCategories}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
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
                    <Input {...field} placeholder="e.g. React, TypeScript" />
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
                    <Input {...field} type="number" min={2} max={50} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPrivate"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-4">
                  <FormLabel className="mb-0">Private Room</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {isError && error && (
              <div className="border-destructive/50 bg-destructive/10 rounded-md border p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="text-destructive h-4 w-4" />
                  <p className="text-destructive text-sm">
                    {(error as Error).message || 'Failed to update room'}
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className=""
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="">
                {isPending ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteRoomDialogProps {
  roomId: string;
  roomTitle?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteRoomDialog({
  roomId,
  roomTitle = 'this room',
  isOpen,
  onOpenChange,
}: DeleteRoomDialogProps) {
  const {
    mutate: deleteRoom,
    isPending,
    error,
    isError,
    reset,
  } = useDeleteStudyRoom();

  const handleDelete = () => {
    deleteRoom(roomId, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertCircle className="text-destructive h-5 w-5" />
            Delete Room
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogDescription className="">
          Are you sure you want to delete <strong>{roomTitle}</strong>? This
          action cannot be undone.
          {isError && error && (
            <div className="border-destructive/50 bg-destructive/10 mt-2 rounded-md border p-2">
              <p className="text-destructive text-sm">
                {(error as Error).message || 'Failed to delete room'}
              </p>
            </div>
          )}
        </AlertDialogDescription>

        <AlertDialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mb-0.5 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface CreateRoomDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

function CreateRoomDialog({ isOpen, onOpenChange }: CreateRoomDialogProps) {
  const {
    mutate: createRoom,
    isPending,
    error,
    isError,
    reset,
  } = useCreateStudyRoom();
  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCategories();
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

  useEffect(() => {
    if (!isOpen) {
      reset();
      form.reset();
    }
  }, [isOpen, reset, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Study Room</DialogTitle>
        </DialogHeader>

        {categoriesError && (
          <div className="border-destructive/50 bg-destructive/10 rounded-md border p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-destructive h-4 w-4" />
              <p className="text-destructive text-sm">
                Unable to load categories. Please refresh and try again.
              </p>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
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
                  <FormLabel>Description *</FormLabel>
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
                  <FormLabel>Category *</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={
                        isLoadingCategories || isPending || !!categoriesError
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
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

            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="maxParticipants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Participants</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={2}
                        max={50}
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
                name="durationInMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={15}
                        max={480}
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      disabled={isPending}
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

            {isError && error && (
              <div className="border-destructive/50 bg-destructive/10 rounded-md border p-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="text-destructive h-4 w-4" />
                  <p className="text-destructive text-sm">
                    {(error as Error).message || 'Failed to create room'}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create Room
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface ShareInviteDialogProps {
  room: {
    id: string;
    title: string;
    subtitle: string | null;
    isPrivate: boolean;
  };
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}
type SharePlatform = 'twitter' | 'whatsapp' | 'discord';

function ShareInviteDialog({
  room,
  isOpen,
  onOpenChange,
}: ShareInviteDialogProps) {
  const [shareLink, setShareLink] = useState(
    `${window.location.origin}/room/${room.id}`
  );
  const [linkExpiration, setLinkExpiration] = useState('never');
  const [showQRCode, setShowQRCode] = useState(false);

  const generateShareLink = useCallback(() => {
    let link = `${window.location.origin}/room/${room.id}`;

    if (linkExpiration !== 'never') {
      const expiresAt = new Date();
      switch (linkExpiration) {
        case '1hour':
          expiresAt.setHours(expiresAt.getHours() + 1);
          break;
        case '24hours':
          expiresAt.setHours(expiresAt.getHours() + 24);
          break;
        case '7days':
          expiresAt.setDate(expiresAt.getDate() + 7);
          break;
      }
      link += `?expires=${expiresAt.getTime()}`;
    }

    setShareLink(link);
  }, [room.id, linkExpiration]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const shareToSocial = (platform: SharePlatform) => {
    const text = `Join me in this study session: ${room.title}`;
    const url = shareLink;

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
      discord: url,
    };

    if (platform === 'discord') {
      copyToClipboard(url);
      toast.success('Link copied! Paste it in Discord');
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const downloadQRCode = () => {
    const svg = document.querySelector('#qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const link = document.createElement('a');
      link.download = `${room.title}-qr-code.png`;
      link.href = canvas.toDataURL();
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share className="h-5 w-5" />
            Share & Invite to "{room.title}"
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="share" className="w-full">
          <TabsList className="mb-2 grid w-full grid-cols-4">
            <TabsTrigger value="share">Share Link</TabsTrigger>
            <TabsTrigger value="email">Email Invite</TabsTrigger>
            <TabsTrigger value="users">Invite Users</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Invite</TabsTrigger>
          </TabsList>

          <TabsContent value="share" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Link Expiration</Label>
                <Select
                  value={linkExpiration}
                  onValueChange={setLinkExpiration}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never expires</SelectItem>
                    <SelectItem value="1hour">1 hour</SelectItem>
                    <SelectItem value="24hours">24 hours</SelectItem>
                    <SelectItem value="7days">7 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Share Link</Label>
                <div className="flex gap-2">
                  <Input
                    value={shareLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => copyToClipboard(shareLink)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy link</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={generateShareLink}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Generate new link</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Share on Social Media</Label>
                <div className="flex gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => shareToSocial('twitter')}
                        className="flex items-center gap-2"
                      >
                        <Twitter className="h-4 w-4" />
                        Twitter
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share on Twitter</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => shareToSocial('whatsapp')}
                        className="flex items-center gap-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share on WhatsApp</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => shareToSocial('discord')}
                        className="flex items-center gap-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Discord
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy link for Discord</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>QR Code</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowQRCode(!showQRCode)}
                  >
                    <QrCode className="h-4 w-4" />
                    {showQRCode ? 'Hide' : 'Show'} QR Code
                  </Button>
                </div>

                {showQRCode && (
                  <div className="bg-background flex flex-col items-center space-y-3 rounded-lg border p-4">
                    <QRCodeSVG
                      id="qr-code-svg"
                      value={shareLink}
                      size={200}
                      level="M"
                      includeMargin
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadQRCode}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download QR Code
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <EmailInviteTab roomId={room.id} roomTitle={room.title} />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UserInviteTab roomId={room.id} />
          </TabsContent>

          <TabsContent value="bulk" className="space-y-4">
            <BulkInviteTab roomId={room.id} roomTitle={room.title} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function EmailInviteTab({
  roomId,
  roomTitle,
}: {
  roomId: string;
  roomTitle: string;
}) {
  const [emails, setEmails] = useState('');
  const [subject, setSubject] = useState(
    `You're invited to join: ${roomTitle}`
  );
  const [message, setMessage] = useState(
    `Hi there!\n\nYou've been invited to join a study session.\n\nRoom: ${roomTitle}\n\nClick the link above to join us!`
  );
  const [isSending, setIsSending] = useState(false);

  const handleSendInvites = async () => {
    const emailList = emails
      .split('\n')
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    if (emailList.length === 0) {
      toast.error('Please enter at least one email address');
      return;
    }

    setIsSending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success(`Invitations sent to ${emailList.length} recipients`);
      setEmails('');
    } catch (error) {
      toast.error('Failed to send invitations');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Email Addresses (one per line)</Label>
        <Textarea
          placeholder="john@example.com&#10;jane@example.com&#10;alex@example.com"
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          className="min-h-[100px] max-w-2xl font-mono text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label>Subject</Label>
        <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Message</Label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="min-h-[120px]"
        />
      </div>

      <Button
        onClick={handleSendInvites}
        disabled={isSending}
        className="w-full"
      >
        {isSending ? (
          <>
            <Mail className="h-4 w-4 animate-pulse" />
            Sending Invitations...
          </>
        ) : (
          <>
            <Mail className="h-4 w-4" />
            Send Email Invitations
          </>
        )}
      </Button>
    </div>
  );
}

function UserInviteTab({ roomId }: { roomId: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<
    Array<{ id: string; username: string; email: string }>
  >([]);
  const [searchResults, setSearchResults] = useState<
    Array<{ id: string; username: string; email: string }>
  >([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockResults = [
        { id: '1', username: 'john_doe', email: 'john@example.com' },
        { id: '2', username: 'jane_smith', email: 'jane@example.com' },
        { id: '3', username: 'alex_johnson', email: 'alex@example.com' },
      ].filter(
        (user) =>
          user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(mockResults);
    } catch (error) {
      toast.error('Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const addUser = (user: { id: string; username: string; email: string }) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const removeUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== userId));
  };

  const sendInvitations = async () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    setIsSending(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success(`Invitations sent to ${selectedUsers.length} users`);
      setSelectedUsers([]);
    } catch (error) {
      toast.error('Failed to send invitations');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Search Users</Label>
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            placeholder="Search by username or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            className="pl-10"
          />
          {isSearching && (
            <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
              <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          )}
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-2">
          <Label>Search Results</Label>
          <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border p-2">
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="hover:bg-muted flex items-center justify-between rounded-md p-2"
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <div>
                    <p className="text-sm font-medium">{user.username}</p>
                    <p className="text-muted-foreground text-xs">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addUser(user)}
                  disabled={selectedUsers.some((u) => u.id === user.id)}
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedUsers.length > 0 && (
        <div className="space-y-2">
          <Label>Selected Users ({selectedUsers.length})</Label>
          <div className="flex flex-wrap gap-2">
            {selectedUsers.map((user) => (
              <Badge
                key={user.id}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {user.username}
                <X
                  className="hover:text-destructive h-3 w-3 cursor-pointer"
                  onClick={() => removeUser(user.id)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={sendInvitations}
        disabled={isSending || selectedUsers.length === 0}
        className="w-full"
      >
        {isSending ? (
          <>
            <UserPlus className="h-4 w-4 animate-pulse" />
            Sending Invitations...
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4" />
            Send Invitations to {selectedUsers.length} Users
          </>
        )}
      </Button>
    </div>
  );
}

function BulkInviteTab({
  roomId,
  roomTitle,
}: {
  roomId: string;
  roomTitle: string;
}) {
  const [csvData, setCsvData] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [contacts, setContacts] = useState<
    Array<{ name: string; email: string }>
  >([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCsvData(text);
      parseContacts(text);
    };
    reader.readAsText(file);
  };

  const parseContacts = (csvText: string) => {
    const lines = csvText.split('\n').filter((line) => line.trim());
    const parsed = lines
      .slice(1)
      .map((line) => {
        const [name, email] = line.split(',').map((item) => item.trim());
        return { name: name || 'Unknown', email };
      })
      .filter((contact) => contact.email && contact.email.includes('@'));

    setContacts(parsed);
  };

  const sendBulkInvitations = async () => {
    if (contacts.length === 0) {
      toast.error('Please upload a valid CSV file with contacts');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      toast.success(`Bulk invitations sent to ${contacts.length} contacts`);
      setCsvData('');
      setContacts([]);
    } catch (error) {
      toast.error('Failed to send bulk invitations');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const template =
      'Name,Email\nJohn Doe,john@example.com\nJane Smith,jane@example.com';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contacts_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Upload Contacts (CSV)</Label>
        <div className="border-muted-foreground/25 rounded-lg border-2 border-dashed p-6 text-center">
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="text-muted-foreground mx-auto h-8 w-8" />
            <div>
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <Label
                htmlFor="csv-upload"
                className="text-primary cursor-pointer text-center hover:underline"
              >
                Click to upload CSV file
              </Label>
            </div>
            <p className="text-muted-foreground text-xs">
              CSV should have Name and Email columns
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={downloadTemplate}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download CSV Template
        </Button>
      </div>

      {contacts.length > 0 && (
        <div className="space-y-2">
          <Label>Parsed Contacts ({contacts.length})</Label>
          <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border p-2">
            {contacts.slice(0, 10).map((contact, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <span>{contact.name}</span>
                <span className="text-muted-foreground">{contact.email}</span>
              </div>
            ))}
            {contacts.length > 10 && (
              <p className="text-muted-foreground py-2 text-center text-xs">
                ... and {contacts.length - 10} more contacts
              </p>
            )}
          </div>
        </div>
      )}

      <Button
        onClick={sendBulkInvitations}
        disabled={isProcessing || contacts.length === 0}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Users className="h-4 w-4 animate-pulse" />
            Processing {contacts.length} Invitations...
          </>
        ) : (
          <>
            <Users className="h-4 w-4" />
            Send Bulk Invitations ({contacts.length})
          </>
        )}
      </Button>

      {csvData && (
        <div className="space-y-2">
          <Label>Raw CSV Data (Preview)</Label>
          <Textarea
            value={csvData.slice(0, 500) + (csvData.length > 500 ? '...' : '')}
            readOnly
            className="font-mono text-xs"
            rows={6}
          />
        </div>
      )}
    </div>
  );
}

function StudyRoomCard({ room }: { room: StudyRoom }) {
  const router = useRouter();
  const {
    mutate: joinRoom,
    isPending: isJoining,
    error: joinError,
  } = useJoinStudyRoom();
  const {
    mutate: schedule,
    isPending: isScheduling,
    error: scheduleError,
  } = useScheduleReminder();
  const { user } = useSessionStore();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const isOwner = user?.userId === room.hostId;
  const [actionError, setActionError] = useState<string | null>(null);

  const handleJoinClick = () => {
    setActionError(null);

    if (room.isLive) {
      joinRoom(room.id, {
        onSuccess: () => router.push(`/student/community/room/${room.id}`),
      });
    } else {
      schedule(room.id);
    }
  };

  const formattedTime = room.time
    ? format(parseISO(room.time), 'dd MMM yyyy, HH:mm a')
    : 'No time available';

  const participantPercentage = room.maxParticipants
    ? (room.participants / room.maxParticipants) * 100
    : 0;
  const isNearCapacity = participantPercentage >= 80;
  const isFull = room.participants >= (room.maxParticipants || 0);

  return (
    <Card className="flex flex-col transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate pr-2 text-lg">
              {room.title}
            </CardTitle>

            <CardDescription className="mt-2 flex items-center gap-2">
              {room.isLive ? (
                <Badge variant="destructive" className="animate-pulse">
                  <div className="mr-1 h-2 w-2 rounded-full bg-white"></div>
                  LIVE
                </Badge>
              ) : room.time ? (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs">{formattedTime}</span>
                </Badge>
              ) : null}

              {room.isPrivate && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Lock className="text-muted-foreground h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Private room - invitation required
                  </TooltipContent>
                </Tooltip>
              )}

              {isFull && (
                <Badge variant="secondary" className="text-xs">
                  Full
                </Badge>
              )}
            </CardDescription>
          </div>

          {isOwner && (
            <CardAction>
              <div className="flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setIsShareDialogOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <Share className="h-4 w-4" />
                      Share & Invite
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => setIsEditDialogOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>

                    <Separator className="m-1" />

                    <DropdownMenuItem
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="text-destructive focus:text-destructive flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardAction>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-2">
        {room.subtitle && (
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {room.subtitle}
          </p>
        )}

        <div className="flex items-center gap-1">
          <Users className="text-muted-foreground h-4 w-4" />
          <p className="text-sm font-medium">{room.host}</p>
        </div>

        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span
              className={`flex items-center gap-1 ${isNearCapacity ? 'text-orange-600 dark:text-orange-400' : 'text-muted-foreground'}`}
            >
              <Users className="h-3 w-3" />
              {room.participants}/{room.maxParticipants || '∞'}
            </span>

            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {room.duration}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Video className="text-muted-foreground h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>Video enabled</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Monitor className="text-muted-foreground h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>Screen sharing available</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {room.tags && room.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {room.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {room.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{room.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {room.progress > 0 && (
          <div className="space-y-1">
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span>Progress</span>
              <span>{room.progress}%</span>
            </div>
            <Progress value={room.progress} className="h-2" />
          </div>
        )}

        {(actionError || joinError || scheduleError) && (
          <div className="border-destructive/50 bg-destructive/10 rounded-md border p-2">
            <p className="text-destructive text-xs">
              {actionError ||
                joinError?.message ||
                scheduleError?.message ||
                'Something went wrong. Please try again.'}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="mt-auto">
        <Button
          className="w-full"
          variant={room.isLive ? 'default' : 'secondary'}
          onClick={handleJoinClick}
          disabled={isJoining || isScheduling || (isFull && !isOwner)}
        >
          {isJoining ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Joining...
            </>
          ) : isScheduling ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              Scheduling...
            </>
          ) : isFull && !isOwner ? (
            'Room Full'
          ) : room.isLive ? (
            <>
              <Video className="h-4 w-4" />
              Join Room
            </>
          ) : (
            <>
              <Clock className="h-4 w-4" />
              Schedule Reminder
            </>
          )}
        </Button>
      </CardFooter>

      <ShareInviteDialog
        room={{
          id: room.id,
          title: room.title,
          subtitle: room.subtitle,
          isPrivate: room.isPrivate,
        }}
        isOpen={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
      />

      {isOwner && (
        <EditRoomDialog
          room={room}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      )}

      {isOwner && (
        <DeleteRoomDialog
          roomId={room.id}
          roomTitle={room.title}
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        />
      )}
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

interface StudyRoomsPaginationErrorProps {
  onRetry?: () => void;
  error?: string | null;
  isRetrying?: boolean;
}

function StudyRoomsPaginationError({
  onRetry,
  error,
  isRetrying = false,
}: StudyRoomsPaginationErrorProps) {
  const isNetworkError =
    error?.toLowerCase().includes('network') ||
    error?.toLowerCase().includes('fetch') ||
    error?.toLowerCase().includes('connection') ||
    !navigator.onLine;

  return (
    <Card className="border-destructive/20 bg-destructive/5 mx-auto max-w-sm">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="bg-destructive/10 flex h-8 w-8 items-center justify-center rounded-full">
            {isNetworkError ? (
              <Wifi className="text-destructive h-4 w-4" />
            ) : (
              <AlertCircle className="text-destructive h-4 w-4" />
            )}
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium">
              {isNetworkError ? 'Connection issue' : 'Failed to load more'}
            </p>
            <p className="text-muted-foreground text-xs">
              {error || 'Something went wrong while loading more rooms'}
            </p>
          </div>
        </div>

        {onRetry && (
          <Button
            onClick={onRetry}
            size="sm"
            variant="outline"
            disabled={isRetrying}
            className=""
          >
            {isRetrying ? (
              <Loader className="h-3 w-3 animate-spin" />
            ) : (
              <RefreshCw className="h-3 w-3" />
            )}
            {isRetrying ? 'Loading...' : 'Retry'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function StudyRoomsTab() {
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState('all');
  const [debouncedQuery] = useDebounce(query, 500);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const {
    data: studyRoomsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useStudyRooms(debouncedQuery, topic);

  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '100px',
  });

  const handleRetry = useCallback(() => {
    setFetchError(null);
    refetch();
  }, [refetch]);

  const handleFetchNextPage = useCallback(async () => {
    try {
      setFetchError(null);

      await fetchNextPage();
    } catch (err) {
      setFetchError('Failed to load more rooms. Please try again.');
    }
  }, [fetchNextPage]);

  useEffect(() => {
    if (
      inView &&
      hasNextPage &&
      !isFetchingNextPage &&
      !fetchError &&
      !isRefetching
    ) {
      handleFetchNextPage();
    }
  }, [
    inView,
    hasNextPage,
    isFetchingNextPage,
    fetchError,
    isRefetching,
    handleFetchNextPage,
  ]);

  const allRooms = useMemo(
    () =>
      studyRoomsData?.pages.flatMap((page) => page?.rooms).filter(Boolean) ??
      [],
    [studyRoomsData]
  );

  useEffect(() => {
    setFetchError(null);
  }, [debouncedQuery, topic]);

  const hasResults = allRooms.length > 0;
  const showEmptyState = !isLoading && !isError && !hasResults;
  const showEndMessage =
    !hasNextPage && !isLoading && !fetchError && hasResults;

  return (
    <div className="space-y-2">
      <StudyRoomsHeader
        onSearch={setQuery}
        onTopicChange={setTopic}
        onCreateRoom={() => setIsCreateDialogOpen(true)}
      />

      {isError ? (
        <StudyRoomsError onRetry={handleRetry} error={error} />
      ) : (
        <>
          {isRefetching && !isLoading && (
            <div className="flex items-center justify-center py-2">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Loader className="h-4 w-4 animate-spin" />
                Refreshing...
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <StudyRoomCardSkeleton key={`initial-loading-${i}`} />
                ))
              : allRooms?.map((room) => (
                  <StudyRoomCard key={room?.id} room={room!} />
                ))}
          </div>

          {isFetchingNextPage && (
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <StudyRoomCardSkeleton key={`pagination-loading-${i}`} />
              ))}
            </div>
          )}

          {fetchError && (
            <div className="py-4">
              <StudyRoomsPaginationError
                onRetry={handleFetchNextPage}
                error={fetchError}
                isRetrying={isFetchingNextPage}
              />
            </div>
          )}

          {showEndMessage && (
            <div className="flex items-center justify-center py-6">
              <div className="space-y-2 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-green-600 dark:text-green-400" />
                <p className="text-muted-foreground text-sm">
                  You've seen all available rooms
                </p>
              </div>
            </div>
          )}

          {showEmptyState && (
            <Card className="">
              <CardContent className="space-y-2 text-center">
                <div className="bg-muted mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                  <Users className="text-muted-foreground h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold">
                  {query || topic !== 'all'
                    ? 'No rooms found'
                    : 'No study rooms yet'}
                </h3>

                <p className="text-muted-foreground text-center text-sm">
                  {query || topic !== 'all'
                    ? "Try adjusting your search terms or filters to find what you're looking for."
                    : 'Be the first to create a study room and start learning with others.'}
                </p>
                {!query && topic === 'all' && (
                  <Button
                    className="mt-4"
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                    Create First Room
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      <CreateRoomDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      <div ref={ref} className="h-1" />
    </div>
  );
}

export function StudyRoomsTabSkeleton() {
  return (
    <div className="space-y-4">
      <StudyRoomsHeaderSkeleton />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <StudyRoomCardSkeleton key={`skeleton-${i}`} />
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
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-4" />
          </div>
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-12" />
        </div>

        <Skeleton className="h-2 w-full" />
      </CardContent>

      <CardFooter>
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}
