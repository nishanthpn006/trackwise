import { useContext } from 'react';
import { SidebarContext, type SidebarContextType } from '@/context/SidebarContext';

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export default useSidebar;
