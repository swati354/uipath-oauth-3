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
type SortField = 'name' | 'key' | 'version' | 'lastModified';
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
        case 'version':
          aValue = a.version || '';
          bValue = b.version || '';
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
      className="h-auto p-0 font-medium hover:bg-transparent"
    >
      <span className="flex items-center gap-1">
        {children}
        <ArrowUpDown className="h-3 w-3" />
      </span>
    </Button>
  );
  if (processes.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No processes found</h3>
          <p className="text-muted-foreground text-center max-w-md">
            No processes match your current filters. Try adjusting your search criteria or check if processes are published in UiPath Orchestrator.
          </p>
        </CardContent>
      </Card>
    );
  }
  return (
    <>
      <Card className={className}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="px-4 py-3">
                    <SortButton field="name">Name</SortButton>
                  </TableHead>
                  <TableHead className="px-4 py-3">
                    <SortButton field="key">Key</SortButton>
                  </TableHead>
                  <TableHead className="px-4 py-3">Description</TableHead>
                  <TableHead className="px-4 py-3">
                    <SortButton field="version">Version</SortButton>
                  </TableHead>
                  <TableHead className="px-4 py-3">Status</TableHead>
                  <TableHead className="px-4 py-3">
                    <SortButton field="lastModified">Last Modified</SortButton>
                  </TableHead>
                  <TableHead className="px-4 py-3 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProcesses.map((process) => (
                  <TableRow
                    key={process.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(process)}
                  >
                    <TableCell className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{process.name}</span>
                        {process.displayName && process.displayName !== process.name && (
                          <span className="text-xs text-muted-foreground">{process.displayName}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm font-mono">
                        <Key className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{process.key}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="text-sm text-muted-foreground line-clamp-2">
                        {process.description || 'No description'}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge variant="outline" className="font-mono text-xs">
                        {process.version || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <ProcessStatusBadge status="Available" />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(process.lastModifiedTime)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        {onViewDetails && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewDetails(process);
                            }}
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
                          className="bg-primary hover:bg-primary/90 text-primary-foreground"
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