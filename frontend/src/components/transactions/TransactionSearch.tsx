import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

export interface TransactionSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const TransactionSearch: React.FC<TransactionSearchProps> = ({
  value: externalValue,
  onChange,
  placeholder = 'Search by title or notes...',
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState<string>(externalValue);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Sync internal state when external value changes
  useEffect(() => {
    setSearchTerm(externalValue);
  }, [externalValue]);

  // Trigger onChange when debounced search term updates
  useEffect(() => {
    if (debouncedSearchTerm !== externalValue) {
      onChange(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, externalValue, onChange]);

  const handleClear = () => {
    setSearchTerm('');
    onChange('');
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
        <Search className="h-4 w-4" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        aria-label="Search transactions"
        className="w-full pl-9 pr-9 py-2 bg-background border border-input rounded-xl text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default TransactionSearch;
