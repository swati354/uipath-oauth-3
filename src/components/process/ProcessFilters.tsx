import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
interface ProcessFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  folderFilter: string;
  onFolderFilterChange: (value: string) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  className?: string;
}
const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'available', label: 'Available' },
  { value: 'running', label: 'Running' },
  { value: 'failed', label: 'Failed' },
  { value: 'stopped', label: 'Stopped' }
];
const FOLDER_OPTIONS = [
  { value: 'all', label: 'All Folders' },
  { value: 'shared', label: 'Shared' },
  { value: 'personal', label: 'Personal' }
];
export function ProcessFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  folderFilter,
  onFolderFilterChange,
  onRefresh,
  isRefreshing = false,
  className
}: ProcessFiltersProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row gap-4 p-4 bg-card border border-border rounded-lg', className)}>
      {/* Search Input */}
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search processes by name or description..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      {/* Status Filter */}
      <div className="flex items-center gap-2 min-w-0 sm:min-w-[160px]">
        <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Folder Filter */}
      <div className="min-w-0 sm:min-w-[140px]">
        <Select value={folderFilter} onValueChange={onFolderFilterChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Folder" />
          </SelectTrigger>
          <SelectContent>
            {FOLDER_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Refresh Button */}
      <Button
        variant="outline"
        size="default"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="flex-shrink-0"
      >
        <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
        <span className="ml-2 hidden sm:inline">Refresh</span>
      </Button>
    </div>
  );
}