import React from 'react';
import { Event } from '@sphere/domain';
import { Button } from '../../../components/ui/Button';

interface EventDetailProps {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
}

export function EventDetail({ event, onEdit, onDelete }: EventDetailProps) {
  return (
    <div className="bg-sphere-panel rounded-xl p-6 border border-white/5">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white">{event.name}</h2>
          <span className={`text-sm px-2 py-0.5 rounded-full bg-${event.status === 'planned' ? 'yellow' : event.status === 'ongoing' ? 'green' : event.status === 'completed' ? 'gray' : 'red'}-400/20 text-${event.status === 'planned' ? 'yellow' : event.status === 'ongoing' ? 'green' : event.status === 'completed' ? 'gray' : 'red'}-400 mt-2 inline-block`}>
            {event.status}
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onEdit}>Edit</Button>
          <Button variant="danger" onClick={onDelete}>Delete</Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {event.format && (
          <div>
            <h4 className="text-sm font-medium text-gray-400">Format</h4>
            <p className="text-white">{event.format}</p>
          </div>
        )}
        {event.startDateTime && event.endDateTime && (
          <div>
            <h4 className="text-sm font-medium text-gray-400">Date & Time</h4>
            <p className="text-white">
              {new Date(event.startDateTime).toLocaleString()} – {new Date(event.endDateTime).toLocaleString()}
            </p>
          </div>
        )}
        {event.planningNotes && (
          <div className="col-span-2">
            <h4 className="text-sm font-medium text-gray-400">Planning Notes</h4>
            <p className="text-white whitespace-pre-wrap">{event.planningNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
}