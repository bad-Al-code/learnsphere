'use client';

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { getEventsAction } from '../action';
import {
  createEvent,
  deleteEvent,
  updateEvent,
} from '../api/events.api.client';
import { UpdateEventInput } from '../schema';

export const useEvents = (query?: string, type?: string) => {
  return useInfiniteQuery({
    queryKey: ['events', query, type],

    queryFn: async ({ pageParam }) => {
      const result = await getEventsAction({ query, type, cursor: pageParam });
      if (result.error) throw new Error(result.error);

      return result.data;
    },

    initialPageParam: undefined as string | undefined,

    getNextPageParam: (lastPage) => lastPage?.nextCursor,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvent,

    onSuccess: (newEvent, variables) => {
      const eventTitle = newEvent?.title || variables?.title || 'Your event';

      toast.success('Event created successfully!', {
        description: `"${eventTitle}" has been scheduled.`,
      });

      queryClient.invalidateQueries({ queryKey: ['events'] });
    },

    onError: (error: any) => {
      let errorMessage = 'Failed to create event';
      let description = 'Please try again later.';

      if (error?.response?.data?.message) {
        description = error.response.data.message;
      } else if (error?.message) {
        description = error.message;
      }

      if (error?.response?.status === 409) {
        errorMessage = 'Duplicate Event';
        description =
          'You already have an event with this title at the same date and time.';
      } else if (error?.response?.status === 400) {
        errorMessage = 'Invalid Event Data';
      } else if (error?.response?.status === 401) {
        errorMessage = 'Authentication Required';
        description = 'Please log in to create an event.';
      } else if (error?.response?.status >= 500) {
        errorMessage = 'Server Error';
        description = 'Our servers are having issues. Please try again later.';
      }

      toast.error(errorMessage, { description });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      data,
    }: {
      eventId: string;
      data: UpdateEventInput;
    }) => updateEvent(eventId, data),

    onSuccess: (updatedEvent) => {
      toast.success('Event updated successfully!', {
        description: `"${updatedEvent.title}" has been updated.`,
      });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },

    onError: (error: any) => {
      let errorMessage = 'Failed to update event';
      let description = 'Please try again later.';

      if (error?.response?.data?.message) {
        description = error.response.data.message;
      } else if (error?.message) {
        description = error.message;
      }

      if (error?.response?.status === 403) {
        errorMessage = 'Permission Denied';
        description = 'You can only update events that you created.';
      } else if (error?.response?.status === 404) {
        errorMessage = 'Event Not Found';
        description = 'The event you are trying to update does not exist.';
      } else if (error?.response?.status === 409) {
        errorMessage = 'Duplicate Event';
        description =
          'An event with this title already exists at the same date and time.';
      }

      toast.error(errorMessage, { description });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => deleteEvent(eventId),

    onSuccess: () => {
      toast.success('Event deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },

    onError: (error: any) => {
      let errorMessage = 'Failed to delete event';
      let description = 'Please try again later.';

      if (error?.response?.data?.message) {
        description = error.response.data.message;
      } else if (error?.message) {
        description = error.message;
      }

      if (error?.response?.status === 403) {
        errorMessage = 'Permission Denied';
        description = 'You can only delete events that you created.';
      } else if (error?.response?.status === 404) {
        errorMessage = 'Event Not Found';
        description = 'The event you are trying to delete does not exist.';
      } else if (error?.response?.status === 400) {
        errorMessage = 'Cannot Delete Event';
        description =
          'This event cannot be deleted as it has active attendees.';
      }

      toast.error(errorMessage, { description });
    },
  });
};
