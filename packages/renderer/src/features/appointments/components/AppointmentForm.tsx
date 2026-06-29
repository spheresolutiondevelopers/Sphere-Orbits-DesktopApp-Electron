import React, { useState } from 'react';
import { Appointment } from '@sphere/domain';
import { Button } from '../../../components/ui/Button';

interface AppointmentFormProps {
  initialValues?: Partial<Appointment>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function AppointmentForm({ initialValues, onSubmit, onCancel }: AppointmentFormProps) {
  const [form, setForm] = useState({
    title: initialValues?.title || '',
    description: initialValues?.description || '',
    startDateTime: initialValues?.startDateTime || '',
    endDateTime: initialValues?.endDateTime || '',
    location: initialValues?.location || '',
    isVirtual: initialValues?.isVirtual || false,
    appointmentType: initialValues?.appointmentType || 'general',
    status: initialValues?.status || 'scheduled',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full bg-sphere-darker border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sphere-purple"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Start Date/Time *</label>
          <input
            type="datetime-local"
            value={form.startDateTime}
            onChange={(e) => setForm({ ...form, startDateTime: e.target.value })}
            className="w-full bg-sphere-darker border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sphere-purple"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">End Date/Time *</label>
          <input
            type="datetime-local"
            value={form.endDateTime}
            onChange={(e) => setForm({ ...form, endDateTime: e.target.value })}
            className="w-full bg-sphere-darker border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sphere-purple"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
        <input
          type="text"
          value={form.location || ''}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="w-full bg-sphere-darker border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sphere-purple"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.isVirtual}
          onChange={(e) => setForm({ ...form, isVirtual: e.target.checked })}
          className="w-4 h-4 accent-sphere-purple"
        />
        <label className="text-sm text-gray-300">Virtual appointment</label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
        <select
          value={form.appointmentType}
          onChange={(e) => setForm({ ...form, appointmentType: e.target.value })}
          className="w-full bg-sphere-darker border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sphere-purple"
        >
          <option value="general">General</option>
          <option value="doctor">Doctor</option>
          <option value="business">Business</option>
          <option value="personal">Personal</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
        <textarea
          value={form.description || ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full bg-sphere-darker border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sphere-purple"
          rows={3}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit">Save</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}