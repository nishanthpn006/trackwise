import React from 'react';
import type { CategoryWithStats } from '@/types/category';
import CategoryCard from './CategoryCard';
import { SkeletonCard } from '@/components/common/LoadingSkeleton';

export interface CategoryGridProps {
  categories: CategoryWithStats[];
  isLoading?: boolean;
  onEdit: (category: CategoryWithStats) => void;
  onDelete: (category: CategoryWithStats) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  isLoading = false,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <SkeletonCard key={idx} className="h-48" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {categories.map((cat) => (
        <CategoryCard key={cat.id} category={cat} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default CategoryGrid;
