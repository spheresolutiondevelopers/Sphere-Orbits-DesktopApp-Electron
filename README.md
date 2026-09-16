# 🌐 Sphere Schedule Desktop (Orbits)

[![Electron](https://img.shields.io/badge/Electron-30.0.0-47848F?style=flat&logo=electron)](https://electronjs.org)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat&logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com)
[![pnpm](https://img.shields.io/badge/pnpm-8.0-F69220?style=flat&logo=pnpm)](https://pnpm.io)
[![Turborepo](https://img.shields.io/badge/Turborepo-1.0-EF4444?style=flat&logo=turborepo)](https://turbo.build)

**Sphere Schedule** is a local‑first, cross‑platform desktop scheduling application built for teams and individuals. It combines a rich React UI with a local SQLite database, background sync, and optional cloud backup – all wrapped in a secure Electron shell.

This monorepo contains the complete source code for the desktop app, following Clean Architecture and Domain‑Driven Design. It is designed to work **offline-first** and to sync with a hosted API when available, ensuring data integrity and a seamless user experience across devices.

---

## 📦 Project Structure

The repository is organised as a **pnpm workspace** with **Turborepo** for efficient builds. Each package lives in `packages/`. Below is the full directory tree with explanations of every file.

```
sphere-desktop/
├── .env.example                         # Environment variables template (API_URL, etc.)
├── .eslintrc.js                         # ESLint configuration (TypeScript + React)
├── .gitignore                           # Git ignore rules
├── .prettierrc                          # Prettier code formatting rules
├── electron-builder.yml                 # Electron Builder config (targets, icons, appId)
├── package.json                         # Root package.json (workspaces, scripts, devDependencies)
├── pnpm-workspace.yaml                  # Defines workspace packages (packages/*)
├── README.md                            # Project documentation
├── tsconfig.base.json                   # Shared TypeScript compiler options
├── turbo.json                           # Turborepo pipeline (build, dev, test tasks)
├── public/
│   ├── favicon.ico                      # Browser favicon
│   └── icons/
│       ├── icon.icns                    # macOS application icon
│       ├── icon.ico                     # Windows application icon
│       └── icon.png                     # Linux / fallback icon
├── packages/
│   ├── shared/                          # Pure TypeScript shared code (no Electron/Node)
│   │   ├── package.json                 # Package metadata (name: @orbits/shared)
│   │   ├── tsconfig.json                # Extends base, outputs ESM/CJS
│   │   └── src/
│   │       ├── index.ts                 # Barrel export
│   │       ├── ipc/
│   │       │   ├── channels.ts          # All IPC channel constants (e.g., 'ipc:tasks:get')
│   │       │   └── contracts/           # Typed request/response DTOs for IPC
│   │       │       ├── analytics.contract.ts
│   │       │       ├── appointments.contract.ts
│   │       │       ├── auth.contract.ts
│   │       │       ├── calendar.contract.ts
│   │       │       ├── chat.contract.ts
│   │       │       ├── events.contract.ts
│   │       │       ├── index.ts
│   │       │       ├── meetings.contract.ts
│   │       │       ├── notes.contract.ts
│   │       │       ├── settings.contract.ts
│   │       │       └── tasks.contract.ts
│   │       ├── schemas/                 # Zod schemas for validation (mirrors API)
│   │       │   ├── analytics.schema.ts
│   │       │   ├── appointments.schema.ts
│   │       │   ├── auth.schema.ts
│   │       │   ├── calendar.schema.ts
│   │       │   ├── chat.schema.ts
│   │       │   ├── events.schema.ts
│   │       │   ├── meetings.schema.ts
│   │       │   ├── notes.schema.ts
│   │       │   ├── settings.schema.ts
│   │       │   └── tasks.schema.ts
│   │       ├── types/                   # Pure TypeScript interfaces (DTOs)
│   │       │   ├── AnalyticsData.ts
│   │       │   ├── Appointment.ts
│   │       │   ├── CalendarEvent.ts
│   │       │   ├── Event.ts
│   │       │   ├── Meeting.ts
│   │       │   ├── Message.ts
│   │       │   ├── Note.ts
│   │       │   ├── Settings.ts
│   │       │   ├── Task.ts
│   │       │   └── User.ts
│   │       ├── sync/                    # Sync contract types
│   │       │   ├── ConflictStrategy.ts
│   │       │   └── SyncOperation.ts
│   │       └── utils/                   # Pure utility functions
│   │           ├── date.ts              # Date formatting, timezone helpers
│   │           ├── index.ts
│   │           ├── result.ts            # Result<T, E> monad
│   │           └── validators.ts        # Shared validation (email, etc.)
│   │
│   ├── domain/                          # Pure business logic (no Electron/Node/React)
│   │   ├── package.json                 # @orbits/domain
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts                 # Barrel export
│   │       ├── auth/
│   │       │   ├── entities/
│   │       │   │   └── User.ts
│   │       │   ├── repositories/
│   │       │   │   └── IAuthRepository.ts
│   │       │   └── use-cases/
│   │       │       ├── LoginUseCase.ts
│   │       │       ├── LogoutUseCase.ts
│   │       │       └── ValidateTokenUseCase.ts
│   │       ├── tasks/
│   │       │   ├── entities/
│   │       │   │   └── Task.ts
│   │       │   ├── repositories/
│   │       │   │   └── ITaskRepository.ts
│   │       │   └── use-cases/
│   │       │       ├── CreateTaskUseCase.ts
│   │       │       ├── GetTasksUseCase.ts
│   │       │       └── CompleteTaskUseCase.ts
│   │       ├── calendar/
│   │       │   ├── entities/
│   │       │   │   └── CalendarEvent.ts
│   │       │   ├── repositories/
│   │       │   │   └── ICalendarRepository.ts
│   │       │   └── use-cases/
│   │       │       ├── GetEventsUseCase.ts
│   │       │       └── SyncCalendarUseCase.ts
│   │       ├── meetings/
│   │       │   ├── entities/
│   │       │   │   └── Meeting.ts
│   │       │   ├── repositories/
│   │       │   │   └── IMeetingRepository.ts
│   │       │   └── use-cases/
│   │       │       ├── GetMeetingsUseCase.ts
│   │       │       └── JoinMeetingUseCase.ts
│   │       ├── appointments/
│   │       │   ├── entities/
│   │       │   │   └── Appointment.ts
│   │       │   ├── repositories/
│   │       │   │   └── IAppointmentRepository.ts
│   │       │   └── use-cases/
│   │       │       ├── BookAppointmentUseCase.ts
│   │       │       └── GetAppointmentsUseCase.ts
│   │       ├── events/
│   │       │   ├── entities/
│   │       │   │   └── Event.ts
│   │       │   ├── repositories/
│   │       │   │   └── IEventRepository.ts
│   │       │   └── use-cases/
│   │       │       ├── CreateEventUseCase.ts
│   │       │       └── GetEventsUseCase.ts
│   │       ├── chat/
│   │       │   ├── entities/
│   │       │   │   └── Message.ts
│   │       │   ├── repositories/
│   │       │   │   └── IChatRepository.ts
│   │       │   └── use-cases/
│   │       │       ├── SendMessageUseCase.ts
│   │       │       └── ObserveMessagesUseCase.ts
│   │       ├── notes/
│   │       │   ├── entities/
│   │       │   │   └── Note.ts
│   │       │   ├── repositories/
│   │       │   │   └── INotesRepository.ts
│   │       │   └── use-cases/
│   │       │       ├── SaveNoteUseCase.ts
│   │       │       └── GetNotesUseCase.ts
│   │       ├── analytics/
│   │       │   ├── entities/
│   │       │   │   └── AnalyticsData.ts
│   │       │   ├── repositories/
│   │       │   │   └── IAnalyticsRepository.ts
│   │       │   └── use-cases/
│   │       │       ├── GenerateReportUseCase.ts
│   │       │       └── GetProductivityScoreUseCase.ts
│   │       └── settings/
│   │           ├── entities/
│   │           │   └── Settings.ts
│   │           ├── repositories/
│   │           │   └── ISettingsRepository.ts
│   │           └── use-cases/
│   │               ├── GetSettingsUseCase.ts
│   │               └── UpdateSettingsUseCase.ts
│   │
│   ├── data/                            # Data layer implementations (SQLite, API clients)
│   │   ├── package.json                 # @orbits/data
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts                 # Barrel export
│   │       ├── auth/
│   │       │   ├── AuthRepository.ts    # Implements IAuthRepository (local + remote)
│   │       │   ├── TokenStore.ts        # Secure token persistence (keytar/electron-store)
│   │       │   └── OAuthClient.ts       # Google/Microsoft OAuth flow
│   │       ├── tasks/
│   │       │   ├── TaskRepository.ts    # Implements ITaskRepository
│   │       │   ├── local/
│   │       │   │   └── TaskDao.ts       # Raw SQLite queries for tasks
│   │       │   └── remote/
│   │       │       └── TaskApi.ts       # Axios calls to /api/tasks
│   │       ├── calendar/
│   │       │   ├── CalendarRepository.ts
│   │       │   ├── local/
│   │       │   │   └── EventDao.ts
│   │       │   └── remote/
│   │       │       └── GoogleCalendarApi.ts
│   │       ├── meetings/
│   │       │   ├── MeetingRepository.ts
│   │       │   └── remote/
│   │       │       └── ZoomApi.ts
│   │       ├── appointments/
│   │       │   ├── AppointmentRepository.ts
│   │       │   └── local/
│   │       │       └── AppointmentDao.ts
│   │       ├── events/
│   │       │   ├── EventRepository.ts
│   │       │   └── local/
│   │       │       └── EventDao.ts
│   │       ├── chat/
│   │       │   ├── ChatRepository.ts
│   │       │   ├── websocket/
│   │       │   │   └── WebSocketClient.ts
│   │       │   └── local/
│   │       │       └── MessageDao.ts
│   │       ├── notes/
│   │       │   ├── NotesRepository.ts
│   │       │   └── local/
│   │       │       ├── NoteDao.ts
│   │       │       └── MarkdownParser.ts
│   │       ├── analytics/
│   │       │   ├── AnalyticsRepository.ts
│   │       │   └── ReportGenerator.ts
│   │       └── settings/
│   │           ├── SettingsRepository.ts
│   │           └── datastore/
│   │               └── SettingsStore.ts
│   │
│   ├── main/                            # Electron main process
│   │   ├── package.json                 # @orbits/main
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts               # Vite config for main (builds to dist/)
│   │   └── src/
│   │       ├── index.ts                 # Entry point: app.whenReady, creates window
│   │       ├── menu.ts                  # Application menu (File, Edit, View, Window)
│   │       ├── tray.ts                  # System tray icon + context menu
│   │       ├── windows/
│   │       │   ├── index.ts
│   │       │   ├── MainWindow.ts        # Creates BrowserWindow with preload
│   │       │   └── SettingsWindow.ts    # (optional) separate settings window
│   │       ├── ipc/                     # IPC handler registration
│   │       │   ├── index.ts             # Registers all handlers
│   │       │   ├── analytics.handler.ts
│   │       │   ├── appointments.handler.ts
│   │       │   ├── auth.handler.ts
│   │       │   ├── calendar.handler.ts
│   │       │   ├── chat.handler.ts
│   │       │   ├── events.handler.ts
│   │       │   ├── meetings.handler.ts
│   │       │   ├── notes.handler.ts
│   │       │   ├── settings.handler.ts
│   │       │   └── tasks.handler.ts
│   │       ├── database/                # SQLite database client and migrations
│   │       │   ├── DatabaseClient.ts    # Singleton, opens DB, runs migrations
│   │       │   ├── index.ts
│   │       │   └── migrations/
│   │       │       ├── 001_init.sql     # Initial tables (users, tasks, etc.)
│   │       │       ├── 002_add_events.sql
│   │       │       ├── 003_add_notes.sql
│   │       │       └── 004_sync_tables.sql # adds synced_at, deleted, sync_queue
│   │       └── sync/                    # Offline sync service
│   │           ├── SyncService.ts       # Orchestrates pull/push, conflict resolution
│   │           ├── ConflictResolver.ts  # Applies LWW / manual strategies
│   │           ├── SyncQueueManager.ts  # Reads/writes to sync_queue table
│   │           ├── ApiClient.ts         # HTTP client for API calls (extends network)
│   │           └── index.ts
│   │
│   ├── preload/                         # Preload script (secure bridge)
│   │   ├── package.json                 # @orbits/preload
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts               # Builds preload.js
│   │   └── src/
│   │       └── index.ts                 # contextBridge.exposeInMainWorld('electronAPI', { ... })
│   │
│   └── renderer/                        # React + Tailwind frontend
│       ├── package.json                 # @orbits/renderer (depends on shared & domain only)
│       ├── tsconfig.json
│       ├── vite.config.ts               # Vite config with React, Tailwind, HMR
│       ├── tailwind.config.js           # Tailwind CSS config (content, theme)
│       ├── postcss.config.js            # PostCSS (Tailwind + autoprefixer)
│       ├── index.html                   # Entry HTML (Vite uses this)
│       └── src/
│           ├── index.tsx                # ReactDOM.createRoot entry
│           ├── App.tsx                  # Root component (Router, ThemeProvider)
│           ├── vite-env.d.ts
│           ├── routes/
│           │   └── index.tsx            # React Router routes definition
│           ├── pages/                   # Page components (top-level views)
│           │   ├── Auth/
│           │   │   ├── LoginPage.tsx
│           │   │   └── SignupPage.tsx
│           │   ├── DashboardPage.tsx
│           │   ├── TasksPage.tsx
│           │   ├── CalendarPage.tsx
│           │   ├── MeetingsPage.tsx
│           │   ├── AppointmentsPage.tsx
│           │   ├── EventsPage.tsx
│           │   ├── ChatPage.tsx
│           │   ├── NotesPage.tsx
│           │   ├── AnalyticsPage.tsx
│           │   ├── TeamPage.tsx
│           │   └── SettingsPage.tsx
│           ├── features/                # Feature modules (self-contained)
│           │   ├── auth/
│           │   │   ├── components/
│           │   │   │   └── index.ts
│           │   │   ├── hooks/
│           │   │   │   └── useAuth.ts   # Calls IPC for login/signup
│           │   │   └── index.ts
│           │   ├── tasks/
│           │   │   ├── components/
│           │   │   │   ├── TaskFilterBar.tsx
│           │   │   │   ├── TaskList.tsx
│           │   │   │   └── TaskItem.tsx
│           │   │   ├── hooks/
│           │   │   │   └── useTasks.ts  # Uses useIpc to get/set tasks
│           │   │   └── index.ts
│           │   ├── calendar/
│           │   │   ├── components/
│           │   │   │   ├── MonthView.tsx
│           │   │   │   ├── WeekView.tsx
│           │   │   │   └── AgendaView.tsx
│           │   │   ├── hooks/
│           │   │   │   └── useCalendar.ts
│           │   │   └── index.ts
│           │   ├── meetings/
│           │   │   ├── components/
│           │   │   │   ├── MeetingCard.tsx
│           │   │   │   └── MeetingFilter.tsx
│           │   │   ├── hooks/
│           │   │   │   └── useMeetings.ts
│           │   │   └── index.ts
│           │   ├── appointments/
│           │   │   ├── components/
│           │   │   │   ├── AppointmentCard.tsx
│           │   │   │   └── AppointmentForm.tsx
│           │   │   ├── hooks/
│           │   │   │   └── useAppointments.ts
│           │   │   └── index.ts
│           │   ├── events/
│           │   │   ├── components/
│           │   │   │   ├── EventCard.tsx
│           │   │   │   ├── EventDetail.tsx
│           │   │   │   └── EventForm.tsx
│           │   │   ├── hooks/
│           │   │   │   └── useEvents.ts
│           │   │   └── index.ts
│           │   ├── chat/
│           │   │   ├── components/
│           │   │   │   ├── ChatList.tsx
│           │   │   │   ├── ConversationView.tsx
│           │   │   │   └── MessageInput.tsx
│           │   │   ├── hooks/
│           │   │   │   └── useChat.ts
│           │   │   └── index.ts
│           │   ├── notes/
│           │   │   ├── components/
│           │   │   │   ├── NoteCard.tsx
│           │   │   │   ├── NoteEditor.tsx
│           │   │   │   └── NoteFilter.tsx
│           │   │   ├── hooks/
│           │   │   │   └── useNotes.ts
│           │   │   └── index.ts
│           │   ├── analytics/
│           │   │   ├── components/
│           │   │   │   ├── StatCard.tsx
│           │   │   │   ├── BarChart.tsx
│           │   │   │   └── ReportExport.tsx
│           │   │   ├── hooks/
│           │   │   │   └── useAnalytics.ts
│           │   │   └── index.ts
│           │   └── settings/
│           │       ├── components/
│           │       │   ├── ProfileForm.tsx
│           │       │   ├── ThemeToggle.tsx
│           │       │   └── IntegrationList.tsx
│           │       ├── hooks/
│           │       │   └── useSettings.ts
│           │       └── index.ts
│           ├── components/              # Global UI components
│           │   ├── layout/
│           │   │   ├── Sidebar.tsx      # Main navigation sidebar
│           │   │   ├── TopBar.tsx       # Top bar with search, avatar, theme toggle
│           │   │   └── StatusBar.tsx    # Bottom status bar (online, sync, clock)
│           │   ├── ui/                  # Atomic design primitives
│           │   │   ├── Button.tsx
│           │   │   ├── Card.tsx
│           │   │   ├── StatCard.tsx      # Generic stat card (not feature-specific)
│           │   │   ├── AgendaBlock.tsx
│           │   │   ├── OrbitHub.tsx      # Interactive planet navigation (from design)
│           │   │   └── ...               # Other pure UI primitives
│           │   └── shared/
│           │       └── index.ts
│           ├── hooks/                    # Global custom hooks
│           │   ├── index.ts
│           │   ├── useIpc.ts             # Generic IPC invocation (with types)
│           │   ├── useAnalytics.ts
│           │   ├── useAppointments.ts
│           │   ├── useAuth.ts
│           │   ├── useCalendar.ts
│           │   ├── useChat.ts
│           │   ├── useEvents.ts
│           │   ├── useMeetings.ts
│           │   ├── useNotes.ts
│           │   ├── useSettings.ts
│           │   └── useTasks.ts
│           ├── store/                    # Zustand state management
│           │   ├── index.ts             # Store setup (combine slices)
│           │   ├── uiSlice.ts           # UI state (sidebar collapsed, theme, etc.)
│           │   └── userSlice.ts         # User state (user, token, online status)
│           ├── types/                   # Renderer-only types (extend shared)
│           │   └── index.ts
│           ├── utils/                   # Renderer utilities
│           │   ├── formatters.ts        # Format dates, numbers, etc.
│           │   └── index.ts
│           └── styles/
│               ├── index.css            # Tailwind imports and custom styles
│               └── globals.css          # Global CSS variables (if any)
└── README.md
```

---

## 🧱 Architecture Overview

The application follows **Clean Architecture** with three main layers:

1. **Domain** (`packages/domain`) – Pure business logic, use cases, and repository interfaces. No external dependencies.
2. **Data** (`packages/data`) – Repository implementations for SQLite, REST APIs, and WebSocket clients.
3. **Renderer** (`packages/renderer`) – React UI with feature modules, pages, and global components.

**Electron Integration:**
- **Main Process** (`packages/main`) – Manages windows, IPC, database connection, and sync service.
- **Preload Script** (`packages/preload`) – Securely exposes a typed API to the renderer using `contextBridge`.
- **Shared Contracts** (`packages/shared`) – Defines IPC channels, DTOs, Zod schemas, and sync types used by both main and renderer.

### Data Flow
1. **UI action** (e.g., clicking "Complete Task") triggers a hook (`useTasks`) that calls `useIpc`.
2. The renderer invokes an IPC channel (e.g., `ipc:tasks:complete`).
3. The main process receives the call, executes the corresponding use case (e.g., `CompleteTaskUseCase`), which uses the repository (`TaskRepository`) to update SQLite.
4. The repository updates the local database immediately (offline‑first).
5. The sync service, running in the background, later pushes the change to the remote API (if online) and handles conflicts.

### Security
- Node.js integration is **disabled** in the renderer (`nodeIntegration: false`).
- Only the preload script exposes a carefully selected set of APIs via `contextBridge`.
- IPC contracts are fully typed and validated using Zod schemas.

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| **Desktop Runtime** | Electron 30 |
| **Build Tool** | Vite 5 + Turborepo |
| **Package Manager** | pnpm 8 (workspaces) |
| **Language** | TypeScript 5 |
| **UI Framework** | React 19 |
| **Styling** | Tailwind CSS 3 |
| **State Management** | Zustand |
| **Database** | SQLite (better-sqlite3) |
| **Validation** | Zod |
| **Linting** | ESLint + Prettier |
| **Testing** | Vitest / Playwright (planned) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm 8+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/sphere-desktop.git
cd sphere-desktop

# Install dependencies
pnpm install
```

### Development

```bash
# Start the app in development mode (HMR for renderer, auto-reload for main)
pnpm run dev
```

This will:

- Build all packages in watch mode.
- Launch Electron with the main process from `packages/main/src/index.ts`.
- Serve the renderer from Vite on `http://localhost:3000`.

### Build

```bash
# Build all packages (production)
pnpm run build

# Pack the app for current platform (without installer)
pnpm run pack

# Create installers for all platforms
pnpm run dist
```

The built artifacts will be generated in the `release/` directory.

> 📖 For an in-depth step-by-step walkthrough, native dependency troubleshooting, code signing, and CI/CD pipelines, see the [Executable & Installer Build Guide](BUILD_GUIDE.md).

---

## 🧪 Testing

```bash
# Run unit tests (once)
pnpm run test

# Run tests in watch mode
pnpm run test:watch
```

(Testing setup with Vitest is planned for future releases.)

---

## 🤝 Contributing

We welcome contributions! Please read our CONTRIBUTING.md for guidelines.

---

## 📄 License

This project is licensed under the MIT License.

---

## 📬 Contact

- **Project Lead:** Sphere Solution Developers
- **Email:** spheresolutiondevelopers@gmail.com 
- **Website:** https://sphereschedule.io

---

Built with ❤️ in Nairobi, Kenya
