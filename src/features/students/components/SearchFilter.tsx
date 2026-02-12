/**
 * SearchFilter Component
 * Search and filter controls for student list
 */

import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFilterClick?: () => void;
  placeholder?: string;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  onFilterClick,
  placeholder = 'Search students...',
}) => {
  return (
    <div className="flex gap-3">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {onFilterClick && (
        <Button variant="outline" onClick={onFilterClick}>
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      )}
    </div>
  );
};
