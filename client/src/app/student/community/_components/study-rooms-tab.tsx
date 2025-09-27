'use client';

import {
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronDownIcon,
  Clock,
  Copy,
  Download,
  Edit,
  Eye,
  FileSpreadsheet,
  FileText,
  Filter,
  Info,
  Loader,
  Lock,
  Mail,
  MessageCircle,
  MessageSquare,
  Monitor,
  MoreVertical,
  Plus,
  QrCode,
  RefreshCw,
  Search,
  Send,
  Share,
  Trash2,
  Twitter,
  Upload,
  User,
  UserPlus,
  Users,
  UserX,
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
  DialogDescription,
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  useInviteUsers,
  useSendBulkInvites,
  useSendEmailInvites,
  useUserSearch,
} from '../hooks';
import {
  useCategories,
  useCreateStudyRoom,
  useDeleteStudyRoom,
  useGenerateShareLink,
  useJoinStudyRoom,
  useScheduleReminder,
  useStudyRooms,
  useUpdateStudyRoom,
} from '../hooks/use-study-room';
import {
  emailInviteFormSchema,
  EmailInviteInput,
  ExpirationOption,
  SearchedUser,
} from '../schema';
import {
  createStudyRoomFormSchema,
  CreateStudyRoomInput,
  StudyRoom,
  updateStudyRoomFormSchema,
  UpdateStudyRoomInput,
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
  const [shareLink, setShareLink] = useState<string>('');
  const [linkExpiration, setLinkExpiration] =
    useState<ExpirationOption>('24hours');
  const [showQRCode, setShowQRCode] = useState(false);
  const [hasGeneratedLink, setHasGeneratedLink] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    mutateAsync: generateLink,
    isPending,
    isSuccess,
    data: linkData,
  } = useGenerateShareLink();

  useEffect(() => {
    if (!isOpen) {
      setShareLink('');
      setHasGeneratedLink(false);
      setShowQRCode(false);
      setIsGenerating(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isSuccess && linkData) {
      setShareLink(linkData.shareLink);
      setHasGeneratedLink(true);
      setIsGenerating(false);
    }
  }, [isSuccess, linkData]);

  const handleGenerateLink = useCallback(async () => {
    try {
      setIsGenerating(true);
      const result = await generateLink({
        roomId: room.id,
        expiresIn: linkExpiration,
      });

      if (result) {
        toast.success('Share link generated successfully!', {
          description:
            linkExpiration === 'never'
              ? 'This link will never expire'
              : `Link expires in ${getExpirationLabel(linkExpiration)}`,
        });
      }
    } catch (error) {
      setIsGenerating(false);
    }
  }, [room.id, linkExpiration, generateLink]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);

      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
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
      link.download = `${room.title.replace(/[^a-z0-9]/gi, '_')}-qr-code.png`;
      link.href = canvas.toDataURL();
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const getExpirationLabel = (expiration: ExpirationOption): string => {
    const labels = {
      '1hour': '1 hour',
      '24hours': '24 hours',
      '7days': '7 days',
      never: 'never',
    };
    return labels[expiration];
  };

  const regenerateLink = () => {
    setHasGeneratedLink(false);
    setShowQRCode(false);
    handleGenerateLink();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] min-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share className="h-5 w-5" />
            Share & Invite to "{room.title}"
          </DialogTitle>
          <DialogDescription>
            Generate a secure link to invite others to join your study room
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="share" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="share">Share Link</TabsTrigger>
            <TabsTrigger value="email">Email Invite</TabsTrigger>
            <TabsTrigger value="users">Invite Users</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Invite</TabsTrigger>
          </TabsList>

          <TabsContent value="share" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">
                    Create Share Link
                  </Label>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Choose when the link should expire and generate it
                  </p>
                </div>
                {hasGeneratedLink && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    Generated
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Select
                    value={linkExpiration}
                    onValueChange={(value) =>
                      setLinkExpiration(value as ExpirationOption)
                    }
                    disabled={isGenerating || isPending}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1hour">Expires in 1 hour</SelectItem>
                      <SelectItem value="24hours">
                        Expires in 24 hours
                      </SelectItem>
                      <SelectItem value="7days">Expires in 7 days</SelectItem>
                      <SelectItem value="never">Never expires</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={
                    hasGeneratedLink ? regenerateLink : handleGenerateLink
                  }
                  disabled={isGenerating || isPending}
                  className="min-w-[140px]"
                  size="default"
                >
                  {isGenerating || isPending ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : hasGeneratedLink ? (
                    <>Regenerate</>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Generate Link
                    </>
                  )}
                </Button>
              </div>
            </div>

            {hasGeneratedLink && shareLink && (
              <div className="space-y-4">
                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">
                      Your Share Link
                    </Label>
                    <Badge variant="outline" className="text-xs">
                      Expires: {getExpirationLabel(linkExpiration)}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={shareLink}
                      readOnly
                      className="font-mono text-sm"
                      onClick={() => copyToClipboard(shareLink)}
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
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-base font-medium">
                    Share on Social Media
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={() => shareToSocial('twitter')}
                          className=""
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
                          onClick={() => shareToSocial('whatsapp')}
                          className=""
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
                          onClick={() => shareToSocial('discord')}
                          className=""
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

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">QR Code</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowQRCode(!showQRCode)}
                      className=""
                    >
                      <QrCode className="h-4 w-4" />
                      {showQRCode ? 'Hide' : 'Show'} QR Code
                    </Button>
                  </div>

                  {showQRCode && (
                    <div className="bg-background flex flex-col items-center space-y-4 rounded-lg border p-6">
                      <div className="bg-muted/30 rounded-lg p-4">
                        <QRCodeSVG
                          id="qr-code-svg"
                          value={shareLink}
                          size={200}
                          level="M"
                          includeMargin
                        />
                      </div>
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

                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
                    <div className="text-muted-foreground text-sm">
                      <p className="mb-1 font-medium">Share Link Information</p>
                      <ul className="space-y-1">
                        <li>
                          • Anyone with this link can join your study room
                        </li>
                        <li>
                          • Link{' '}
                          {linkExpiration === 'never'
                            ? 'never expires'
                            : `expires in ${getExpirationLabel(linkExpiration)}`}
                        </li>
                        <li>
                          • You can regenerate the link anytime to invalidate
                          the old one
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!hasGeneratedLink && (
              <Card className="text-muted-foreground text-center">
                <CardContent>
                  <Share className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p className="mb-2 text-lg font-medium">
                    No link generated yet
                  </p>
                  <p className="text-sm">
                    Choose an expiration time and generate your share link to
                    get started
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <EmailInviteTab
              roomId={room.id}
              roomTitle={room.title}
              shareLink={shareLink}
            />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UserInviteTab roomId={room.id} />
          </TabsContent>

          <TabsContent value="bulk" className="mt-2 space-y-4">
            <BulkInviteTab
              roomId={room.id}
              roomTitle={room.title}
              shareLink={shareLink}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function EmailInviteTab({
  roomId,
  roomTitle,
  shareLink,
}: {
  roomId: string;
  roomTitle: string;
  shareLink: string;
}) {
  const [previewMode, setPreviewMode] = useState(false);
  const [emailCount, setEmailCount] = useState(0);
  const [isValidating, setIsValidating] = useState(false);

  const {
    mutate: sendInvites,
    isPending,
    isSuccess,
    data,
  } = useSendEmailInvites();

  const form = useForm<EmailInviteInput>({
    resolver: zodResolver(emailInviteFormSchema),
    defaultValues: {
      subject: `You're invited to join: ${roomTitle}`,
      message: `Hi there!\n\nYou've been invited to join a study session.\n\nRoom: ${roomTitle}\n\nClick the link above to join us!`,
      emails: '',
    },
  });

  const watchedEmails = form.watch('emails');
  const watchedSubject = form.watch('subject');
  const watchedMessage = form.watch('message');

  useEffect(() => {
    const emails = watchedEmails
      .split('\n')
      .map((email) => email.trim())
      .filter(Boolean);
    setEmailCount(emails.length);
  }, [watchedEmails]);

  const validateEmails = useCallback(
    async (emailText: string) => {
      if (!emailText.trim()) return;

      setIsValidating(true);
      const emails = emailText
        .split('\n')
        .map((email) => email.trim())
        .filter(Boolean);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const invalidEmails = emails.filter((email) => !emailRegex.test(email));

      if (invalidEmails.length > 0) {
        form.setError('emails', {
          message: `Invalid email(s): ${invalidEmails.slice(0, 3).join(', ')}${invalidEmails.length > 3 ? '...' : ''}`,
        });
      } else {
        form.clearErrors('emails');
      }
      setIsValidating(false);
    },
    [form]
  );

  const [debouncedValidateEmails] = useDebounce(validateEmails, 500);

  useEffect(() => {
    debouncedValidateEmails(watchedEmails);
  }, [watchedEmails, debouncedValidateEmails]);

  const onSubmit = (values: EmailInviteInput) => {
    const emails = values.emails
      .split('\n')
      .map((email) => email.trim())
      .filter(Boolean);

    if (emails.length === 0) {
      toast.error('Please enter at least one valid email address');
      return;
    }

    sendInvites(
      { ...values, linkUrl: shareLink },
      {
        onSuccess: (data) => {
          form.reset({
            subject: `You're invited to join: ${roomTitle}`,
            message: `Hi there!\n\nYou've been invited to join a study session.\n\nRoom: ${roomTitle}\n\nClick the link above to join us!`,
            emails: '',
          });
          setEmailCount(0);
        },
      }
    );
  };

  const handleAddTemplate = (templateType: 'casual' | 'formal' | 'urgent') => {
    const templates = {
      casual: {
        subject: `Join me for a study session: ${roomTitle}`,
        message: `Hey!\n\nI'm hosting a study session and thought you might want to join.\n\nTopic: ${roomTitle}\n\nHop in when you're free! 📚`,
      },
      formal: {
        subject: `Invitation to Study Session: ${roomTitle}`,
        message: `Dear Colleague,\n\nYou are cordially invited to participate in our upcoming study session.\n\nSession: ${roomTitle}\n\nWe look forward to your participation.\n\nBest regards`,
      },
      urgent: {
        subject: `🚨 Last chance to join: ${roomTitle}`,
        message: `Hi there!\n\nThis is a final reminder about our study session starting soon.\n\nTopic: ${roomTitle}\n\nJoin now before we begin! ⏰`,
      },
    };

    const template = templates[templateType];
    form.setValue('subject', template.subject);
    form.setValue('message', template.message);
    toast.success(
      `${templateType.charAt(0).toUpperCase() + templateType.slice(1)} template applied!`
    );
  };

  const previewContent = useMemo(() => {
    if (!previewMode) return null;

    return {
      subject: watchedSubject || 'No subject',
      message: watchedMessage.replace(/\n/g, '<br>') || 'No message',
      emailCount,
    };
  }, [previewMode, watchedSubject, watchedMessage, emailCount]);

  if (!shareLink) {
    return (
      <Card className="space-y-2">
        <CardContent className="py-8 text-center">
          <Mail className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
          <h3 className="text-muted-foreground mb-2 text-lg font-medium">
            Generate Share Link First
          </h3>
          <p className="text-muted-foreground text-sm">
            You need to generate a share link before sending email invitations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {isSuccess && data && (
        <Card className="animate-in slide-in-from-top-2 fade-in rounded-lg border border-green-200 bg-green-50 duration-300 dark:border-green-800 dark:bg-green-900/20">
          <CardContent className="flex flex-col items-center gap-1 text-green-800 dark:text-green-200">
            <CheckCircle className="h-5 w-5" />
            <div className="gap-0 text-center">
              <span className="font-medium">
                Invitations sent successfully!
              </span>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                {data.message}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Email Invitations</h3>
          <p className="text-muted-foreground text-sm">
            Send personalized invitations to multiple recipients
          </p>
        </div>

        <div className="flex items-center gap-2">
          {emailCount > 0 && (
            <Badge
              variant="secondary"
              className="animate-in zoom-in-50 duration-200"
            >
              {emailCount} {emailCount === 1 ? 'recipient' : 'recipients'}
            </Badge>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </div>

      {!previewMode ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Quick Templates</Label>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddTemplate('casual')}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  Casual
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddTemplate('formal')}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Formal
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddTemplate('urgent')}
                  className="flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  Urgent
                </Button>
              </div>
            </div>

            <Separator />

            <FormField
              control={form.control}
              name="emails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between">
                    <span>Email Addresses</span>
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      {isValidating && (
                        <div className="flex items-center gap-1">
                          <Loader className="h-3 w-3 animate-spin" />
                          Validating...
                        </div>
                      )}
                    </div>
                  </FormLabel>
                  <FormControl>
                    <ScrollArea className="h-[160px] w-full rounded-md border">
                      <Textarea
                        placeholder="Enter email addresses (one per line)&#10;john@example.com&#10;jane@example.com&#10;team@company.com"
                        className="min-h-[160px] resize-none border-0 font-mono text-sm focus-visible:ring-0"
                        {...field}
                      />
                    </ScrollArea>
                  </FormControl>

                  <FormDescription>
                    Enter one email address per line. We'll validate them
                    automatically.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Subject</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email subject..."
                      className="text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Body</FormLabel>
                  <FormControl>
                    <ScrollArea className="h-[200px] w-full rounded-md border">
                      <Textarea
                        className="min-h-[200px] resize-none border-0 focus-visible:ring-0"
                        placeholder="Write your invitation message..."
                        {...field}
                      />
                    </ScrollArea>
                  </FormControl>
                  <FormDescription>
                    The share link will be automatically included in the email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                <div className="text-sm">
                  <p className="mb-1 font-medium text-blue-900 dark:text-blue-100">
                    Email Preview Information
                  </p>
                  <ul className="space-y-1 text-blue-800 dark:text-blue-200">
                    <li>• Share link will be automatically inserted</li>
                    <li>
                      • Recipients will see your room title and invitation
                    </li>
                    <li>• Emails are sent individually (no CC/BCC)</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending || emailCount === 0 || isValidating}
              className="h-12 w-full"
            >
              {isPending ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Sending to {emailCount}{' '}
                  {emailCount === 1 ? 'recipient' : 'recipients'}...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send {emailCount > 0 ? `${emailCount} ` : ''}Email Invitation
                  {emailCount !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <div className="animate-in slide-in-from-right-4 fade-in space-y-6 duration-300">
          <div className="bg-muted/20 space-y-4 rounded-lg p-6">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm font-medium">
                Subject Line
              </Label>
              <div className="bg-background rounded-lg border p-3">
                <p className="font-medium">{previewContent?.subject}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm font-medium">
                Message Body
              </Label>
              <div className="bg-background min-h-[150px] rounded-lg border p-4">
                <div
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: previewContent?.message || 'No message',
                  }}
                />
                <div className="border-border mt-4 border-t pt-4">
                  <div className="rounded bg-blue-50 p-3 dark:bg-blue-900/20">
                    <p className="mb-2 text-sm font-medium text-blue-900 dark:text-blue-100">
                      🔗 Join the study session:
                    </p>
                    <div className="rounded border bg-white p-2 dark:bg-gray-800">
                      <code className="text-xs break-all text-blue-600 dark:text-blue-400">
                        {shareLink}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                Will be sent to {previewContent?.emailCount || 0} recipient
                {previewContent?.emailCount !== 1 ? 's' : ''}
              </div>
              <Badge variant="outline">Preview Mode</Badge>
            </div>
          </div>

          <Button
            onClick={() => setPreviewMode(false)}
            variant="outline"
            className="w-full"
          >
            <Edit className="h-4 w-4" />
            Edit Invitation
          </Button>
        </div>
      )}
    </div>
  );
}

function UserInviteTab({ roomId }: { roomId: string }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<SearchedUser[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const {
    data: searchResults,
    isFetching: isSearching,
    error: searchError,
    isError: isSearchError,
  } = useUserSearch(searchQuery);

  const {
    mutate: sendInvites,
    isPending: isSending,
    isSuccess: isSent,
    data: inviteData,
    error: inviteError,
  } = useInviteUsers();

  const [debouncedQuery] = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setHasSearched(true);
    } else {
      setHasSearched(false);
    }
  }, [debouncedQuery]);

  const addUser = (user: SearchedUser) => {
    if (!selectedUsers.find((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const removeUser = (userId: string) => {
    const user = selectedUsers.find((u) => u.id === userId);
    setSelectedUsers(selectedUsers.filter((u) => u.id !== userId));
  };

  const handleSendInvitations = () => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user to invite');
      return;
    }

    sendInvites(
      { roomId, userIds: selectedUsers.map((u) => u.id) },
      {
        onSuccess: () => {
          setSelectedUsers([]);
          setSearchQuery('');
          setHasSearched(false);
        },
      }
    );
  };

  const clearAllSelected = () => {
    setSelectedUsers([]);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    setHasSearched(false);
  };

  const SearchResultsSkeleton = () => (
    <div className="space-y-2">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse items-center justify-between rounded-md border p-3"
        >
          <div className="flex items-center gap-3">
            <div className="bg-muted h-8 w-8 rounded-full"></div>
            <div className="space-y-1">
              <div className="bg-muted h-4 w-24 rounded"></div>
              <div className="bg-muted h-3 w-32 rounded"></div>
            </div>
          </div>
          <div className="bg-muted h-8 w-16 rounded"></div>
        </div>
      ))}
    </div>
  );

  const EmptySearchState = () => (
    <div className="py-8 text-center">
      <Users className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
      <h3 className="text-muted-foreground mb-2 text-lg font-medium">
        Find users to invite
      </h3>
      <p className="text-muted-foreground text-sm">
        Search by name or email to find users and add them to your invitation
        list
      </p>
    </div>
  );

  const NoResultsState = () => (
    <div className="py-6 text-center">
      <UserX className="text-muted-foreground/50 mx-auto mb-3 h-10 w-10" />
      <p className="text-muted-foreground mb-1 font-medium">No users found</p>
      <p className="text-muted-foreground text-sm">
        Try searching with different keywords or check the spelling
      </p>
    </div>
  );

  const SearchErrorState = () => (
    <div className="py-6 text-center">
      <AlertCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
      <p className="mb-1 font-medium text-red-600 dark:text-red-400">
        Search failed
      </p>
      <p className="text-muted-foreground mb-3 text-sm">
        {searchError?.message || 'Unable to search users at the moment'}
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSearchQuery((prev) => prev + ' ')}
      >
        <RefreshCw className="mr-1 h-4 w-4" />
        Try Again
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {isSent && inviteData && (
        <div className="animate-in slide-in-from-top-2 fade-in rounded-lg border border-green-200 bg-green-50 p-4 duration-300 dark:border-green-800 dark:bg-green-900/20">
          <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Invitations sent successfully!</span>
          </div>
          <p className="mt-1 text-sm text-green-700 dark:text-green-300">
            {inviteData.message}
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Invite Users</h3>
            <p className="text-muted-foreground text-sm">
              Search and invite users directly to join your study room
            </p>
          </div>

          {selectedUsers.length > 0 && (
            <Badge
              variant="secondary"
              className="animate-in zoom-in-50 duration-200"
            >
              {selectedUsers.length} selected
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-base font-medium">Search Users</Label>
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              placeholder="Search by name or email (minimum 2 characters)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 pl-10"
            />

            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2 p-0"
                onClick={handleSearchClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            {isSearching && (
              <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
                <Loader className="text-primary h-4 w-4 animate-spin" />
              </div>
            )}
          </div>
          <p className="text-muted-foreground text-xs">
            Start typing to search for users. Results will appear as you type.
          </p>
        </div>

        {hasSearched && (
          <div className="space-y-2">
            <Label className="text-base font-medium">Search Results</Label>

            <ScrollArea className="h-[300px] w-full rounded-md border">
              <div className="p-4">
                {isSearching && <SearchResultsSkeleton />}

                {isSearching && isSearchError && <SearchErrorState />}

                {!isSearching &&
                  !isSearchError &&
                  searchResults &&
                  searchResults.length === 0 && <NoResultsState />}

                {!isSearching &&
                  !isSearchError &&
                  searchResults &&
                  searchResults.length > 0 && (
                    <div className="space-y-2">
                      {searchResults.map((user) => {
                        const isSelected = selectedUsers.some(
                          (u) => u.id === user.id
                        );
                        return (
                          <div
                            key={user.id}
                            className={`hover:bg-muted/50 flex items-center justify-between rounded-md p-3 transition-colors ${
                              isSelected
                                ? 'border border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                                : 'border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                                <User className="text-primary h-4 w-4" />
                              </div>

                              <div>
                                <p className="text-sm font-medium">
                                  {user.name}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  {user.email}
                                </p>
                              </div>
                            </div>

                            <Button
                              size="sm"
                              variant={isSelected ? 'default' : 'outline'}
                              onClick={() => addUser(user)}
                              disabled={isSelected}
                              className=""
                            >
                              {isSelected ? (
                                <>
                                  <Check className="h-4 w-4" />
                                  Added
                                </>
                              ) : (
                                <>
                                  <UserPlus className="h-4 w-4" />
                                  Add
                                </>
                              )}
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
              </div>
            </ScrollArea>
          </div>
        )}

        {!hasSearched && <EmptySearchState />}

        {selectedUsers.length > 0 && (
          <div className="animate-in slide-in-from-bottom-4 fade-in space-y-3 duration-300">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">
                Selected Users ({selectedUsers.length})
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllSelected}
                className="text-muted-foreground hover:text-destructive text-xs"
              >
                Clear All
              </Button>
            </div>

            <ScrollArea className="h-[120px] w-full">
              <div className="flex flex-wrap gap-2 p-1">
                {selectedUsers.map((user) => (
                  <Button
                    size="sm"
                    key={user.id}
                    variant="secondary"
                    className=""
                  >
                    <User className="h-3 w-3" />
                    <span>{user.name}</span>
                    <X
                      className="hover:text-destructive h-3 w-3 cursor-pointer transition-colors"
                      onClick={() => removeUser(user.id)}
                    />
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        <div className="space-y-4">
          {inviteError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Failed to send invitations</span>
              </div>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                {inviteError.message}
              </p>
            </div>
          )}

          <Button
            onClick={handleSendInvitations}
            disabled={isSending || selectedUsers.length === 0}
            className="w-full"
          >
            {isSending ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Sending invitations to {selectedUsers.length} user
                {selectedUsers.length !== 1 ? 's' : ''}...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Invitation{selectedUsers.length !== 1 ? 's' : ''}
                {selectedUsers.length > 0 && ` (${selectedUsers.length})`}
              </>
            )}
          </Button>

          {selectedUsers.length > 0 && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                <div className="text-sm">
                  <p className="mb-1 font-medium text-blue-900 dark:text-blue-100">
                    Invitation Details
                  </p>
                  <ul className="space-y-1 text-blue-800 dark:text-blue-200">
                    <li>• Selected users will receive direct invitations</li>
                    <li>
                      • They'll get a notification to join your study room
                    </li>
                    <li>
                      • Invitations are sent immediately after confirmation
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BulkInviteTab({
  roomId,
  roomTitle,
  shareLink,
}: {
  roomId: string;
  roomTitle: string;
  shareLink: string;
}) {
  const [csvData, setCsvData] = useState('');
  const [contacts, setContacts] = useState<{ name: string; email: string }[]>(
    []
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const {
    mutate: sendInvites,
    isPending,
    isSuccess,
    data: successData,
    error: inviteError,
  } = useSendBulkInvites();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setUploadError('Please upload a CSV file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setUploadError('File size should not exceed 5MB');
      return;
    }

    setIsProcessing(true);
    setUploadError('');
    setParseErrors([]);

    try {
      const text = await file.text();
      setCsvData(text);
      await parseContacts(text);
    } catch (error) {
      setUploadError('Failed to read file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const parseContacts = async (csvText: string) => {
    const lines = csvText.split('\n').filter((line) => line.trim());

    if (lines.length === 0) {
      setUploadError('CSV file is empty');
      return;
    }

    if (lines.length === 1) {
      setUploadError('CSV file should contain data rows, not just headers');
      return;
    }

    const errors: string[] = [];
    const validContacts: { name: string; email: string }[] = [];
    const duplicateEmails = new Set<string>();

    lines.slice(1).forEach((line, index) => {
      const lineNumber = index + 2;
      const columns = line
        .split(',')
        .map((item) => item.trim().replace(/"/g, ''));

      if (columns.length < 2) {
        errors.push(`Line ${lineNumber}: Missing name or email`);
        return;
      }

      const [name, email] = columns;

      if (!name) {
        errors.push(`Line ${lineNumber}: Name is required`);
        return;
      }

      if (!email) {
        errors.push(`Line ${lineNumber}: Email is required`);
        return;
      }

      if (!validateEmail(email)) {
        errors.push(`Line ${lineNumber}: Invalid email format (${email})`);
        return;
      }

      if (duplicateEmails.has(email.toLowerCase())) {
        errors.push(`Line ${lineNumber}: Duplicate email (${email})`);
        return;
      }

      duplicateEmails.add(email.toLowerCase());
      validContacts.push({ name, email });
    });

    setParseErrors(errors);
    setContacts(validContacts);

    if (validContacts.length === 0 && errors.length > 0) {
      setUploadError('No valid contacts found in CSV file');
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleSendBulkInvitations = () => {
    if (contacts.length === 0) {
      toast.error('Please upload a valid CSV file with contacts');
      return;
    }

    sendInvites(
      {
        contacts,
        subject: `You're invited to join: ${roomTitle}`,
        message: `Hi there!\n\nYou've been invited to join our study session for ${roomTitle}.\n\nWe look forward to seeing you there!`,
        linkUrl: shareLink,
      },
      {
        onSuccess: () => {
          setCsvData('');
          setContacts([]);
          setParseErrors([]);
          setUploadError('');
        },
      }
    );
  };

  const downloadTemplate = () => {
    const template =
      'Name,Email\n"John Doe","john@example.com"\n"Jane Smith","jane@example.com"\n"Alice Johnson","alice@company.com"';
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${roomTitle.replace(/[^a-z0-9]/gi, '_')}_contacts_template.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded successfully!');
  };

  const clearData = () => {
    setCsvData('');
    setContacts([]);
    setParseErrors([]);
    setUploadError('');
    const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
    toast.info('All data cleared');
  };

  if (!shareLink) {
    return (
      <div className="space-y-4">
        <Card className="p-6">
          <div className="py-8 text-center">
            <FileSpreadsheet className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
            <h3 className="text-muted-foreground mb-2 text-lg font-medium">
              Generate Share Link First
            </h3>
            <p className="text-muted-foreground text-sm">
              You need to generate a share link before sending bulk invitations.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isSuccess && successData && (
        <div className="animate-in slide-in-from-top-2 fade-in rounded-lg border border-green-200 bg-green-50 p-4 duration-300 dark:border-green-800 dark:bg-green-900/20">
          <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">
              Bulk invitations sent successfully!
            </span>
          </div>
          <p className="mt-1 text-sm text-green-700 dark:text-green-300">
            {successData.message}
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Bulk Email Invitations</h3>
            <p className="text-muted-foreground text-sm">
              Upload a CSV file with contacts to send multiple invitations at
              once
            </p>
          </div>

          {contacts.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="animate-in zoom-in-50 duration-200"
              >
                {contacts.length} contacts ready
              </Badge>
              <Button variant="ghost" size="sm" onClick={clearData}>
                <X className="mr-1 h-4 w-4" />
                Clear
              </Button>
            </div>
          )}
        </div>

        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Upload CSV File</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadTemplate}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Template
              </Button>
            </div>

            <div
              className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                dragOver
                  ? 'border-primary bg-primary/5'
                  : uploadError
                    ? 'border-red-300 bg-red-50 dark:bg-red-900/20'
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {isProcessing ? (
                <div className="flex flex-col items-center space-y-3">
                  <Loader className="text-primary h-8 w-8 animate-spin" />
                  <p className="text-sm font-medium">Processing CSV file...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-3">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Upload className="text-primary h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={handleFileInputChange}
                      className="hidden"
                      id="csv-upload"
                      disabled={isProcessing}
                    />
                    <Label
                      htmlFor="csv-upload"
                      className="text-primary cursor-pointer font-medium hover:underline"
                    >
                      Click to upload CSV file or drag and drop
                    </Label>
                    <p className="text-muted-foreground text-xs">
                      CSV should have Name and Email columns • Max file size:
                      5MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {uploadError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Upload Error</span>
                </div>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  {uploadError}
                </p>
              </div>
            )}
          </div>
        </Card>

        {parseErrors.length > 0 && (
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">
                  Parsing Warnings ({parseErrors.length})
                </span>
              </div>
              <ScrollArea className="h-32 w-full">
                <div className="space-y-1">
                  {parseErrors.map((error, index) => (
                    <p
                      key={index}
                      className="font-mono text-xs text-orange-700 dark:text-orange-300"
                    >
                      {error}
                    </p>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </Card>
        )}

        {contacts.length > 0 && (
          <Card className="animate-in slide-in-from-bottom-4 fade-in p-4 duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">
                  Valid Contacts ({contacts.length})
                </Label>
                <Badge variant="outline">{contacts.length} ready to send</Badge>
              </div>

              <ScrollArea className="h-48 w-full rounded-md border">
                <div className="space-y-2 p-4">
                  {contacts.map((contact, index) => (
                    <div
                      key={index}
                      className="hover:bg-muted/50 flex items-center justify-between rounded-md px-3 py-2 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                          <User className="text-primary h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{contact.name}</p>
                          <p className="text-muted-foreground text-xs">
                            {contact.email}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        #{index + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {contacts.length > 100 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Large batch detected ({contacts.length} contacts)
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                    Sending may take a few minutes. Please be patient.
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}

        {inviteError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Failed to send invitations</span>
            </div>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {inviteError.message}
            </p>
          </div>
        )}

        <div className="space-y-4">
          <Button
            onClick={handleSendBulkInvitations}
            disabled={isPending || contacts.length === 0 || isProcessing}
            className="h-12 w-full"
          >
            {isPending ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Sending to {contacts.length} contacts...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Bulk Invitations ({contacts.length})
              </>
            )}
          </Button>

          {contacts.length > 0 && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                <div className="text-sm">
                  <p className="mb-1 font-medium text-blue-900 dark:text-blue-100">
                    Bulk Invitation Details
                  </p>
                  <ul className="space-y-1 text-blue-800 dark:text-blue-200">
                    <li>
                      • {contacts.length} contacts will receive personalized
                      invitations
                    </li>
                    <li>
                      • Each email will include your room link automatically
                    </li>
                    <li>
                      • Invitations are sent individually to protect privacy
                    </li>
                    <li>
                      • You'll receive a confirmation once all emails are sent
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {csvData && (
          <Card className="p-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Raw CSV Preview</Label>
              <ScrollArea className="bg-muted/20 h-32 w-full rounded-md border">
                <pre className="p-4 font-mono text-xs whitespace-pre-wrap">
                  {csvData.slice(0, 1000)}
                  {csvData.length > 1000 && '\n... (truncated)'}
                </pre>
              </ScrollArea>
            </div>
          </Card>
        )}
      </div>
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
            <CardTitle className="min-w-0 truncate pr-2 text-lg">
              {room.title}
            </CardTitle>

            <CardDescription className="mt-2 flex items-center gap-2">
              {room.isLive ? (
                <Badge variant="destructive" className="animate-pulse">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
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

                  {isOwner && (
                    <>
                      <DropdownMenuItem
                        onClick={() => setIsEditDialogOpen(true)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="text-destructive focus:text-destructive flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardAction>
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
