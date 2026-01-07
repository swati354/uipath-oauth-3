import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckSquare, 
  User, 
  Calendar, 
  AlertCircle, 
  Clock,
  Flag,
  UserPlus,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
interface TaskCardProps {
  task: {
    id: string | number;
    title: string;
    description?: string;
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'Pending' | 'Assigned' | 'InProgress' | 'Completed' | 'Failed';
    dueDate?: string;
    assignee?: string;
  };
  onAssign: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  isAssigning?: boolean;
  isCompleting?: boolean;
  className?: string;
}
export function TaskCard({ 
  task, 
  onAssign, 
  onComplete, 
  isAssigning = false, 
  isCompleting = false,
  className 
}: TaskCardProps) {
  const getPriorityConfig = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return {
          color: 'text-red-600',
          bg: 'bg-red-50 border-red-200',
          icon: <Flag className="h-3 w-3 text-red-600" />
        };
      case 'high':
        return {
          color: 'text-orange-600',
          bg: 'bg-orange-50 border-orange-200',
          icon: <Flag className="h-3 w-3 text-orange-600" />
        };
      case 'medium':
        return {
          color: 'text-yellow-600',
          bg: 'bg-yellow-50 border-yellow-200',
          icon: <Flag className="h-3 w-3 text-yellow-600" />
        };
      case 'low':
        return {
          color: 'text-green-600',
          bg: 'bg-green-50 border-green-200',
          icon: <Flag className="h-3 w-3 text-green-600" />
        };
      default:
        return {
          color: 'text-gray-600',
          bg: 'bg-gray-50 border-gray-200',
          icon: <Flag className="h-3 w-3 text-gray-600" />
        };
    }
  };
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return {
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 border-green-200',
          label: 'Completed'
        };
      case 'inprogress':
        return {
          variant: 'secondary' as const,
          className: 'bg-blue-100 text-blue-800 border-blue-200',
          label: 'In Progress'
        };
      case 'assigned':
        return {
          variant: 'outline' as const,
          className: 'bg-purple-100 text-purple-800 border-purple-200',
          label: 'Assigned'
        };
      case 'failed':
        return {
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 border-red-200',
          label: 'Failed'
        };
      default:
        return {
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-800 border-gray-200',
          label: 'Pending'
        };
    }
  };
  const priorityConfig = getPriorityConfig(task.priority);
  const statusConfig = getStatusConfig(task.status);
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return null;
    }
  };
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const canAssign = task.status === 'Pending';
  const canComplete = task.status === 'Assigned' || task.status === 'InProgress';
  return (
    <Card className={cn(
      'group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50/50',
      className
    )}>
      {/* Priority indicator stripe */}
      <div className={cn(
        'absolute top-0 left-0 w-1 h-full transition-all duration-300',
        priorityConfig.bg.split(' ')[0].replace('bg-', 'bg-').replace('-50', '-400')
      )} />
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="relative pb-3 pl-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors duration-300 flex-shrink-0">
              <CheckSquare className="h-5 w-5 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg font-semibold text-foreground group-hover:text-purple-600 transition-colors duration-300 truncate">
                {task.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant={statusConfig.variant}
                  className={cn('text-xs', statusConfig.className)}
                >
                  {statusConfig.label}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={cn('text-xs', priorityConfig.bg, priorityConfig.color)}
                >
                  {priorityConfig.icon}
                  <span className="ml-1">{task.priority}</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-4 pl-6">
        {/* Description */}
        {task.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {task.description}
          </p>
        )}
        {/* Task Metadata */}
        <div className="space-y-2">
          {task.assignee && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{task.assignee}</span>
            </div>
          )}
          {task.dueDate && (
            <div className={cn(
              'flex items-center gap-2 text-sm',
              isOverdue ? 'text-red-600' : 'text-muted-foreground'
            )}>
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>Due: {formatDate(task.dueDate)}</span>
              {isOverdue && (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
            </div>
          )}
        </div>
        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {canAssign && (
            <Button
              onClick={() => onAssign(task.id.toString())}
              disabled={isAssigning}
              variant="outline"
              size="sm"
              className="flex-1 hover:bg-purple-50 hover:border-purple-200 transition-all duration-300"
            >
              {isAssigning ? (
                <>
                  <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Assigning...
                </>
              ) : (
                <>
                  <UserPlus className="h-3 w-3 mr-2" />
                  Assign
                </>
              )}
            </Button>
          )}
          {canComplete && (
            <Button
              onClick={() => onComplete(task.id.toString())}
              disabled={isCompleting}
              size="sm"
              className={cn(
                'flex-1 bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-md transition-all duration-300',
                canAssign ? '' : 'flex-1'
              )}
            >
              {isCompleting ? (
                <>
                  <div className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Completing...
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 mr-2" />
                  Complete
                </>
              )}
            </Button>
          )}
        </div>
        {/* Overdue Warning */}
        {isOverdue && (
          <div className="flex items-center gap-2 p-2 rounded-md bg-red-50 border border-red-200 text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="text-xs font-medium">This task is overdue</span>
          </div>
        )}
      </CardContent>
      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-lg border-2 border-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  );
}