import React from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useAppointments } from '../features/appointments/hooks/useAppointments';
import { AppointmentCard } from '../features/appointments/components/AppointmentCard';
import { Button } from '../components/ui/Button';

export function AppointmentsPage() {
  const { user } = useAuth();
  const { appointments, isLoading } = useAppointments(user?.userID || '');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Appointments</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your appointments</p>
        </div>
        <Button>+ Book Appointment</Button>
      </div>

      {isLoading ? (
        <div className="text-gray-400">Loading appointments...</div>
      ) : (
        <div className="space-y-3">
          {appointments?.map((appt) => (
            <AppointmentCard key={appt.appointmentID} appointment={appt} />
          ))}
          {(!appointments || appointments.length === 0) && (
            <div className="text-gray-400 text-center py-8">No appointments scheduled</div>
          )}
        </div>
      )}
    </div>
  );
}