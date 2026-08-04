import { BrowserRouter } from 'react-router';
import AppRoutes from '@/routes';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { AuthProvider, ToastProvider } from '@/context';

/**
 * App — Root application component wrapping ToastProvider, AuthProvider, and BrowserRouter.
 */
function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;

