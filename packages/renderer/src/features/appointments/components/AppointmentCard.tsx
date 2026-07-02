import React from 'react';
import { Appointment } from '@sphere/domain';

interface AppointmentCardProps {
  appointment: Appointment;
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const statusColor = {
    scheduled: 'bg-yellow-400/20 text-yellow-400',
    confirmed: 'bg-green-400/20 text-green-400',
    cancelled: 'bg-red-400/20 text-red-400',
    completed: 'bg-gray-400/20 text-gray-400',
    rescheduled: 'bg-blue-400/20 text-blue-400',
  }[appointment.status];

  return (
    <div className="bg-sphere-panel rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-white">{appointment.title}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor}`}>
          {appointment.status}
        </span>
      </div>

      {appointment.description && (
        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{appointment.description}</p>
      )}

      <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-400">
        <span>
          {new Date(appointment.startDateTime).toLocaleDateString()} at{' '}
          {new Date(appointment.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        <span>–</span>
        <span>
          {new Date(appointment.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        {appointment.location && <span>📍 {appointment.location}</span>}
        {appointment.isVirtual && <span>🔗 Virtual</span>}
      </div>

      {appointment.meetingLink && (
        <button
          onClick={() => window.open(appointment.meetingLink!, '_blank')}
          className="mt-2 text-xs bg-sphere-purple/20 text-sphere-purple px-3 py-1 rounded-lg hover:bg-sphere-purple/30"
        >
          Join Meeting
        </button>
      )}
    </div>
  );
}