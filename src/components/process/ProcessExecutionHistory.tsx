import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { History, Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
interface ProcessExecutionHistoryProps {
  processKey: string;
}
// Mock execution history data - in a real app, this would come from UiPath SDK
const mockExecutionHistory = [
  {
    id: '1',
    jobId: 'job_001',
    status: 'Successful',
    startTime: '2024-01-15T10:30:00Z',
    endTime: '2024-01-15T10:32:15Z',
    duration: 135000, // milliseconds
    robotName: 'Robot-001',
    machineName: 'DESKTOP-ABC123',
    user: 'admin@company.com'
  },
  {
    id: '2',
    jobId: 'job_002',
    status: 'Failed',
    startTime: '2024-01-15T09:15:00Z',
    endTime: '2024-01-15T09:16:30Z',
    duration: 90000,
    robotName: 'Robot-002',
    machineName: 'DESKTOP-XYZ789',
    user: 'admin@company.com',
    errorMessage: 'Element not found on screen'
  },
  {
    id: '3',
    jobId: 'job_003',
    status: 'Running',
    startTime: '2024-01-15T11:00:00Z',
    endTime: null,
    duration: null,
    robotName: 'Robot-001',
    machineName: 'DESKTOP-ABC123',
    user: 'admin@company.com'
  },
  {
    id: '4',
    jobId: 'job_004',
    status: 'Successful',
    startTime: '2024-01-14T16:45:00Z',
    endTime: '2024-01-14T16:47:20Z',
    duration: 155000,
    robotName: 'Robot-003',
    machineName: 'DESKTOP-DEF456',
    user: 'user@company.com'
  }
];
export function ProcessExecutionHistory({ processKey }: ProcessExecutionHistoryProps) {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'successful':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'successful':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Successful
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Failed
          </Badge>
        );
      case 'running':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Running
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };
  const formatDuration = (milliseconds: number | null) => {
    if (!milliseconds) return 'N/A';
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };
  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm:ss');
    } catch {
      return 'Invalid date';
    }
  };
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Executions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{mockExecutionHistory.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Successful</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockExecutionHistory.filter(h => h.status === 'Successful').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockExecutionHistory.filter(h => h.status === 'Failed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Running</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockExecutionHistory.filter(h => h.status === 'Running').length}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Execution History Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <CardTitle>Execution History</CardTitle>
          </div>
          <CardDescription>
            Recent executions for process: {processKey}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="px-4 py-3">Job ID</TableHead>
                  <TableHead className="px-4 py-3">Status</TableHead>
                  <TableHead className="px-4 py-3">Start Time</TableHead>
                  <TableHead className="px-4 py-3">End Time</TableHead>
                  <TableHead className="px-4 py-3">Duration</TableHead>
                  <TableHead className="px-4 py-3">Robot</TableHead>
                  <TableHead className="px-4 py-3">Machine</TableHead>
                  <TableHead className="px-4 py-3">User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockExecutionHistory.map((execution) => (
                  <TableRow
                    key={execution.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(execution.status)}
                        <span className="font-mono text-sm">{execution.jobId}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {getStatusBadge(execution.status)}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{formatDateTime(execution.startTime)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="text-sm">
                        {execution.endTime ? formatDateTime(execution.endTime) : 'Running...'}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="text-sm font-mono">
                        {formatDuration(execution.duration)}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="text-sm">{execution.robotName}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="text-sm font-mono">{execution.machineName}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="text-sm">{execution.user}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}