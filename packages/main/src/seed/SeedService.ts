import crypto from 'node:crypto';
import { DatabaseClient } from '@sphere/data';

function generateId(): string {
  return crypto.randomUUID();
}

function hashPassword(password: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function hoursFromNow(hours: number): string {
  const d = new Date();
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

function todayAt(hour: number, minute = 0): string {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

const DEFAULT_PASSWORD = 'sphere123';

export class SeedService {
  constructor(private readonly db: DatabaseClient) {}

  /**
   * Seeds the database if no users exist yet.
   * Idempotent — safe to call on every app start.
   */
  seed(): void {
    try {
      const count = (
        this.db.prepare('SELECT COUNT(*) as c FROM users WHERE is_deleted = 0').get() as any
      ).c;

      if (count > 0) return; // already seeded

      console.log('[SeedService] Seeding database with initial data...');
      this._seed();
      console.log('[SeedService] Seed complete.');
    } catch (err) {
      console.error('[SeedService] Seed error:', err);
    }
  }

  private _seed(): void {
    const now = new Date().toISOString();

    // ── 1. Users ──────────────────────────────────────────────────────────
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashPassword(DEFAULT_PASSWORD, salt);

    const userId = generateId();
    const userId2 = generateId();
    const userId3 = generateId();
    const userId4 = generateId();

    const insertUser = this.db.prepare(`
      INSERT INTO users
        (id, email, username, display_name, first_name, last_name,
         password_hash, password_salt, account_type, is_active, is_deleted,
         created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, ?, ?)
    `);

    // Main (auto-created) user
    insertUser.run(
      userId, 'alex@sphere.app', 'alex_orbits', 'Alex Sphere',
      'Alex', 'Sphere', hash, salt, 'premium', now, now
    );

    // Team members (no password needed — they're contacts only)
    const salt2 = crypto.randomBytes(16).toString('hex');
    insertUser.run(
      userId2, 'sarah@sphere.app', 'sarah_design', 'Sarah Chen',
      'Sarah', 'Chen', hashPassword('sphere123', salt2), salt2, 'free', now, now
    );

    const salt3 = crypto.randomBytes(16).toString('hex');
    insertUser.run(
      userId3, 'marcus@sphere.app', 'marcus_dev', 'Marcus Wright',
      'Marcus', 'Wright', hashPassword('sphere123', salt3), salt3, 'free', now, now
    );

    const salt4 = crypto.randomBytes(16).toString('hex');
    insertUser.run(
      userId4, 'priya@sphere.app', 'priya_pm', 'Priya Patel',
      'Priya', 'Patel', hashPassword('sphere123', salt4), salt4, 'premium', now, now
    );

    // ── 2. Categories ─────────────────────────────────────────────────────
    const catWork = generateId();
    const catPersonal = generateId();
    const catMeeting = generateId();

    const insertCat = this.db.prepare(`
      INSERT INTO categories
        (id, user_id, category_name, category_type, color_code, icon_name, category_order, is_default, created_at, updated_at)
      VALUES (?, ?, ?, 'custom', ?, ?, ?, ?, ?, ?)
    `);
    insertCat.run(catWork, userId, 'Work', '#7C6CF8', 'briefcase', 0, 1, now, now);
    insertCat.run(catPersonal, userId, 'Personal', '#06B6D4', 'user', 1, 0, now, now);
    insertCat.run(catMeeting, userId, 'Meetings', '#F472B6', 'video', 2, 0, now, now);

    // ── 3. Tasks ──────────────────────────────────────────────────────────
    const insertTask = this.db.prepare(`
      INSERT INTO tasks
        (id, user_id, title, description, task_type, priority_level, status,
         completion_percentage, due_date, due_time, category_id, tags,
         is_deleted, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
    `);

    const taskIds = Array.from({ length: 8 }, () => generateId());

    insertTask.run(taskIds[0], userId, 'Q4 Product Roadmap Review',
      'Review and finalize the product roadmap for Q4 with all stakeholders.',
      'general', 'critical', 'in_progress', 40,
      daysFromNow(1).split('T')[0], '14:00', catWork, 'roadmap,planning', now, now);

    insertTask.run(taskIds[1], userId, 'Design System Audit',
      'Audit the current design system and identify components to refactor.',
      'general', 'high', 'pending', 0,
      daysFromNow(3).split('T')[0], '10:00', catWork, 'design,ux', now, now);

    insertTask.run(taskIds[2], userId, 'Sprint Retrospective Notes',
      'Compile and distribute sprint retrospective action items to the team.',
      'general', 'medium', 'in_progress', 70,
      new Date().toISOString().split('T')[0], '17:00', catMeeting, 'sprint,agile', now, now);

    insertTask.run(taskIds[3], userId, 'Update API Documentation',
      'Refresh the API docs with the latest endpoint changes from last sprint.',
      'general', 'medium', 'pending', 0,
      daysFromNow(5).split('T')[0], '12:00', catWork, 'api,docs', now, now);

    insertTask.run(taskIds[4], userId, 'Prepare Investor Presentation',
      'Build slides for the upcoming Series B investor pitch.',
      'deadline', 'critical', 'pending', 20,
      daysFromNow(7).split('T')[0], '09:00', catWork, 'presentation,investors', now, now);

    insertTask.run(taskIds[5], userId, 'Gym – Strength Training',
      'Upper body workout session at the gym.',
      'general', 'low', 'pending', 0,
      new Date().toISOString().split('T')[0], '07:00', catPersonal, 'health,fitness', now, now);

    insertTask.run(taskIds[6], userId, 'Book Team Dinner',
      'Reserve a restaurant for the team celebration dinner.',
      'general', 'low', 'completed', 100,
      daysFromNow(-1).split('T')[0], '18:00', catPersonal, 'team,social', now, now);

    insertTask.run(taskIds[7], userId, 'Code Review – Auth Module',
      'Review PR #247: offline authentication refactor.',
      'general', 'high', 'in_progress', 50,
      new Date().toISOString().split('T')[0], '16:00', catWork, 'code,review', now, now);

    // ── 4. Meetings (requires task_id UNIQUE) ─────────────────────────────
    const mtgTaskId1 = generateId();
    const mtgTaskId2 = generateId();
    const mtgTaskId3 = generateId();

    const insertMtgTask = this.db.prepare(`
      INSERT INTO tasks
        (id, user_id, title, task_type, priority_level, status,
         due_date, due_time, is_deleted, created_at, updated_at)
      VALUES (?, ?, ?, 'meeting', 'medium', 'pending', ?, ?, 0, ?, ?)
    `);
    insertMtgTask.run(mtgTaskId1, userId, 'Weekly Sync - Stand-up',
      new Date().toISOString().split('T')[0], '09:00', now, now);
    insertMtgTask.run(mtgTaskId2, userId, 'Product Design Review',
      daysFromNow(1).split('T')[0], '14:00', now, now);
    insertMtgTask.run(mtgTaskId3, userId, 'Client Onboarding Call',
      daysFromNow(2).split('T')[0], '11:00', now, now);

    const mtgId1 = generateId();
    const mtgId2 = generateId();
    const mtgId3 = generateId();

    const insertMeeting = this.db.prepare(`
      INSERT INTO meetings
        (id, task_id, organizer_user_id, title, description,
         start_datetime, end_datetime, meeting_platform, status,
         is_deleted, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
    `);
    insertMeeting.run(
      mtgId1, mtgTaskId1, userId,
      'Weekly Sync – Stand-up',
      'Daily stand-up to align on priorities and blockers.',
      todayAt(9), todayAt(9, 30), 'Google Meet', 'scheduled', now, now
    );
    insertMeeting.run(
      mtgId2, mtgTaskId2, userId,
      'Product Design Review',
      'Review wireframes and prototype for the new onboarding flow.',
      hoursFromNow(26), hoursFromNow(27, 5), 'Zoom', 'scheduled', now, now
    );
    insertMeeting.run(
      mtgId3, mtgTaskId3, userId,
      'Client Onboarding Call',
      'Walkthrough of the Sphere platform for new enterprise client.',
      hoursFromNow(50), hoursFromNow(51), 'Microsoft Teams', 'scheduled', now, now
    );

    // ── 5. Appointments ───────────────────────────────────────────────────
    const apptId1 = generateId();
    const apptId2 = generateId();
    const apptId3 = generateId();

    const insertAppt = this.db.prepare(`
      INSERT INTO appointments
        (id, user_id, title, description, appointment_type,
         start_datetime, end_datetime, location, status,
         is_deleted, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
    `);
    insertAppt.run(
      apptId1, userId,
      'Annual Health Check-up',
      'Routine annual health examination with Dr. Nguyen.',
      'doctor',
      todayAt(11), todayAt(12),
      'City Medical Center, Floor 3', 'confirmed', now, now
    );
    insertAppt.run(
      apptId2, userId,
      'Performance Review – Sarah',
      'Quarterly performance review with Sarah Chen.',
      'business',
      hoursFromNow(4), hoursFromNow(5),
      'Conference Room B', 'scheduled', now, now
    );
    insertAppt.run(
      apptId3, userId,
      'Dentist Appointment',
      'Bi-annual dental cleaning and check-up.',
      'doctor',
      daysFromNow(4) + 'T09:00:00.000Z',
      daysFromNow(4) + 'T10:00:00.000Z',
      'Bright Smile Dental Clinic', 'scheduled', now, now
    );

    // ── 6. Events ─────────────────────────────────────────────────────────
    const evtCatId = generateId();
    this.db.prepare(`
      INSERT INTO event_categories (id, user_id, category_name, color_code, is_system, created_at, updated_at)
      VALUES (?, ?, 'Conference', '#7C6CF8', 0, ?, ?)
    `).run(evtCatId, userId, now, now);

    const evtId1 = generateId();
    const evtId2 = generateId();
    const evtId3 = generateId();
    const evtId4 = generateId();

    const insertEvt = this.db.prepare(`
      INSERT INTO events
        (id, user_id, category_id, name, format, planning_notes,
         start_datetime, end_datetime, status, is_deleted, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
    `);
    insertEvt.run(evtId1, userId, evtCatId, 'Tech Summit 2026',
      'Annual technology conference with keynotes and workshops.',
      'Register by next week. Book hotel.',
      daysFromNow(14), daysFromNow(16), 'planned', now, now);

    insertEvt.run(evtId2, userId, evtCatId, 'Team Off-site Retreat',
      '2-day team building and strategic planning retreat.',
      'Book transport and accommodation.',
      daysFromNow(21), daysFromNow(22), 'planned', now, now);

    insertEvt.run(evtId3, userId, evtCatId, 'Product Launch – Sphere 2.0',
      'Public launch event for Sphere Orbits v2.0.',
      'Prepare demo, press kit and social media posts.',
      daysFromNow(30), daysFromNow(30), 'planned', now, now);

    insertEvt.run(evtId4, userId, evtCatId, 'Hackathon – Build Weekend',
      '48-hour hackathon focused on AI-powered productivity tools.',
      'Team of 4. Register Sarah, Marcus, Priya.',
      daysFromNow(10), daysFromNow(11), 'planned', now, now);

    // ── 7. Notes ──────────────────────────────────────────────────────────
    const noteId1 = generateId();
    const noteId2 = generateId();
    const noteId3 = generateId();
    const noteId4 = generateId();

    const insertNote = this.db.prepare(`
      INSERT INTO notes
        (id, user_id, title, content, is_pinned, tags, is_deleted, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)
    `);
    insertNote.run(noteId1, userId,
      'Q4 Goals & OKRs',
      '## Objectives\n- Launch Sphere 2.0 by November\n- Reach 10k active users\n- Close Series B funding round\n\n## Key Results\n- 40% increase in DAU\n- NPS score > 60\n- Feature parity with competitor X',
      1, 'goals,okr,q4', now, now);

    insertNote.run(noteId2, userId,
      'Meeting Notes – Investor Call',
      'Key points discussed:\n- Traction metrics impressed the partners\n- Next step: detailed financial model by EOW\n- Follow-up call scheduled for Thursday\n\nAction items:\n- Prepare 3-year projection\n- Send product demo video',
      0, 'meeting,investors,notes', now, now);

    insertNote.run(noteId3, userId,
      'Ideas – Sphere AI Features',
      '### AI Feature Brainstorm\n- Smart task prioritization using ML\n- Natural language task creation ("Add call with John tomorrow at 3pm")\n- Automated meeting summaries\n- Predictive scheduling based on habits\n- Focus mode with AI-suggested time blocks',
      1, 'ideas,ai,product', now, now);

    insertNote.run(noteId4, userId,
      'Reading List',
      '## Books to Read\n- [ ] Atomic Habits – James Clear\n- [x] The Mom Test – Rob Fitzpatrick\n- [ ] Shape Up – Ryan Singer\n- [ ] Zero to One – Peter Thiel\n\n## Articles\n- Notion blog post on async work\n- HBR: "The 5 Stages of Remote Teams"',
      0, 'reading,personal', now, now);

    // ── 8. Chat ───────────────────────────────────────────────────────────
    const convId = generateId();
    this.db.prepare(`
      INSERT INTO conversations (id, type, name, created_at, updated_at)
      VALUES (?, 'group', 'Sphere Team', ?, ?)
    `).run(convId, now, now);

    const insertCpId = () => generateId();
    this.db.prepare(`
      INSERT INTO conversation_participants (id, conversation_id, user_id, joined_at)
      VALUES (?, ?, ?, ?)
    `).run(insertCpId(), convId, userId, now);
    this.db.prepare(`
      INSERT INTO conversation_participants (id, conversation_id, user_id, joined_at)
      VALUES (?, ?, ?, ?)
    `).run(insertCpId(), convId, userId2, now);
    this.db.prepare(`
      INSERT INTO conversation_participants (id, conversation_id, user_id, joined_at)
      VALUES (?, ?, ?, ?)
    `).run(insertCpId(), convId, userId3, now);
    this.db.prepare(`
      INSERT INTO conversation_participants (id, conversation_id, user_id, joined_at)
      VALUES (?, ?, ?, ?)
    `).run(insertCpId(), convId, userId4, now);

    const insertMsg = this.db.prepare(`
      INSERT INTO messages (id, conversation_id, sender_user_id, content, sent_at, is_read)
      VALUES (?, ?, ?, ?, ?, 1)
    `);

    const msgBase = new Date();
    const msgAt = (minsAgo: number) => {
      const d = new Date(msgBase);
      d.setMinutes(d.getMinutes() - minsAgo);
      return d.toISOString();
    };

    insertMsg.run(generateId(), convId, userId2,
      'Hey team! Just finished the new onboarding wireframes 🎨', msgAt(45));
    insertMsg.run(generateId(), convId, userId3,
      'Awesome! Can you share the Figma link?', msgAt(40));
    insertMsg.run(generateId(), convId, userId2,
      'https://figma.com/... (link) — let me know your thoughts!', msgAt(38));
    insertMsg.run(generateId(), convId, userId4,
      'Looks great Sarah! I love the progress indicator on step 2.', msgAt(30));
    insertMsg.run(generateId(), convId, userId,
      'This is exactly what we needed. Let\'s review in today\'s stand-up 🚀', msgAt(5));

    // ── 9. Settings ───────────────────────────────────────────────────────
    this.db.prepare(`
      INSERT OR IGNORE INTO user_settings
        (user_id, theme, notifications_enabled, push_notifications, email_notifications,
         google_calendar_sync, outlook_calendar_sync, apple_calendar_sync,
         language, timezone, default_view, compact_mode, reminder_default_minutes,
         share_usage_data, preferences, updated_at)
      VALUES (?, 'dark', 1, 1, 1, 0, 0, 0, 'en', 'UTC', 'week', 0, 15, 1, '{}', ?)
    `).run(userId, now);

    // ── 10. App flags ──────────────────────────────────────────────────────
    this.db.prepare(`
      INSERT OR IGNORE INTO app_flags (key, value, updated_at)
      VALUES ('onboarding_completed', 'false', ?)
    `).run(now);

    this.db.prepare(`
      INSERT OR IGNORE INTO app_flags (key, value, updated_at)
      VALUES ('default_user_id', ?, ?)
    `).run(userId, now);

    console.log(`[SeedService] Created user: ${userId} | email: alex@sphere.app | password: ${DEFAULT_PASSWORD}`);
  }
}
