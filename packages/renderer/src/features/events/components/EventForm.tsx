import React, { useState } from 'react';
import { Event } from '@sphere/domain';
import { Button } from '../../../components/ui/Button';

interface EventFormProps {
  initialValues?: Partial<Event>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function EventForm({ initialValues, onSubmit, onCancel }: EventFormProps) {
  const [form, setForm] = useState({
    name: initialValues?.name || '',
    format: initialValues?.format || '',
    planningNotes: initialValues?.planningNotes || '',
    startDateTime: initialValues?.startDateTime || '',
    endDateTime: initialValues?.endDateTime || '',
    status: initialValues?.status || 'planned',
    isRecurring: initialValues?.isRecurring || false,
    recurrencePattern: initialValues?.recurrencePattern || '',
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Event Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full bg-sphere-darker border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sphere-purple"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Start Date/Time</label>
          <input
            type="datetime-local"
            value={form.startDateTime}
            onChange={(e) => setForm({ ...form, startDateTime: e.target.value })}
            className="w-full bg-sphere-darker border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sphere-purple"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">End Date/Time</label>
          <input
            type="datetime-local"
            value={form.endDateTime}
            onChange={(e) => setForm({ ...form, endDateTime: e.target.value })}
            className="w-full bg-sphere-darker border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sphere-purple"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Format</label>
        <input
          type="text"
          value={form.format || ''}
          onChange={(e) => setForm({ ...form, format: e.target.value })}
          className="w-full bg-sphere-darker border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sphere-purple"
          placeholder="e.g., Virtual, In-Person, Hybrid"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Planning Notes</label>
        <textarea
          value={form.planningNotes || ''}
          onChange={(e) => setForm({ ...form, planningNotes: e.target.value })}
          className="w-full bg-sphere-darker border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sphere-purple"
          rows={4}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.isRecurring}
          onChange={(e) => setForm({ ...form, isRecurring: e.target.checked })}
          className="w-4 h-4 accent-sphere-purple"
        />
        <label className="text-sm text-gray-300">Recurring event</label>
      </div>

      {form.isRecurring && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Recurrence Pattern</label>
          <input
            type="text"
            value={form.recurrencePattern || ''}
            onChange={(e) => setForm({ ...form, recurrencePattern: e.target.value })}
            className="w-full bg-sphere-darker border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sphere-purple"
            placeholder="e.g., FREQ=WEEKLY;BYDAY=MO,WE,FR"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="w-full bg-sphere-darker border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sphere-purple"
        >
          <option value="planned">Planned</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit">Save</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}