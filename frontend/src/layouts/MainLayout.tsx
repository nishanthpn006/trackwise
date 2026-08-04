import { Outlet } from 'react-router';
import { SidebarProvider } from '@/context';
import ToastProvider from '@/context/ToastProvider';
import { ToastContainer } from '@/components/ui';
import OfflineBanner from '@/components/common/OfflineBanner';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

/**
 * MainLayout — Wraps authenticated application pages in a responsive layout structure.
 * On desktop: Sticky 250px/72px left Sidebar + main content column.
 * On mobile: Full-width page + slide-out Sidebar drawer triggered by Navbar hamburger.
 */
export const MainLayout = () => (
  <ToastProvider>
    <SidebarProvider>
      <OfflineBanner />
      <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        {/* Sticky Desktop Sidebar & Mobile Drawer */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <Navbar />
          <main className="flex-1 flex flex-col min-w-0">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
      <ToastContainer />
    </SidebarProvider>
  </ToastProvider>
);

export default MainLayout;
