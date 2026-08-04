import React, { useEffect, useState } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

/**
 * OfflineBanner — Detects network status and displays a notification banner when offline.
 */
export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState<boolean>(() => !navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="status"
      aria-live="assertive"
      className="bg-amber-500 text-amber-950 px-4 py-2 text-xs font-semibold flex items-center justify-between gap-3 shadow-md animate-in slide-in-from-top duration-300"
    >
      <div className="flex items-center gap-2">
        <WifiOff className="h-4 w-4 shrink-0" />
        <span>You are currently offline. Check your internet connection.</span>
      </div>
      <button
        type="button"
        onClick={() => setIsOffline(!navigator.onLine)}
        className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-900/10 hover:bg-amber-900/20 rounded-md text-[11px] font-bold transition-colors shrink-0"
      >
        <RefreshCw className="h-3 w-3" />
        <span>Check Connection</span>
      </button>
    </div>
  );
};

export default OfflineBanner;
