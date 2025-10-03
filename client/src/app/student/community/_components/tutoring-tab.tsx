'use client';

import { faker } from '@faker-js/faker';
import {
  Book,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Download,
  Filter,
  Heart,
  LayoutGrid,
  List,
  MessageSquare,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Share2,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Video,
  X,
} from 'lucide-react';
import { useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { cn } from '@/lib/utils';

type TAvailability = 'now' | 'hours' | 'tomorrow' | 'unavailable';
type TViewLayout = 'grid' | 'list';
type TQueryState = 'loading' | 'error' | 'empty' | 'success' | 'refreshing';

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
  isFavorite?: boolean;
  upcomingSession?: {
    date: string;
    time: string;
  };
  responseTime?: string;
  languages?: string[];
};

type TBookingSession = {
  tutorId: string;
  date: string;
  time: string;
  duration: number;
  notes: string;
};

type TFilters = {
  search: string;
  subject: string;
  priceRange: string;
  availability: string;
  rating: string;
  sortBy: string;
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
    rate: faker.helpers.arrayElement([25, 30, 35, 40, 45, 50]),
    sessionLength: faker.helpers.arrayElement([30, 60, 90]),
    rating: faker.number.float({ min: 4.5, max: 5.0, fractionDigits: 1 }),
    reviews: faker.number.int({ min: 50, max: 250 }),
    tags: faker.helpers.arrayElements(
      [
        'React',
        'JavaScript',
        'TypeScript',
        'Frontend',
        'Backend',
        'Database',
        'SQL',
        'NoSQL',
        'UI/UX',
        'Figma',
        'Python',
        'Java',
        'C++',
        'Node.js',
        'DevOps',
      ],
      { min: 2, max: 4 }
    ),
    sessions: faker.number.int({ min: 100, max: 600 }),
    successRate: faker.number.int({ min: 88, max: 99 }),
    availability: faker.helpers.arrayElement([
      'now',
      'hours',
      'tomorrow',
      'unavailable',
    ]),
    isFavorite: faker.datatype.boolean(),
    upcomingSession: faker.datatype.boolean()
      ? {
          date: faker.date.future().toLocaleDateString(),
          time: faker.helpers.arrayElement(['10:00 AM', '2:00 PM', '4:00 PM']),
        }
      : undefined,
    responseTime: faker.helpers.arrayElement([
      '< 1 hour',
      '< 2 hours',
      '< 5 hours',
    ]),
    languages: faker.helpers.arrayElements(
      ['English', 'Spanish', 'French', 'German', 'Chinese'],
      {
        min: 1,
        max: 3,
      }
    ),
  };
};

function AIRecommendations({
  onSelectTutor,
}: {
  onSelectTutor: (tutorId: string) => void;
}) {
  const recommendations = Array.from({ length: 2 }, createTutor);

  return (
    <Alert className="">
      <Sparkles className="text-primary h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        AI-Powered Recommendations
        <Badge variant="secondary" className="text-xs">
          New
        </Badge>
      </AlertTitle>

      <AlertDescription className="w-full">
        <p className="mb-1 text-sm">
          Based on your learning history and goals, we recommend:
        </p>
        <div className="w-full space-y-2">
          {recommendations.map((tutor) => (
            <Card key={tutor.id}>
              <CardContent
                className="flex cursor-pointer items-center justify-between"
                onClick={() => onSelectTutor(tutor.id)}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {tutor.initials}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="text-sm font-medium">{tutor.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {tutor.tags[0]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    <span className="text-xs">{tutor.rating}</span>
                  </div>

                  <Button size="sm" variant="outline" className="">
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </AlertDescription>
    </Alert>
  );
}

function TutorCard({
  tutor,
  viewLayout,
  isSelected,
  onSelect,
  onToggleFavorite,
  onBook,
  onMessage,
  onDelete,
}: {
  tutor: TTutor;
  viewLayout: TViewLayout;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onBook: (tutor: TTutor) => void;
  onMessage: (tutor: TTutor) => void;
  onDelete: (id: string) => void;
}) {
  const availabilityConfig = {
    now: {
      text: 'Available now',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    hours: {
      text: 'Available in 2 hours',
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    tomorrow: {
      text: 'Available tomorrow',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    unavailable: {
      text: 'Unavailable',
      color: 'text-muted-foreground',
      bg: 'bg-muted',
    },
  };

  const config = availabilityConfig[tutor.availability];

  if (viewLayout === 'list') {
    return (
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="">
          <div className="flex items-center gap-4">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onSelect(tutor.id)}
            />

            <Avatar className="h-12 w-12">
              <AvatarFallback>{tutor.initials}</AvatarFallback>
            </Avatar>

            <div className="grid flex-1 grid-cols-1 items-center gap-4 md:grid-cols-5">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{tutor.name}</p>
                  {tutor.isFavorite && (
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  )}
                </div>
                <p className="text-muted-foreground text-sm">{tutor.title}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {tutor.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="text-sm font-medium">{tutor.rating}</span>
                <span className="text-muted-foreground text-sm">
                  ({tutor.reviews})
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold">${tutor.rate}/hr</p>
                <p className="text-muted-foreground text-xs">
                  {tutor.sessionLength} min sessions
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={cn('text-xs', config.color, config.bg)}
                >
                  {config.text}
                </Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onBook(tutor)}>
                  <Book className="h-4 w-4" />
                  Book Session
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onMessage(tutor)}>
                  <MessageSquare className="h-4 w-4" />
                  Send Message
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleFavorite(tutor.id)}>
                  <Heart className="h-4 w-4" />
                  {tutor.isFavorite ? 'Remove Favorite' : 'Add Favorite'}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4" />
                  Share Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete(tutor.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardContent className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onSelect(tutor.id)}
            />

            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-lg">
                {tutor.initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{tutor.name}</p>
                {tutor.isFavorite && (
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                )}
              </div>
              <p className="text-muted-foreground text-sm">{tutor.title}</p>
              <div className="mt-1 flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="text-sm font-medium">{tutor.rating}</span>
                <span className="text-muted-foreground text-sm">
                  ({tutor.reviews})
                </span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onBook(tutor)}>
                <Book className="h-4 w-4" />
                Book Session
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onMessage(tutor)}>
                <MessageSquare className="h-4 w-4" />
                Send Message
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleFavorite(tutor.id)}>
                <Heart className="h-4 w-4" />
                {tutor.isFavorite ? 'Remove Favorite' : 'Add Favorite'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="h-4 w-4" />
                Share Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(tutor.id)}
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="line-clamp-2 text-sm">{tutor.description}</p>

        <div className="text-muted-foreground flex items-center gap-3 text-sm">
          <span className="text-foreground font-semibold">
            ${tutor.rate}/hr
          </span>
          <span>•</span>
          <span>{tutor.sessionLength} min</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {tutor.responseTime}
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {tutor.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {tutor.upcomingSession && (
          <Alert className="border-primary/20 bg-primary/5">
            <Calendar className="text-primary h-4 w-4" />
            <AlertDescription className="text-xs">
              Upcoming: {tutor.upcomingSession.date} at{' '}
              {tutor.upcomingSession.time}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-3 gap-2 border-t pt-2 text-center">
          <div>
            <p className="text-sm font-bold">{tutor.sessions}</p>
            <p className="text-muted-foreground text-xs">Sessions</p>
          </div>
          <div>
            <p className="text-sm font-bold">{tutor.successRate}%</p>
            <p className="text-muted-foreground text-xs">Success</p>
          </div>
          <div>
            <Badge
              variant="secondary"
              className={cn('text-xs', config.color, config.bg)}
            >
              {config.text.split(' ')[0]}
            </Badge>
            <p className="text-muted-foreground mt-1 text-xs">Status</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-3">
        <Button onClick={() => onBook(tutor)} className="flex-1">
          <Book className="h-4 w-4" />
          Book
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={() => onMessage(tutor)}>
              <MessageSquare className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Message</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              onClick={() => onToggleFavorite(tutor.id)}
            >
              <Heart
                className={cn(
                  'h-4 w-4',
                  tutor.isFavorite && 'fill-red-500 text-red-500'
                )}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {tutor.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          </TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  );
}

function BookingDialog({
  tutor,
  open,
  onClose,
  onBook,
}: {
  tutor: TTutor | null;
  open: boolean;
  onClose: () => void;
  onBook: (booking: TBookingSession) => void;
}) {
  const [formData, setFormData] = useState<TBookingSession>({
    tutorId: tutor?.id || '',
    date: '',
    time: '',
    duration: 60,
    notes: '',
  });

  const handleSubmit = () => {
    onBook(formData);
    onClose();
  };

  if (!tutor) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book Session with {tutor.name}</DialogTitle>
          <DialogDescription>
            Schedule your learning session and add any specific topics you'd
            like to cover.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-muted flex items-center gap-3 rounded-lg p-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{tutor.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{tutor.name}</p>
              <p className="text-muted-foreground text-sm">{tutor.title}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">${tutor.rate}/hr</p>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                {tutor.rating}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Select
              value={formData.time}
              onValueChange={(value) =>
                setFormData({ ...formData, time: value })
              }
            >
              <SelectTrigger id="time">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="09:00">9:00 AM</SelectItem>
                <SelectItem value="10:00">10:00 AM</SelectItem>
                <SelectItem value="11:00">11:00 AM</SelectItem>
                <SelectItem value="14:00">2:00 PM</SelectItem>
                <SelectItem value="15:00">3:00 PM</SelectItem>
                <SelectItem value="16:00">4:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Select
              value={formData.duration.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, duration: parseInt(value) })
              }
            >
              <SelectTrigger id="duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">
                  30 minutes - ${tutor.rate / 2}
                </SelectItem>
                <SelectItem value="60">60 minutes - ${tutor.rate}</SelectItem>
                <SelectItem value="90">
                  90 minutes - ${tutor.rate * 1.5}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Session Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Topics you'd like to cover, specific questions, or goals for this session..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
            />
          </div>

          <Alert>
            <Video className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Session will be conducted via video call. You'll receive a meeting
              link after booking.
            </AlertDescription>
          </Alert>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Confirm Booking</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MessageDialog({
  tutor,
  open,
  onClose,
  onSend,
}: {
  tutor: TTutor | null;
  open: boolean;
  onClose: () => void;
  onSend: (message: string) => void;
}) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
      onClose();
    }
  };

  if (!tutor) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Message {tutor.name}</DialogTitle>
          <DialogDescription>
            Send a message to discuss your learning goals or ask questions.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="bg-muted flex items-center gap-3 rounded-lg p-3">
            <Avatar>
              <AvatarFallback>{tutor.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{tutor.name}</p>
              <p className="text-muted-foreground text-sm">{tutor.title}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSend}>
            <MessageSquare className="h-4 w-4" />
            Send Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FiltersBar({
  filters,
  onFilterChange,
  viewLayout,
  onViewLayoutChange,
}: {
  filters: TFilters;
  onFilterChange: (filters: TFilters) => void;
  viewLayout: TViewLayout;
  onViewLayoutChange: (layout: TViewLayout) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search tutors, subjects, or skills..."
            className="pl-9"
            value={filters.search}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
          />
        </div>

        <div className="flex justify-end gap-2">
          <Select
            value={filters.subject}
            onValueChange={(value) =>
              onFilterChange({ ...filters, subject: value })
            }
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <SelectTrigger className="w-auto">
                  <div className="lg:hidden">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div className="hidden lg:flex">
                    <SelectValue placeholder="Subject" />
                  </div>
                </SelectTrigger>
              </TooltipTrigger>
              <TooltipContent className="lg:hidden">Subject</TooltipContent>
            </Tooltip>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="programming">Programming</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="data">Data Science</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.priceRange}
            onValueChange={(value) =>
              onFilterChange({ ...filters, priceRange: value })
            }
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <SelectTrigger className="w-auto">
                  <div className="lg:hidden">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div className="hidden lg:flex">
                    <SelectValue placeholder="Price" />
                  </div>
                </SelectTrigger>
              </TooltipTrigger>
              <TooltipContent className="lg:hidden">Price Range</TooltipContent>
            </Tooltip>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="0-30">$0 - $30</SelectItem>
              <SelectItem value="30-50">$30 - $50</SelectItem>
              <SelectItem value="50+">$50+</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>More Filters</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-56">
              <div className="space-y-3 p-2">
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Availability</Label>
                  <Select
                    value={filters.availability}
                    onValueChange={(value) =>
                      onFilterChange({ ...filters, availability: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="now">Available Now</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium">Minimum Rating</Label>
                  <Select
                    value={filters.rating}
                    onValueChange={(value) =>
                      onFilterChange({ ...filters, rating: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      <SelectItem value="4.7">4.7+ Stars</SelectItem>
                      <SelectItem value="4.9">4.9+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium">Sort By</Label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) =>
                      onFilterChange({ ...filters, sortBy: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Relevance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="sessions">Most Sessions</SelectItem>
                      <SelectItem value="reviews">Most Reviews</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="hidden gap-1 border-l pl-2 lg:flex">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewLayout === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => onViewLayoutChange('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Grid View</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewLayout === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => onViewLayoutChange('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>List View</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  );
}

function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onBulkFavorite,
  onBulkDelete,
  onBulkExport,
}: {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkFavorite: () => void;
  onBulkDelete: () => void;
  onBulkExport: () => void;
}) {
  if (selectedCount === 0) return null;

  return (
    <Alert className="">
      <AlertTitle className="flex items-center justify-between">
        <div className="flex items-center justify-center space-x-2">
          <CheckCircle2 className="text-primary h-4 w-4" />
          <span>
            {selectedCount} tutor{selectedCount > 1 ? 's' : ''} selected
          </span>
        </div>

        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" onClick={onBulkFavorite}>
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Add to Favorites</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="sm:hidden">
              Add to Favorites
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" onClick={onBulkExport}>
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="sm:hidden">Export</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="outline" onClick={onBulkDelete}>
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Remove</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="sm:hidden">Remove</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="sm" variant="ghost" onClick={onClearSelection}>
                <X className="h-4 w-4" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="sm:hidden">Clear</TooltipContent>
          </Tooltip>
        </div>
      </AlertTitle>
    </Alert>
  );
}

function ProgressStats() {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
      <Card>
        <CardContent className="">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Sessions</p>
              <p className="text-2xl font-bold">24</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-emerald-500">
                <TrendingUp className="h-3 w-3" />
                +12% this month
              </p>
            </div>
            <Book className="text-muted-foreground h-8 w-8" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Hours Learned</p>
              <p className="text-2xl font-bold">36</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-emerald-500">
                <TrendingUp className="h-3 w-3" />
                +8 hrs this week
              </p>
            </div>
            <Clock className="text-muted-foreground h-8 w-8" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Favorite Tutors</p>
              <p className="text-2xl font-bold">8</p>
              <p className="text-muted-foreground mt-1 text-xs">
                3 active today
              </p>
            </div>
            <Heart className="text-muted-foreground h-8 w-8" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Learning Progress</p>
              <p className="text-2xl font-bold">78%</p>
              <Progress value={78} className="mt-2 h-1" />
            </div>
            <TrendingUp className="text-muted-foreground h-8 w-8" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="bg-muted mb-4 rounded-full p-6">
        <Search className="text-muted-foreground h-12 w-12" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">No tutors found</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        We couldn't find any tutors matching your criteria. Try adjusting your
        filters or search terms.
      </p>
      <Button onClick={onReset}>
        <RefreshCw className="h-4 w-4" />
        Reset Filters
      </Button>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Alert variant="destructive">
      <AlertTitle className="flex items-center justify-between">
        <span>Failed to load tutors</span>
        <Button size="sm" variant="outline" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </AlertTitle>
      <AlertDescription>
        There was an error loading the tutoring data. Please try again.
      </AlertDescription>
    </Alert>
  );
}

export function TutoringTab() {
  const [queryState, setQueryState] = useState<TQueryState>('loading');
  const [tutorsData, setTutorsData] = useState<TTutor[]>([]);
  const [viewLayout, setViewLayout] = useState<TViewLayout>('grid');
  const [selectedTutors, setSelectedTutors] = useState<string[]>([]);
  const [filters, setFilters] = useState<TFilters>({
    search: '',
    subject: 'all',
    priceRange: 'all',
    availability: 'all',
    rating: 'all',
    sortBy: 'relevance',
  });
  const [bookingTutor, setBookingTutor] = useState<TTutor | null>(null);
  const [messageTutor, setMessageTutor] = useState<TTutor | null>(null);
  const [showStats, setShowStats] = useState(true);

  useState(() => {
    setTimeout(() => {
      setTutorsData(Array.from({ length: 6 }, createTutor));
      setQueryState('success');
    }, 1500);
  });

  const handleRefresh = () => {
    setQueryState('refreshing');
    setTimeout(() => {
      setTutorsData(Array.from({ length: 6 }, createTutor));
      setQueryState('success');
    }, 1000);
  };

  const handleToggleFavorite = (id: string) => {
    setTutorsData((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isFavorite: !t.isFavorite } : t))
    );
  };

  const handleSelectTutor = (id: string) => {
    setSelectedTutors((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTutors.length === tutorsData.length) {
      setSelectedTutors([]);
    } else {
      setSelectedTutors(tutorsData.map((t) => t.id));
    }
  };

  const handleBulkFavorite = () => {
    setTutorsData((prev) =>
      prev.map((t) =>
        selectedTutors.includes(t.id) ? { ...t, isFavorite: true } : t
      )
    );
    setSelectedTutors([]);
  };

  const handleBulkDelete = () => {
    setTutorsData((prev) => prev.filter((t) => !selectedTutors.includes(t.id)));
    setSelectedTutors([]);
  };

  const handleBulkExport = () => {
    const exportData = tutorsData.filter((t) => selectedTutors.includes(t.id));
    console.log('Exporting:', exportData);
    alert(`Exported ${selectedTutors.length} tutors to CSV`);
  };

  const handleBook = (booking: TBookingSession) => {
    console.log('Booking:', booking);
    alert(
      'Session booked successfully! You will receive a confirmation email shortly.'
    );
  };

  const handleSendMessage = (message: string) => {
    console.log('Message:', message);
    alert('Message sent successfully!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this tutor?')) {
      setTutorsData((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      subject: 'all',
      priceRange: 'all',
      availability: 'all',
      rating: 'all',
      sortBy: 'relevance',
    });
  };

  const handleRetry = () => {
    setQueryState('loading');
    setTimeout(() => {
      setTutorsData(Array.from({ length: 6 }, createTutor));
      setQueryState('success');
    }, 1000);
  };

  const filteredTutors = tutorsData.filter((tutor) => {
    if (
      filters.search &&
      !tutor.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      !tutor.tags.some((tag) =>
        tag.toLowerCase().includes(filters.search.toLowerCase())
      )
    ) {
      return false;
    }
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange
        .split('-')
        .map((v) => v.replace('+', ''));
      if (max) {
        if (tutor.rate < parseInt(min) || tutor.rate > parseInt(max))
          return false;
      } else {
        if (tutor.rate < parseInt(min)) return false;
      }
    }
    if (filters.rating !== 'all' && tutor.rating < parseFloat(filters.rating)) {
      return false;
    }
    return true;
  });

  if (queryState === 'loading') {
    return <TutoringTabSkeleton />;
  }

  if (queryState === 'error') {
    return <ErrorState onRetry={handleRetry} />;
  }

  return (
    <div className="space-y-2">
      {showStats && (
        <div className="relative">
          <ProgressStats />
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => setShowStats(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <AIRecommendations
        onSelectTutor={(id) => {
          const tutor = tutorsData.find((t) => t.id === id);
          if (tutor) setBookingTutor(tutor);
        }}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={
              selectedTutors.length === tutorsData.length &&
              tutorsData.length > 0
            }
            onCheckedChange={handleSelectAll}
          />
          <span className="text-muted-foreground text-sm">
            {filteredTutors.length} tutor
            {filteredTutors.length !== 1 ? 's' : ''} found
          </span>
        </div>
        <div className="flex gap-2">
          {/* <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={queryState === 'refreshing'}
          >
            <RefreshCw
              className={cn(
                'h-4 w-4',
                queryState === 'refreshing' && 'animate-spin'
              )}
            />
          </Button> */}
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Become a Tutor
          </Button>
        </div>
      </div>

      <FiltersBar
        filters={filters}
        onFilterChange={setFilters}
        viewLayout={viewLayout}
        onViewLayoutChange={setViewLayout}
      />
      <BulkActionsBar
        selectedCount={selectedTutors.length}
        onClearSelection={() => setSelectedTutors([])}
        onBulkFavorite={handleBulkFavorite}
        onBulkDelete={handleBulkDelete}
        onBulkExport={handleBulkExport}
      />

      {filteredTutors.length === 0 ? (
        <EmptyState onReset={handleResetFilters} />
      ) : (
        <div
          className={cn(
            'gap-2',
            viewLayout === 'grid'
              ? 'grid grid-cols-1 lg:grid-cols-2'
              : 'flex flex-col'
          )}
        >
          {filteredTutors.map((tutor) => (
            <TutorCard
              key={tutor.id}
              tutor={tutor}
              viewLayout={viewLayout}
              isSelected={selectedTutors.includes(tutor.id)}
              onSelect={handleSelectTutor}
              onToggleFavorite={handleToggleFavorite}
              onBook={setBookingTutor}
              onMessage={setMessageTutor}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <BookingDialog
        tutor={bookingTutor}
        open={!!bookingTutor}
        onClose={() => setBookingTutor(null)}
        onBook={handleBook}
      />

      <MessageDialog
        tutor={messageTutor}
        open={!!messageTutor}
        onClose={() => setMessageTutor(null)}
        onSend={handleSendMessage}
      />
    </div>
  );
}

export function TutoringTabSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Skeleton className="h-12 w-full" />

      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-10" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <TutorCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function TutorCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-8 w-8" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </CardFooter>
    </Card>
  );
}
