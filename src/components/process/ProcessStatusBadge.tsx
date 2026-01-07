import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
interface ProcessStatusBadgeProps {
  status?: string;
  className?: string;
}
export function ProcessStatusBadge({ status, className }: ProcessStatusBadgeProps) {
  const getStatusConfig = (status?: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'available':
      case 'published':
      case 'active':
        return {
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 hover:bg-green-100',
          label: 'Available'
        };
      case 'running':
      case 'in progress':
      case 'busy':
        return {
          variant: 'secondary' as const,
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
          label: 'Running'
        };
      case 'failed':
      case 'error':
      case 'faulted':
        return {
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 hover:bg-red-100',
          label: 'Failed'
        };
      case 'stopped':
      case 'suspended':
      case 'paused':
        return {
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
          label: 'Stopped'
        };
      default:
        return {
          variant: 'outline' as const,
          className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
          label: status || 'Unknown'
        };
    }
  };
  const config = getStatusConfig(status);
  return (
    <Badge
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}