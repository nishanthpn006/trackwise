import React from 'react';

interface UnreadBadgeProps {
  count: number;
}

export const UnreadBadge: React.FC<UnreadBadgeProps> = ({ count }) => {
  if (count <= 0) return null;

  const displayCount = count > 9 ? '9+' : count.toString();

  return (
    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-extrabold text-white bg-rose-500 rounded-full shadow-xs ring-2 ring-background animate-pulse">
      {displayCount}
    </span>
  );
};

export default UnreadBadge;
