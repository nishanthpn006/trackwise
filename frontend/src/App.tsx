import { BrowserRouter } from 'react-router';
import AppRoutes from '@/routes';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { AuthProvider, ToastProvider, ThemeProvider } from '@/context';

/**
 * App — Root application component.
 *
 * ThemeProvider is the outermost wrapper so the `dark` class is applied to
 * <html> before any content mounts, eliminating theme flash on page load.
 */
function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <ToastProvider>
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
        </ToastProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;


