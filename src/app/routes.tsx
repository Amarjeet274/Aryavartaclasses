import { createBrowserRouter } from 'react-router';
import { MainLayout } from './layouts/MainLayout';
import { HomePage, LandingPage, DashboardView } from './pages/HomePage';
import { ModelsPage } from './pages/ModelsPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { FacultyApplication } from './pages/FacultyApplication';
import { StudentEnrollment } from './pages/StudentEnrollment';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AboutPage } from './pages/AboutPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout,
    children: [
      {
        path: '',
        Component: HomePage,
        children: [
          { index: true, Component: LandingPage },
          { path: 'about', Component: AboutPage },
          {
            path: 'dashboard',
            children: [
              { index: true, Component: DashboardView },
              { path: 'models', Component: ModelsPage },
              { path: 'roadmap', Component: RoadmapPage }
            ]
          }
        ]
      },
      { path: 'faculty-application', Component: FacultyApplication },
      { path: 'student-enrollment', Component: StudentEnrollment },
      { path: '*', Component: LandingPage }
    ]
  },
  {
    path: '/admin',
    children: [
      { path: 'login', Component: AdminLogin },
      { path: 'dashboard', Component: AdminDashboard },
    ]
  }
]);
