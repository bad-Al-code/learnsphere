'use client';

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { getEventsAction } from '../action';
import {
  checkRegistrationStatus,
  createEvent,
  deleteEvent,
  getEventAttendees,
  registerForEvent,
  unregisterFromEvent,
  updateEvent,
} from '../api/events.api.client';
import { RegistrationStatus, UpdateEventInput } from '../schema';

export const useEvents = (
  query?: string,
  type?: string,
  attending?: boolean
) => {
  return useInfiniteQuery({
    queryKey: ['events', query, type, attending],

    queryFn: async ({ pageParam }) => {
      const result = await getEventsAction({
        query,
        type,
        attending,
        cursor: pageParam,
      });
      if (result.error) throw new Error(result.error);

      return result.data;
    },

    initialPageParam: undefined as string | undefined,

    getNextPageParam: (lastPage) => lastPage?.nextCursor,
  });
};

export const useEventAttendees = (
  eventId: string,
  options: { enabled: boolean }
) => {
  return useQuery({
    queryKey: ['event-attendees', eventId],
    queryFn: () => getEventAttendees(eventId),
    enabled: options.enabled && !!eventId,
    retryOnMount: true,
    staleTime: 0,
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

export const useRegisterForEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => registerForEvent(eventId),

    onMutate: async (eventId) => {
      await queryClient.cancelQueries({
        queryKey: ['registration-status', eventId],
      });

      const previousStatus = queryClient.getQueryData<RegistrationStatus>([
        'registration-status',
        eventId,
      ]);

      queryClient.setQueryData<RegistrationStatus>(
        ['registration-status', eventId],
        (old) =>
          ({
            ...old,
            isRegistered: true,
            isFull: false,
          }) as RegistrationStatus
      );

      return { previousStatus };
    },

    onSuccess: (data, eventId) => {
      toast.success('Registration successful!', {
        description: data.message || 'You have been registered for the event.',
      });

      queryClient.setQueryData<RegistrationStatus>(
        ['registration-status', eventId],
        (old) => ({
          isRegistered: true,
          isHost: old?.isHost || false,
          isFull: false,
          currentAttendees: (old?.currentAttendees || 0) + 1,
          maxAttendees: old?.maxAttendees || 0,
        })
      );

      queryClient.invalidateQueries({
        queryKey: ['events'],
        refetchType: 'none',
      });

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['events'] });
        queryClient.invalidateQueries({ queryKey: ['my-events'] });
      }, 500);
    },

    onError: (error: any, eventId, context) => {
      if (context?.previousStatus) {
        queryClient.setQueryData(
          ['registration-status', eventId],
          context.previousStatus
        );
      }

      let errorMessage = 'Registration failed';
      let description = 'Please try again later.';

      if (error?.response?.data?.message) {
        description = error.response.data.message;
      } else if (error?.message) {
        description = error.message;
      }

      if (error?.response?.status === 409) {
        errorMessage = 'Already Registered';
        description = 'You are already registered for this event.';

        queryClient.setQueryData<RegistrationStatus>(
          ['registration-status', eventId],
          (old) =>
            ({
              ...old,
              isRegistered: true,
            }) as RegistrationStatus
        );
      } else if (error?.response?.status === 400) {
        errorMessage = 'Cannot Register';
        if (description.includes('full')) {
          description = 'This event is already full.';
        } else if (
          description.includes('started') ||
          description.includes('passed')
        ) {
          description = 'This event has already started or passed.';
        } else if (description.includes('closed')) {
          description = 'Registration for this event has closed.';
        }
      } else if (error?.response?.status === 404) {
        errorMessage = 'Event Not Found';
        description =
          'The event you are trying to register for does not exist.';
      }

      toast.error(errorMessage, { description });
    },
  });
};

export const useUnregisterFromEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => unregisterFromEvent(eventId),
    onSuccess: (data, eventId) => {
      toast.success('Unregistered successfully!', {
        description: data.message || 'You have been removed from the event.',
      });

      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({
        queryKey: ['registration-status', eventId],
      });
      queryClient.invalidateQueries({ queryKey: ['my-events'] });
    },
    onError: (error: any) => {
      let errorMessage = 'Unregistration failed';
      let description = 'Please try again later.';

      if (error?.response?.data?.message) {
        description = error.response.data.message;
      } else if (error?.message) {
        description = error.message;
      }

      if (error?.response?.status === 404) {
        errorMessage = 'Not Registered';
        description = 'You are not registered for this event.';
      } else if (error?.response?.status === 400) {
        errorMessage = 'Cannot Unregister';
        description = 'Cannot unregister from this event at this time.';
      }

      toast.error(errorMessage, { description });
    },
  });
};

export const useRegistrationStatus = (
  eventId: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['registration-status', eventId],
    queryFn: () => checkRegistrationStatus(eventId),
    enabled: enabled && !!eventId,
    staleTime: 30000,
    retry: 1,
  });
};
