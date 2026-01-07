import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
interface ProcessStatusBadgeProps {
  status?: string;
  className?: string;
  showIcon?: boolean;
}
export function ProcessStatusBadge({ status, className, showIcon = false }: ProcessStatusBadgeProps) {
  const getStatusConfig = (status?: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'available':
      case 'published':
      case 'active':
        return {
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200 shadow-sm',
          label: 'Available',
          icon: <CheckCircle className="h-3 w-3" />
        };
      case 'running':
      case 'in progress':
      case 'busy':
        return {
          variant: 'secondary' as const,
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200 shadow-sm',
          label: 'Running',
          icon: <Clock className="h-3 w-3 animate-pulse" />
        };Looking at the TypeScript errors and the current codebase, I need to fix the property name issues with the UiPath SDK types and enhance the UI components. Let me analyze the errors:
1. `ProcessGetResponse` doesn't have `version`, `displayName`, `environmentName`, `creationTime`, or `author` properties
2. `TaskType` is imported as a type but used as a value
3. Need to enhance UI styling and polish
Let me check the actual UiPath SDK types and fix these issues while enhancing the UI.
```bash
# Fix TypeScript errors by using correct ProcessGetResponse properties and enhance UI styling
cat > src/components/process/ProcessTable.tsx << 'EOF'
import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ProcessStatusBadge } from './ProcessStatusBadge';
import { StartProcessDialog } from './StartProcessDialog';
import { Play, ArrowUpDown, Calendar, FileText, Key, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { ProcessGetResponse } from 'uipath-sdk';
interface ProcessTableProps {
  processes: ProcessGetResponse[];
  onStartProcess: (processKey: string, folderId: number, inputArguments?: Record<string, any>) => Promise<void>;
  onViewDetails?: (process: ProcessGetResponse) => void;
  isStarting?: boolean;
  className?: string;
}
type SortField = 'name' | 'key' | 'processVersion' | 'lastModified';
type SortDirection = 'asc' | 'desc';
export function ProcessTable({
  processes,
  onStartProcess,
  onViewDetails,
  isStarting = false,
  className
}: ProcessTableProps) {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedProcess, setSelectedProcess] = useState<ProcessGetResponse | null>(null);
  const [showStartDialog, setShowStartDialog] = useState(false);
  const sortedProcesses = useMemo(() => {
    return [...processes].sort((a, b) => {
      let aValue: any;
      let bValue: any;
      switch (sortField) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'key':
          aValue = a.key?.toLowerCase() || '';
          bValue = b.key?.toLowerCase() || '';
          break;
        case 'processVersion':
          aValue = a.processVersion || '';
          bValue = b.processVersion || '';
          break;
        case 'lastModified':
          aValue = new Date(a.lastModifiedTime || 0);
          bValue = new Date(b.lastModifiedTime || 0);
          break;
        default:
          return 0;
      }
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [processes, sortField, sortDirection]);
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  const handleStartClick = (process: ProcessGetResponse) => {
    setSelectedProcess(process);
    setShowStartDialog(true);
  };
  const handleRowClick = (process: ProcessGetResponse) => {
    if (onViewDetails) {
      onViewDetails(process);
    }
  };
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return 'Invalid date';
    }
  };
  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-auto p-0 font-medium hover:bg-transparent hover:text-primary transition-colors duration-200"
    >
      <span className="flex items-center gap-1">
        {children}
        <ArrowUpDown className={cn(
          'h-3 w-3 transition-all duration-200',
          sortField === field ? 'text-primary scale-110' : 'text-muted-foreground'
        )} />
      </span>
    </Button>
  );
  if (processes.length === 0) {
    return (
      <Card className={cn('border-dashed border-2 hover:border-primary/50 transition-colors duration-300', className)}>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-muted p-4 mb-4">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No processes found</h3>
          <p className="text-muted-foreground text-center max-w-md leading-relaxed">
            No processes match your current filters. Try adjusting your search criteria or check if processes are published in UiPath Orchestrator.
          </p>
        </CardContent>
      </Card>
    );
  }
  return (
    <>
      <Card className={cn('overflow-hidden border-0 shadow-sm', className)}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                  <TableHead className="px-6 py-4 font-semibold">
                    <SortButton field="name">Name</SortButton>
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold">
                    <SortButton field="key">Key</SortButton>
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold">Description</TableHead>
                  <TableHead className="px-6 py-4 font-semibold">
                    <SortButton field="processVersion">Version</SortButton>
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold">Status</TableHead>
                  <TableHead className="px-6 py-4 font-semibold">
                    <SortButton field="lastModified">Last Modified</SortButton>
                  </TableHead>
                  <TableHead className="px-6 py-4 text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProcesses.map((process) => (
                  <TableRow
                    key={process.id}
                    className="border-b border-border hover:bg-muted/30 transition-all duration-200 cursor-pointer group"
                    onClick={() => handleRowClick(process)}
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                          {process.name}
                        </span>
                        {process.title && process.title !== process.name && (
                          <span className="text-xs text-muted-foreground">{process.title}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm font-mono">
                        <Key className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                          {process.key}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <span className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
                        {process.description || 'No description'}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge variant="outline" className="font-mono text-xs bg-secondary/50 hover:bg-secondary transition-colors duration-200">
                        {process.processVersion || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <ProcessStatusBadge status="Available" />
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(process.lastModifiedTime)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {onViewDetails && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewDetails(process);
                            }}
                            className="hover:bg-secondary hover:border-primary/50 transition-all duration-200"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartClick(process);
                          }}
                          disabled={isStarting}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Start
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <StartProcessDialog
        open={showStartDialog}
        onOpenChange={setShowStartDialog}
        process={selectedProcess}
        onStartProcess={onStartProcess}
        isStarting={isStarting}
      />
    </>
  );
}