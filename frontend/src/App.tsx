import { BrowserRouter } from 'react-router';
import AppRoutes from '@/routes';
import ErrorBoundary from '@/components/common/ErrorBoundary';

/**
 * App — application root.
 *
 * Provides:
 *  - ErrorBoundary: catches any uncaught render errors app-wide
 *  - BrowserRouter: enables client-side routing via the History API
 *  - AppRoutes: the full route tree (see src/routes/index.tsx)
 */
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
