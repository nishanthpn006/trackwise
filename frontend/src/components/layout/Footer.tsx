import type React from 'react';
import Logo from '@/components/common/Logo';

/**
 * Footer — application footer displaying TrackWise branding and copyright.
 */
const Footer: React.FC = () => (
  <footer className="w-full border-t border-border/60 bg-card py-6 px-4 sm:px-6 mt-auto text-xs text-muted-foreground">
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <Logo variant="footer" size={24} />
      <p>© {new Date().getFullYear()} TrackWise. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
