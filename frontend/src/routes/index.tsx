import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import GlobalLoadingPage from '@/pages/GlobalLoadingPage';

// ── Lazy-loaded page components (route-based code splitting) ─────────────────
const LoginPage        = lazy(() => import('@/pages/LoginPage'));
const RegisterPage     = lazy(() => import('@/pages/RegisterPage'));
const DashboardPage    = lazy(() => import('@/pages/DashboardPage'));
const TransactionsPage = lazy(() => import('@/pages/TransactionsPage'));
const CategoriesPage   = lazy(() => import('@/pages/CategoriesPage'));
const BudgetsPage      = lazy(() => import('@/pages/BudgetsPage'));
const GoalsPage        = lazy(() => import('@/pages/GoalsPage'));
const ReportsPage      = lazy(() => import('@/pages/ReportsPage'));
const SettingsPage     = lazy(() => import('@/pages/SettingsPage'));
const ImportExportPage = lazy(() => import('@/pages/ImportExportPage'));
const NotFoundPage     = lazy(() => import('@/pages/NotFoundPage'));

/**
 * AppRoutes — defines the complete client-side route tree.
 *
 * All page components are lazily imported so each route chunk is only
 * downloaded when the user first navigates to that route. A shared
 * GlobalLoadingPage spinner is shown while the chunk loads.
 *
 * Structure:
 *   /login, /register          → AuthLayout (no sidebar/navbar)
 *   /dashboard, ...            → ProtectedRoute → MainLayout
 *   /                          → redirect → /dashboard
 *   /profile                   → redirect → /settings
 *   /not-found, *              → NotFoundPage
 */
const AppRoutes = () => (
  <Suspense fallback={<GlobalLoadingPage />}>
    <Routes>
      {/* ── Public authentication routes ─────────────────────────────── */}
      <Route element={<AuthLayout />}>
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* ── Protected application routes ─────────────────────────────── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/"              element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"     element={<DashboardPage />} />
          <Route path="/transactions"  element={<TransactionsPage />} />
          <Route path="/categories"    element={<CategoriesPage />} />
          <Route path="/budgets"       element={<BudgetsPage />} />
          <Route path="/goals"         element={<GoalsPage />} />
          <Route path="/reports"       element={<ReportsPage />} />
          <Route path="/profile"       element={<Navigate to="/settings" replace />} />
          <Route path="/settings"      element={<SettingsPage />} />
          <Route path="/import-export" element={<ImportExportPage />} />
        </Route>
      </Route>

      {/* ── 404 ──────────────────────────────────────────────────────── */}
      <Route path="/not-found" element={<NotFoundPage />} />
      <Route path="*"          element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
