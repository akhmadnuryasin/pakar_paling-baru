import { createBrowserRouter } from 'react-router-dom';
import GeneralError from './pages/errors/general-error';
import NotFoundError from './pages/errors/not-found-error';
import MaintenanceError from './pages/errors/maintenance-error';
import ProtectedRoute from './ProtectedRoute';
// import { lazy } from 'react';
import AppShell from './components/app-shell';

const router = createBrowserRouter([
  {
    path: '/sign-in',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in-2')).default,
    }),
  },
  // Main routes
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('./pages/dashboard')).default,
        }),
      },
      {
        path: 'probabilitas',
        lazy: async () => ({
          Component: (await import('@/pages/probabilitas')).default,
        }),
      },
      {
        path: 'knowledge_base',
        lazy: async () => ({
          Component: (await import('@/pages/knowledge_base')).default,
        }),
      },
      {
        path: 'pengguna',
        lazy: async () => ({
          Component: (await import('@/pages/pengguna')).default,
        }),
      },
      {
        path: 'gejala',
        lazy: async () => ({
          Component: (await import('@/pages/gejala')).default,
        }),
      },
      {
        path: 'kerusakan',
        lazy: async () => ({
          Component: (await import('@/pages/kerusakan')).default,
        }),
      },
      {
        path: 'rules',
        lazy: async () => ({
          Component: (await import('@/pages/rules')).default,
        }),
      },
      {
        path: 'account',
        lazy: async () => ({
          Component: (await import('@/pages/akun')).default,
        }),
      },
      {
        path: 'logout',
      },
    ],
  },
  // Error routes
  { path: '/500', element: <GeneralError /> },
  { path: '/404', element: <NotFoundError /> },
  { path: '/503', element: <MaintenanceError /> },
  // Fallback 404 route
  { path: '*', element: <NotFoundError /> },
]);

export default router;
