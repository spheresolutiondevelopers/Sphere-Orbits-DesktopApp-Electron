import React from 'react';
import { Meeting } from '@sphere/domain';
import { useNavigate } from 'react-router-dom';
import { Video, Calendar, Clock, Users } from 'lucide-react';

interface MeetingCardProps {
  meeting: Meeting;
}

export function MeetingCard({ meeting }: MeetingCardProps) {
  const navigate = useNavigate();
  const statusColor = {
    scheduled: 'bg-yellow-400/20 text-yellow-400',
    live: 'bg-green-400/20 text-green-400 animate-pulse',
    ended: 'bg-gray-400/20 text-gray-400',
    cancelled: 'bg-red-400/20 text-red-400',
  }[meeting.status];

  return (
    <div
      onClick={() => navigate(`/meetings/${meeting.meetingID}`)}
      className="bg-sphere-panel rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-white">{meeting.title}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColor}`}>
          {meeting.status}
        </span>
      </div>

      {meeting.description && (
        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{meeting.description}</p>
      )}

      <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Calendar size={14} />
          {new Date(meeting.startDateTime).toLocaleDateString()}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={14} />
          {new Date(meeting.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} –
          {new Date(meeting.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        {meeting.meetingPlatform && (
          <span className="flex items-center gap-1">
            <Video size={14} />
            {meeting.meetingPlatform}
          </span>
        )}
      </div>

      {meeting.meetingLink && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(meeting.meetingLink!, '_blank');
            }}
            className="text-xs bg-sphere-purple/20 text-sphere-purple px-3 py-1 rounded-lg hover:bg-sphere-purple/30"
          >
            Join Meeting
          </button>
        </div>
      )}
    </div>
  );
}