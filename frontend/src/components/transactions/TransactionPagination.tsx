import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface TransactionPaginationProps {
  page: number; // 0-based
  totalPages: number;
  totalElements: number;
  size: number;
  onPageChange: (newPage: number) => void;
  onSizeChange: (newSize: number) => void;
  isLoading?: boolean;
}

export const TransactionPagination: React.FC<TransactionPaginationProps> = ({
  page,
  totalPages,
  totalElements,
  size,
  onPageChange,
  onSizeChange,
  isLoading = false,
}) => {
  const currentPageDisplay = page + 1;
  const startItem = totalElements === 0 ? 0 : page * size + 1;
  const endItem = Math.min((page + 1) * size, totalElements);

  return (
    <div className="p-4 border-t border-border/60 bg-card/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
      {/* Items info & Page size selector */}
      <div className="flex items-center gap-4">
        <span>
          Showing <span className="font-semibold text-foreground">{startItem}</span> -{' '}
          <span className="font-semibold text-foreground">{endItem}</span> of{' '}
          <span className="font-semibold text-foreground">{totalElements}</span> entries
        </span>

        <div className="flex items-center gap-1.5 border-l border-border/60 pl-4">
          <span>Rows per page:</span>
          <select
            value={size}
            onChange={(e) => onSizeChange(Number(e.target.value))}
            disabled={isLoading}
            aria-label="Rows per page"
            className="h-7 px-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-xs cursor-pointer disabled:opacity-50"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Pagination Nav Buttons */}
      <div className="flex items-center gap-2">
        <span className="font-medium text-foreground mr-2">
          Page {currentPageDisplay} of {totalPages || 1}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(Math.max(0, page - 1))}
          disabled={page === 0 || isLoading}
          aria-label="Previous page"
          className="inline-flex items-center justify-center h-8 w-8 rounded-xl border border-border/80 bg-background text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1 || isLoading}
          aria-label="Next page"
          className="inline-flex items-center justify-center h-8 w-8 rounded-xl border border-border/80 bg-background text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default TransactionPagination;
