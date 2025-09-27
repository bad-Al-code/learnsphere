'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  addMonths,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit3,
  MapPin,
  Trash2,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  attendees?: string[];
  type: 'study' | 'meeting' | 'personal' | 'work' | 'exam';
  color: string;
  allDay?: boolean;
}

interface EventFormData {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location: string;
  attendees: string;
  type: CalendarEvent['type'];
  allDay: boolean;
}

const initialEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'React Study Session',
    description: 'Deep dive into React hooks and state management',
    startTime: new Date(2024, 11, 15, 10, 0),
    endTime: new Date(2024, 11, 15, 12, 0),
    location: 'Online - Zoom Room',
    attendees: ['john@example.com', 'jane@example.com'],
    type: 'study',
    color: 'bg-blue-500',
  },
  {
    id: '2',
    title: 'Math Exam',
    description: 'Calculus final exam',
    startTime: new Date(2024, 11, 18, 9, 0),
    endTime: new Date(2024, 11, 18, 11, 0),
    location: 'Room 101',
    type: 'exam',
    color: 'bg-red-500',
  },
  {
    id: '3',
    title: 'Team Meeting',
    description: 'Weekly project sync',
    startTime: new Date(2024, 11, 16, 14, 0),
    endTime: new Date(2024, 11, 16, 15, 0),
    location: 'Conference Room A',
    attendees: ['team@company.com'],
    type: 'meeting',
    color: 'bg-green-500',
  },
  {
    id: '4',
    title: 'Workout',
    description: 'Morning gym session',
    startTime: new Date(2024, 11, 17, 7, 0),
    endTime: new Date(2024, 11, 17, 8, 30),
    type: 'personal',
    color: 'bg-purple-500',
  },
  {
    id: '5',
    title: 'All Day Conference',
    description: 'Tech conference 2024',
    startTime: startOfDay(new Date(2024, 11, 20)),
    endTime: endOfDay(new Date(2024, 11, 20)),
    location: 'Convention Center',
    type: 'work',
    color: 'bg-orange-500',
    allDay: true,
  },
  {
    id: '6',
    title: 'JavaScript Workshop',
    description: 'Advanced JS concepts and ES6+ features',
    startTime: new Date(2024, 11, 19, 13, 30),
    endTime: new Date(2024, 11, 19, 16, 30),
    location: 'Tech Hub Room 5',
    attendees: ['student1@edu.com', 'student2@edu.com', 'instructor@edu.com'],
    type: 'study',
    color: 'bg-blue-500',
  },
];

const eventTypeColors: Record<CalendarEvent['type'], string> = {
  study: 'bg-blue-500',
  meeting: 'bg-green-500',
  personal: 'bg-purple-500',
  work: 'bg-orange-500',
  exam: 'bg-red-500',
};

const eventTypeBadgeVariants: Record<
  CalendarEvent['type'],
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  study: 'default',
  meeting: 'secondary',
  personal: 'outline',
  work: 'default',
  exam: 'destructive',
};

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endDate: format(new Date(), 'yyyy-MM-dd'),
    endTime: '10:00',
    location: '',
    attendees: '',
    type: 'study',
    allDay: false,
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      if (event.allDay) {
        return isSameDay(event.startTime, date);
      }
      return isSameDay(event.startTime, date) || isSameDay(event.endTime, date);
    });
  };

  const openCreateEventModal = (date?: Date) => {
    const selectedDay = date || selectedDate || new Date();
    setFormData({
      title: '',
      description: '',
      startDate: format(selectedDay, 'yyyy-MM-dd'),
      startTime: '09:00',
      endDate: format(selectedDay, 'yyyy-MM-dd'),
      endTime: '10:00',
      location: '',
      attendees: '',
      type: 'study',
      allDay: false,
    });
    setSelectedEvent(null);
    setIsEditing(false);
    setIsEventModalOpen(true);
  };

  const openEditEventModal = (event: CalendarEvent) => {
    setFormData({
      title: event.title,
      description: event.description || '',
      startDate: format(event.startTime, 'yyyy-MM-dd'),
      startTime: format(event.startTime, 'HH:mm'),
      endDate: format(event.endTime, 'yyyy-MM-dd'),
      endTime: format(event.endTime, 'HH:mm'),
      location: event.location || '',
      attendees: event.attendees?.join(', ') || '',
      type: event.type,
      allDay: event.allDay || false,
    });
    setSelectedEvent(event);
    setIsEditing(true);
    setIsEventModalOpen(true);
  };

  const openViewEventModal = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEditing(false);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = () => {
    if (!formData.title.trim()) return;

    const startDateTime = formData.allDay
      ? startOfDay(new Date(formData.startDate))
      : new Date(`${formData.startDate}T${formData.startTime}`);

    const endDateTime = formData.allDay
      ? endOfDay(new Date(formData.endDate))
      : new Date(`${formData.endDate}T${formData.endTime}`);

    const eventData: CalendarEvent = {
      id: selectedEvent?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      startTime: startDateTime,
      endTime: endDateTime,
      location: formData.location,
      attendees: formData.attendees
        .split(',')
        .map((email) => email.trim())
        .filter(Boolean),
      type: formData.type,
      color: eventTypeColors[formData.type],
      allDay: formData.allDay,
    };

    if (isEditing && selectedEvent) {
      setEvents(
        events.map((event) =>
          event.id === selectedEvent.id ? eventData : event
        )
      );
    } else {
      setEvents([...events, eventData]);
    }

    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter((event) => event.id !== selectedEvent.id));
      setIsEventModalOpen(false);
      setSelectedEvent(null);
    }
  };

  const closeModal = () => {
    setIsEventModalOpen(false);
    setSelectedEvent(null);
    setIsEditing(false);
  };

  const EventBadge: React.FC<{
    event: CalendarEvent;
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  }> = ({ event, onClick }) => (
    <div
      className={`${event.color} mb-1 cursor-pointer truncate rounded px-2 py-1 text-xs text-white transition-opacity hover:opacity-80`}
      onClick={onClick}
    >
      {event.allDay
        ? event.title
        : `${format(event.startTime, 'HH:mm')} ${event.title}`}
    </div>
  );

  const EventDetails: React.FC<{ event: CalendarEvent }> = ({ event }) => (
    <div className="max-w-sm space-y-3">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <Badge
          variant={eventTypeBadgeVariants[event.type]}
          className="capitalize"
        >
          {event.type}
        </Badge>
      </div>

      {event.description && (
        <p className="text-muted-foreground text-sm">{event.description}</p>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          <span>
            {event.allDay
              ? 'All day'
              : `${format(event.startTime, 'MMM d, HH:mm')} - ${format(event.endTime, 'HH:mm')}`}
          </span>
        </div>

        {event.location && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4" />
            <span>{event.location}</span>
          </div>
        )}

        {event.attendees && event.attendees.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            <span>
              {event.attendees.length} attendee
              {event.attendees.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => openEditEventModal(event)}
        >
          <Edit3 className="mr-1 h-4 w-4" />
          Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleDeleteEvent}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="mr-1 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 p-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                <CalendarDays className="h-6 w-6" />
                {format(currentDate, 'MMMM yyyy')}
              </CardTitle>
              <div className="flex items-center space-x-1">
                <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={goToNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Select
                value={view}
                onValueChange={(value: 'month' | 'week' | 'day') =>
                  setView(value)
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={() => openCreateEventModal()}>Create</Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <span className="text-sm font-medium">Event Types:</span>
            {Object.entries(eventTypeColors).map(([type, color]) => (
              <div key={type} className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${color}`}></div>
                <span className="text-sm capitalize">{type}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-b">
            {[
              'Sunday',
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
            ].map((day) => (
              <div
                key={day}
                className="text-muted-foreground border-r p-3 text-center font-medium last:border-r-0"
              >
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.slice(0, 3)}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const dayEvents = getEventsForDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isDayToday = isToday(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);

              return (
                <div
                  key={index}
                  className={`hover:bg-muted/50 min-h-32 cursor-pointer border-r border-b p-2 transition-colors last:border-r-0 ${
                    !isCurrentMonth ? 'bg-muted/20 text-muted-foreground' : ''
                  } ${isSelected ? 'bg-primary/10' : ''}`}
                  onClick={() => {
                    setSelectedDate(day);
                    openCreateEventModal(day);
                  }}
                >
                  <div className="mb-1 flex items-start justify-between">
                    <span
                      className={`text-sm font-medium ${
                        isDayToday
                          ? 'bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs'
                          : ''
                      }`}
                    >
                      {format(day, 'd')}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <Tooltip key={event.id}>
                        <TooltipTrigger asChild>
                          <div>
                            <EventBadge
                              event={event}
                              onClick={(
                                e: React.MouseEvent<HTMLDivElement>
                              ) => {
                                e.stopPropagation();
                                openViewEventModal(event);
                              }}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="p-0">
                          <Card className="border-none shadow-lg">
                            <CardContent className="p-4">
                              <EventDetails event={event} />
                            </CardContent>
                          </Card>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-muted-foreground bg-muted/50 rounded px-2 py-1 text-xs">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CalendarDays className="text-muted-foreground h-4 w-4" />
              <div>
                <p className="text-2xl font-bold">{events.length}</p>
                <p className="text-muted-foreground text-xs">Total Events</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="text-muted-foreground h-4 w-4" />
              <div>
                <p className="text-2xl font-bold">
                  {
                    events.filter((e) => isSameMonth(e.startTime, currentDate))
                      .length
                  }
                </p>
                <p className="text-muted-foreground text-xs">This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="text-muted-foreground h-4 w-4" />
              <div>
                <p className="text-2xl font-bold">
                  {events.filter((e) => e.type === 'study').length}
                </p>
                <p className="text-muted-foreground text-xs">Study Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEventModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-h-[90vh] max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>
                {!isEditing && selectedEvent
                  ? 'Event Details'
                  : isEditing
                    ? 'Edit Event'
                    : 'Create Event'}
              </span>
              {selectedEvent && !isEditing && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteEvent}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-96">
            {!isEditing && selectedEvent ? (
              <div className="space-y-4 pr-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedEvent.title}
                  </h3>
                  <Badge
                    variant={eventTypeBadgeVariants[selectedEvent.type]}
                    className="mt-2 capitalize"
                  >
                    {selectedEvent.type}
                  </Badge>
                </div>

                {selectedEvent.description && (
                  <div>
                    <Label className="text-muted-foreground">Description</Label>
                    <p className="mt-1 text-sm">{selectedEvent.description}</p>
                  </div>
                )}

                <div>
                  <Label className="text-muted-foreground">Time</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      {selectedEvent.allDay
                        ? `All day on ${format(selectedEvent.startTime, 'MMM d, yyyy')}`
                        : `${format(selectedEvent.startTime, 'MMM d, yyyy HH:mm')} - ${format(selectedEvent.endTime, 'HH:mm')}`}
                    </span>
                  </div>
                </div>

                {selectedEvent.location && (
                  <div>
                    <Label className="text-muted-foreground">Location</Label>
                    <div className="mt-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{selectedEvent.location}</span>
                    </div>
                  </div>
                )}

                {selectedEvent.attendees &&
                  selectedEvent.attendees.length > 0 && (
                    <div>
                      <Label className="text-muted-foreground">Attendees</Label>
                      <div className="mt-1 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <div className="text-sm">
                          {selectedEvent.attendees.map((attendee, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="mr-1 mb-1"
                            >
                              {attendee}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <div className="space-y-4 pr-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Event title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Event description"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: CalendarEvent['type']) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="study">Study</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="allDay"
                    checked={formData.allDay}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, allDay: checked })
                    }
                  />
                  <Label htmlFor="allDay">All day</Label>
                </div>

                {!formData.allDay && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            startDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            startTime: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) =>
                          setFormData({ ...formData, endTime: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}

                {formData.allDay && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDateAllDay">Start Date</Label>
                      <Input
                        id="startDateAllDay"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            startDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDateAllDay">End Date</Label>
                      <Input
                        id="endDateAllDay"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Event location"
                  />
                </div>

                <div>
                  <Label htmlFor="attendees">Attendees</Label>
                  <Input
                    id="attendees"
                    value={formData.attendees}
                    onChange={(e) =>
                      setFormData({ ...formData, attendees: e.target.value })
                    }
                    placeholder="email1@example.com, email2@example.com"
                  />
                </div>
              </div>
            )}
          </ScrollArea>

          <DialogFooter>
            {!isEditing && selectedEvent ? (
              <Button onClick={closeModal} className="w-full">
                Close
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEvent}
                  disabled={!formData.title.trim()}
                >
                  {isEditing ? 'Update' : 'Create'} Event
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
