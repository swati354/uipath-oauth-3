import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProcessStatusBadge } from '../process/ProcessStatusBadge';
import { Play, Settings, Clock, Key, FileText, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
interface ProcessCardProps {
  process: {
    id: string | number;
    name: string;
    key: string;
    description?: string;
    version?: string;
    status?: string;
    lastRun?: string;
  };
  onStart: (processKey: string) => void;
  isStarting?: boolean;
  className?: string;
}
export function ProcessCard({ 
  process, 
  onStart, 
  isStarting = false, 
  className 
}: ProcessCardProps) {
  const handleStart = () => {
    onStart(process.key);
  };
  return (
    <Card className={cn(
      'group relative overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm',
      className
    )}>
      {/* Gradient overlay for visual depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 flex-shrink-0">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 truncate">
                {process.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Key className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <CardDescription className="font-mono text-xs text-muted-foreground truncate">
                  {process.key}
                </CardDescription>
              </div>
            </div>
          </div>
          <ProcessStatusBadge 
            status={process.status || 'available'} 
            showIcon={true}
            className="flex-shrink-0"
          />
        </div>
      </CardHeader>
      <CardContent className="relative space-y-4">
        {/* Description */}
        {process.description && (
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {process.description}
            </p>
          </div>
        )}
        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {process.version && (
              <div className="flex items-center gap-1">
                <Settings className="h-3 w-3" />
                <span>v{process.version}</span>
              </div>
            )}
            {process.lastRun && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{process.lastRun}</span>
              </div>
            )}
          </div>
        </div>
        {/* Action Button */}
        <div className="pt-2">
          <Button
            onClick={handleStart}
            disabled={isStarting}
            className={cn(
              'w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-[1.02]',
              isStarting && 'opacity-50 cursor-not-allowed'
            )}
            size="sm"
          >
            {isStarting ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Starting...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Process
              </>
            )}
          </Button>
        </div>
      </CardContent>
      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-lg border-2 border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </Card>
  );
}