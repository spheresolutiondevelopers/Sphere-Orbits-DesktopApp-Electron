-- 006_add_chat.sql
CREATE TABLE user_connections (
  id TEXT PRIMARY KEY,
  requester_user_id TEXT NOT NULL,
  recipient_user_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending','accepted','declined','blocked')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (requester_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (recipient_user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(requester_user_id, recipient_user_id)
);

CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  type TEXT DEFAULT 'direct' CHECK(type IN ('direct','group')),
  name TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  CHECK(length(name) <= 255)
);

CREATE TABLE conversation_participants (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  joined_at TEXT DEFAULT (datetime('now')),
  left_at TEXT,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(conversation_id, user_id)
);

CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  sent_at TEXT DEFAULT (datetime('now')),
  is_read INTEGER DEFAULT 0,
  read_at TEXT,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_user_id) REFERENCES users(id) ON DELETE CASCADE,
  CHECK(length(content) <= 4000)
);