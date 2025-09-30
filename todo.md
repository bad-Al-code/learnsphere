Okay so we what we hae right now:

- seraching. filtering, creating -> header
- edit, delete, view -> card
- register, unregister

What else we can add here?

- What about sowing user registerd evvent
- View Attendees (Modal):
  User Story: As an event host, I want to see who else is registered for an event.
  Implementation: Add an "Attendees" button or link on the EventCard. Clicking it will open a dialog (AttendeesDialog). This dialog will fetch and display a list of all registered users for that event from a new GET /api/community/events/:eventId/attendees endpoint.
- My Events Filter:
  User Story: As a user, I want to easily filter the list to see only the events I have registered for or am hosting.
  Implementation: Add a "My Events" toggle/checkbox to the EventsHeader. When active, the useEvents hook will refetch the list with a new query parameter (e.g., ?attending=true), which the backend will use to filter the results.
- Calendar Integration (Client-Side):
  User Story: As a user, I want to add an event I've registered for to my personal calendar.
  Implementation: After a user successfully registers for an event, the confirmation toast (or a button in the card footer) can include an "Add to Calendar" button. This will be a client-side feature that generates an .ics file or a Google Calendar link on the fly, requiring no backend changes.

- and what else?

BUG:

- it return live events agani when i press load more button even though i can see that same event above as well this is only happening to live events and it also return other dupliacted eets as well why is that? fix it
- currently all events are returned even though they are expired
