import { BrowserRouter } from 'react-router';
import AppRoutes from '@/routes';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { AuthProvider } from '@/context';

/**
 * App — Root application component wrapping AuthProvider and BrowserRouter.
 */
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
