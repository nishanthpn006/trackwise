import type React from 'react';
import Logo from '@/components/common/Logo';

/**
 * Footer — application footer displaying centered TrackWise branding and copyright.
 */
const Footer: React.FC = () => (
  <footer className="w-full border-t border-border/60 bg-card py-6 px-4 sm:px-6 mt-auto text-xs text-muted-foreground select-none">
    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-center">
      <Logo variant="footer" size={28} />
      <span className="hidden sm:inline-block text-border">•</span>
      <p>© {new Date().getFullYear()} TrackWise. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
