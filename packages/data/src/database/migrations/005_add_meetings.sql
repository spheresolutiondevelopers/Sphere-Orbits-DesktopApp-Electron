-- 005_add_meetings.sql
CREATE TABLE meetings (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL UNIQUE,
  organizer_user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_datetime TEXT NOT NULL,
  end_datetime TEXT NOT NULL,
  meeting_link TEXT,
  meeting_platform TEXT,
  is_recurring INTEGER DEFAULT 0,
  recurrence_pattern TEXT,
  status TEXT DEFAULT 'scheduled' CHECK(status IN ('scheduled','live','ended','cancelled')),
  is_deleted INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  FOREIGN KEY (organizer_user_id) REFERENCES users(id) ON DELETE RESTRICT,
  CHECK(start_datetime < end_datetime),
  CHECK(length(title) <= 255),
  CHECK(length(description) <= 4000),
  CHECK(length(meeting_link) <= 500),
  CHECK(length(meeting_platform) <= 50),
  CHECK(length(recurrence_pattern) <= 100)
);

CREATE TABLE meeting_participants (
  id TEXT PRIMARY KEY,
  meeting_id TEXT NOT NULL,
  user_id TEXT,
  email TEXT NOT NULL,
  full_name TEXT,
  invitation_status TEXT DEFAULT 'pending' CHECK(invitation_status IN ('pending','sent','accepted','declined','tentative')),
  participant_role TEXT DEFAULT 'attendee' CHECK(participant_role IN ('organizer','attendee','optional')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (meeting_id) REFERENCES meetings(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE(meeting_id, email),
  CHECK(length(email) <= 255),
  CHECK(length(full_name) <= 100)
);