import React from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useMeetings } from '../features/meetings/hooks/useMeetings';
import { MeetingCard } from '../features/meetings/components/MeetingCard';
import { MeetingFilter } from '../features/meetings/components/MeetingFilter';
import { Button } from '../components/ui/Button';

export function MeetingsPage() {
  const { user } = useAuth();
  const { meetings, isLoading } = useMeetings(user?.userID || '');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Meetings</h1>
          <p className="text-sm text-gray-400 mt-1">Join and manage your meetings</p>
        </div>
        <Button>+ Schedule Meeting</Button>
      </div>

      <MeetingFilter />

      {isLoading ? (
        <div className="text-gray-400">Loading meetings...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meetings?.map((meeting) => (
            <MeetingCard key={meeting.meetingID} meeting={meeting} />
          ))}
          {(!meetings || meetings.length === 0) && (
            <div className="col-span-2 text-gray-400 text-center py-8">No meetings scheduled</div>
          )}
        </div>
      )}
    </div>
  );
}