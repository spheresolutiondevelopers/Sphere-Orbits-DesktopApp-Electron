import { createHashRouter } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { DashboardPage } from '../pages/DashboardPage';
import { TasksPage } from '../pages/TasksPage';
import { CalendarPage } from '../pages/CalendarPage';
import { MeetingsPage } from '../pages/MeetingsPage';
import { AppointmentsPage } from '../pages/AppointmentsPage';
import { EventsPage } from '../pages/EventsPage';
import { ChatPage } from '../pages/ChatPage';
import { NotesPage } from '../pages/NotesPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { TeamPage } from '../pages/TeamPage';
import { SettingsPage } from '../pages/SettingsPage';
import { LoginPage } from '../pages/Auth/LoginPage';
import { SignupPage } from '../pages/Auth/SignupPage';

export const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'tasks', element: <TasksPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'meetings', element: <MeetingsPage /> },
      { path: 'appointments', element: <AppointmentsPage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'notes', element: <NotesPage /> },
      { path: 'analytics', element: <AnalyticsPage /> },
      { path: 'team', element: <TeamPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
]);