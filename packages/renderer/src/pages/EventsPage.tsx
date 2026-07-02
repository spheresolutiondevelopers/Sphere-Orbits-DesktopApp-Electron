import React from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useEvents } from '../features/events/hooks/useEvents';
import { EventCard } from '../features/events/components/EventCard';
import { Button } from '../components/ui/Button';

export function EventsPage() {
  const { user } = useAuth();
  const { events, isLoading } = useEvents(user?.userID || '');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Events</h1>
          <p className="text-sm text-gray-400 mt-1">Plan and manage your events</p>
        </div>
        <Button>+ Create Event</Button>
      </div>

      {isLoading ? (
        <div className="text-gray-400">Loading events...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events?.map((event) => (
            <EventCard key={event.eventID} event={event} />
          ))}
          {(!events || events.length === 0) && (
            <div className="col-span-2 text-gray-400 text-center py-8">No events planned</div>
          )}
        </div>
      )}
    </div>
  );
}