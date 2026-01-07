import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Queue, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Activity,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
interface QueueMonitorProps {
  queue: {
    id: string | number;
    name: string;
    description?: string;
    itemCounts: {
      new: number;
      inProgress: number;
      failed: number;
      successful: number;
    };
  };
  className?: string;
}
export function QueueMonitor({ queue, className }: QueueMonitorProps) {
  const { itemCounts } = queue;
  const totalItems = itemCounts.new + itemCounts.inProgress + itemCounts.failed + itemCounts.successful;
  const getSuccessRate = () => {
    if (totalItems === 0) return 0;
    return Math.round((itemCounts.successful / totalItems) * 100);
  };
  const getStatusColor = (count: number, type: 'new' | 'inProgress' | 'failed' | 'successful') => {
    if (count === 0) return 'text-muted-foreground';
    switch (type) {
      case 'successful':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'inProgress':
        return 'text-blue-600';
      case 'new':
        return 'text-yellow-600';
      default:
        return 'text-muted-foreground';
    }
  };
  const successRate = getSuccessRate();
  return (
    <Card className={cn(
      'group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50/50',
      className
    )}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="relative pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300 flex-shrink-0">
              <Queue className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg font-semibold text-foreground group-hover:text-blue-600 transition-colors duration-300 truncate">
                {queue.name}
              </CardTitle>
              {queue.description && (
                <CardDescription className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  {queue.description}
                </CardDescription>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
              {totalItems} items
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-6">
        {/* Success Rate Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Success Rate</span>
            <span className={cn(
              'font-semibold',
              successRate >= 80 ? 'text-green-600' : 
              successRate >= 60 ? 'text-yellow-600' : 'text-red-600'
            )}>
              {successRate}%
            </span>
          </div>
          <Progress 
            value={successRate} 
            className="h-2 bg-muted/50"
          />
        </div>
        {/* Queue Statistics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* New Items */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-100 group-hover:bg-yellow-100/50 transition-colors duration-300">
            <div className="p-1.5 rounded-md bg-yellow-100">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-yellow-800">New</p>
              <p className={cn('text-lg font-bold', getStatusColor(itemCounts.new, 'new'))}>
                {itemCounts.new}
              </p>
            </div>
          </div>
          {/* In Progress */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100 group-hover:bg-blue-100/50 transition-colors duration-300">
            <div className="p-1.5 rounded-md bg-blue-100">
              <Activity className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">In Progress</p>
              <p className={cn('text-lg font-bold', getStatusColor(itemCounts.inProgress, 'inProgress'))}>
                {itemCounts.inProgress}
              </p>
            </div>
          </div>
          {/* Successful */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-100 group-hover:bg-green-100/50 transition-colors duration-300">
            <div className="p-1.5 rounded-md bg-green-100">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">Successful</p>
              <p className={cn('text-lg font-bold', getStatusColor(itemCounts.successful, 'successful'))}>
                {itemCounts.successful}
              </p>
            </div>
          </div>
          {/* Failed */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-100 group-hover:bg-red-100/50 transition-colors duration-300">
            <div className="p-1.5 rounded-md bg-red-100">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-800">Failed</p>
              <p className={cn('text-lg font-bold', getStatusColor(itemCounts.failed, 'failed'))}>
                {itemCounts.failed}
              </p>
            </div>
          </div>
        </div>
        {/* Queue Health Indicator */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-muted">
          <div className="flex items-center gap-2">
            <TrendingUp className={cn(
              'h-4 w-4',
              successRate >= 80 ? 'text-green-600' : 
              successRate >= 60 ? 'text-yellow-600' : 'text-red-600'
            )} />
            <span className="text-sm font-medium text-foreground">Queue Health</span>
          </div>
          <Badge 
            variant={successRate >= 80 ? 'default' : successRate >= 60 ? 'secondary' : 'destructive'}
            className="bg-background/50 backdrop-blur-sm"
          >
            {successRate >= 80 ? 'Healthy' : successRate >= 60 ? 'Warning' : 'Critical'}
          </Badge>
        </div>
      </CardContent>
      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-lg border-2 border-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  );
}