import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, AlertCircle, Loader2 } from 'lucide-react';
import type { ProcessGetResponse } from 'uipath-sdk';
interface StartProcessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  process: ProcessGetResponse | null;
  onStartProcess: (processKey: string, folderId: number, inputArguments?: Record<string, any>) => Promise<void>;
  isStarting?: boolean;
}
export function StartProcessDialog({
  open,
  onOpenChange,
  process,
  onStartProcess,
  isStarting = false
}: StartProcessDialogProps) {
  const [inputArguments, setInputArguments] = useState<Record<string, string>>({});
  const [jsonInput, setJsonInput] = useState('');
  const [useJsonInput, setUseJsonInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleStart = async () => {
    if (!process) return;
    setError(null);
    try {
      let processInputs: Record<string, any> = {};
      if (useJsonInput && jsonInput.trim()) {
        try {
          processInputs = JSON.parse(jsonInput);
        } catch (e) {
          setError('Invalid JSON format in input arguments');
          return;
        }
      } else {
        // Convert string inputs to appropriate types
        processInputs = Object.entries(inputArguments).reduce((acc, [key, value]) => {
          if (value.trim()) {
            // Try to parse as number or boolean, otherwise keep as string
            if (!isNaN(Number(value))) {
              acc[key] = Number(value);
            } else if (value.toLowerCase() === 'true') {
              acc[key] = true;
            } else if (value.toLowerCase() === 'false') {
              acc[key] = false;
            } else {
              acc[key] = value;
            }
          }
          return acc;
        }, {} as Record<string, any>);
      }
      // Use folderId from process or default to 1
      const folderId = (process as any).folderId || 1;
      await onStartProcess(process.key, folderId, Object.keys(processInputs).length > 0 ? processInputs : undefined);
      // Reset form and close dialog
      setInputArguments({});
      setJsonInput('');
      setUseJsonInput(false);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start process');
    }
  };
  const handleInputChange = (key: string, value: string) => {
    setInputArguments(prev => ({
      ...prev,
      [key]: value
    }));
  };
  const handleClose = () => {
    setInputArguments({});
    setJsonInput('');
    setUseJsonInput(false);
    setError(null);
    onOpenChange(false);
  };
  if (!process) return null;
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            Start Process
          </DialogTitle>
          <DialogDescription>
            Configure and start the process "{process.name}"
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Process Information */}
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Process Key:</span> {process.key}
            </div>
            {process.description && (
              <div className="text-sm text-muted-foreground">
                {process.description}
              </div>
            )}
          </div>
          {/* Input Arguments Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Input Arguments (Optional)</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setUseJsonInput(!useJsonInput)}
                className="text-xs"
              >
                {useJsonInput ? 'Use Form' : 'Use JSON'}
              </Button>
            </div>
            {useJsonInput ? (
              <div className="space-y-2">
                <Textarea
                  placeholder='{"argument1": "value1", "argument2": 123}'
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  className="min-h-[100px] font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Enter input arguments as JSON object
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input
                      placeholder="Argument name"
                      value={Object.keys(inputArguments)[0] || ''}
                      onChange={(e) => {
                        const newKey = e.target.value;
                        const oldKey = Object.keys(inputArguments)[0];
                        if (oldKey && oldKey !== newKey) {
                          const value = inputArguments[oldKey];
                          setInputArguments({ [newKey]: value });
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Value"
                      value={Object.values(inputArguments)[0] || ''}
                      onChange={(e) => {
                        const key = Object.keys(inputArguments)[0] || 'input1';
                        handleInputChange(key, e.target.value);
                      }}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Add input arguments for the process (supports strings, numbers, and booleans)
                </p>
              </div>
            )}
          </div>
          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isStarting}>
            Cancel
          </Button>
          <Button onClick={handleStart} disabled={isStarting}>
            {isStarting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start Process
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}