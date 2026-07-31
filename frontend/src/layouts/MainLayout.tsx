import { Outlet } from 'react-router';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';

/**
 * MainLayout — wraps authenticated app pages.
 * Structure: Navbar / (Sidebar + page content) / Footer.
 * Visual styling and responsive breakpoints added in Milestone 2.
 */
const MainLayout = () => (
  <div>
    <Navbar />
    <div>
      <Sidebar />
      <Outlet />
    </div>
    <Footer />
  </div>
);

export default MainLayout;
