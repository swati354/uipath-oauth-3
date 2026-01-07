import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
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
          className: 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200 shadow-sm transition-all duration-200',
          label: 'Available',
          icon: <CheckCircle className="h-3 w-3" />
        };
      case 'running':
      case 'in progress':
      case 'busy':
        return {
          variant: 'secondary' as const,
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200 shadow-sm transition-all duration-200',
          label: 'Running',
          icon: <Loader2 className="h-3 w-3 animate-spin" />
        };
      case 'failed':
      case 'error':
      case 'faulted':
        return {
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200 shadow-sm transition-all duration-200',
          label: 'Failed',
          icon: <XCircle className="h-3 w-3" />
        };
      case 'stopped':
      case 'terminated':
      case 'cancelled':
        return {
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200 shadow-sm transition-all duration-200',
          label: 'Stopped',
          icon: <AlertCircle className="h-3 w-3" />
        };
      case 'pending':
      case 'queued':
        return {
          variant: 'outline' as const,
          className: 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200 shadow-sm transition-all duration-200',
          label: 'Pending',
          icon: <Clock className="h-3 w-3" />
        };
      default:
        return {
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200 shadow-sm transition-all duration-200',
          label: status || 'Unknown',
          icon: <AlertCircle className="h-3 w-3" />
        };
    }
  };
  const config = getStatusConfig(status);
  return (
    <Badge
      variant={config.variant}
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border',
        config.className,
        className
      )}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </Badge>
  );
}