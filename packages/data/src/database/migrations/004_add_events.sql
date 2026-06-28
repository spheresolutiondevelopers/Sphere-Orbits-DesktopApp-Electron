-- 004_add_events.sql
CREATE TABLE event_categories (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  category_name TEXT NOT NULL,
  icon TEXT,
  color_code TEXT DEFAULT '#7C6CF8',
  is_system INTEGER DEFAULT 0,
  is_deleted INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CHECK(length(category_name) <= 100),
  CHECK(length(icon) <= 50),
  CHECK(length(color_code) <= 7)
);

CREATE TABLE events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  category_id TEXT,
  task_id TEXT,
  name TEXT NOT NULL,
  format TEXT,
  planning_notes TEXT,
  start_datetime TEXT,
  end_datetime TEXT,
  status TEXT DEFAULT 'planned' CHECK(status IN ('planned','ongoing','completed','cancelled')),
  is_recurring INTEGER DEFAULT 0,
  recurrence_pattern TEXT,
  is_deleted INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES event_categories(id) ON DELETE SET NULL,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL,
  CHECK(length(name) <= 255),
  CHECK(length(format) <= 500),
  CHECK(length(recurrence_pattern) <= 100)
);

CREATE TABLE event_participants (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  user_id TEXT,
  email TEXT NOT NULL,
  full_name TEXT,
  invitation_status TEXT DEFAULT 'pending' CHECK(invitation_status IN ('pending','sent','accepted','declined','tentative')),
  participant_role TEXT DEFAULT 'attendee' CHECK(participant_role IN ('organizer','attendee','optional')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE(event_id, email),
  CHECK(length(email) <= 255),
  CHECK(length(full_name) <= 100)
);