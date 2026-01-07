import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Loader2, 
  Pause, 
  Play,
  StopCircle 
} from 'lucide-react';
interface JobStatusBadgeProps {
  status: string;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
export function JobStatusBadge({ 
  status, 
  className, 
  showIcon = true, 
  size = 'md' 
}: JobStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'successful':
      case 'completed':
      case 'finished':
        return {
          variant: 'default' as const,
          className: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 shadow-sm hover:shadow-md transition-all duration-300',
          label: 'Successful',
          icon: <CheckCircle className={cn('text-green-600', getSizeClass())} />,
          pulse: false
        };
      case 'running':
      case 'in progress':
      case 'executing':
        return {
          variant: 'secondary' as const,
          className: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 shadow-sm hover:shadow-md transition-all duration-300',
          label: 'Running',
          icon: <Loader2 className={cn('text-blue-600 animate-spin', getSizeClass())} />,
          pulse: true
        };
      case 'failed':
      case 'faulted':
      case 'error':
        return {
          variant: 'destructive' as const,
          className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 shadow-sm hover:shadow-md transition-all duration-300',
          label: 'Failed',
          icon: <XCircle className={cn('text-red-600', getSizeClass())} />,
          pulse: false
        };
      case 'stopped':
      case 'terminated':
        return {
          variant: 'outline' as const,
          className: 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 shadow-sm hover:shadow-md transition-all duration-300',
          label: 'Stopped',
          icon: <StopCircle className={cn('text-gray-600', getSizeClass())} />,
          pulse: false
        };
      case 'pending':
      case 'queued':
        return {
          variant: 'outline' as const,
          className: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 shadow-sm hover:shadow-md transition-all duration-300',
          label: 'Pending',
          icon: <Clock className={cn('text-yellow-600', getSizeClass())} />,
          pulse: false
        };
      case 'paused':
      case 'suspended':
        return {
          variant: 'outline' as const,
          className: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 shadow-sm hover:shadow-md transition-all duration-300',
          label: 'Paused',
          icon: <Pause className={cn('text-orange-600', getSizeClass())} />,
          pulse: false
        };
      case 'resuming':
        return {
          variant: 'outline' as const,
          className: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 shadow-sm hover:shadow-md transition-all duration-300',
          label: 'Resuming',
          icon: <Play className={cn('text-indigo-600', getSizeClass())} />,
          pulse: true
        };
      default:
        return {
          variant: 'outline' as const,
          className: 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 shadow-sm hover:shadow-md transition-all duration-300',
          label: status,
          icon: <AlertCircle className={cn('text-gray-500', getSizeClass())} />,
          pulse: false
        };
    }
  };
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'h-3 w-3';
      case 'lg':
        return 'h-5 w-5';
      default:
        return 'h-4 w-4';
    }
  };
  const getBadgeSize = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-xs';
      case 'lg':
        return 'px-4 py-2 text-sm';
      default:
        return 'px-3 py-1 text-xs';
    }
  };
  const config = getStatusConfig(status);
  return (
    <Badge
      variant={config.variant}
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border backdrop-blur-sm',
        getBadgeSize(),
        config.className,
        config.pulse && 'animate-pulse',
        className
      )}
    >
      {showIcon && (
        <span className="flex-shrink-0">
          {config.icon}
        </span>
      )}
      <span className="font-medium">{config.label}</span>
    </Badge>
  );
}