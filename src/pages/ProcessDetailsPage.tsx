import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ProcessExecutionHistory } from '@/components/process/ProcessExecutionHistory';
import { ProcessConfiguration } from '@/components/process/ProcessConfiguration';
import { StartProcessDialog } from '@/components/process/StartProcessDialog';
import { useUiPathProcesses, useStartProcess } from '@/lib/uipath/hooks';
import { ArrowLeft, Play, Settings, History, AlertCircle, Loader2, Activity } from 'lucide-react';
import { toast } from 'sonner';
import type { ProcessGetResponse } from 'uipath-sdk';
export function ProcessDetailsPage() {
  const { processId } = useParams<{ processId: string }>();
  const navigate = useNavigate();
  const [selectedProcess, setSelectedProcess] = useState<ProcessGetResponse | null>(null);
  const [showStartDialog, setShowStartDialog] = useState(false);
  const { data: processes, isLoading, error } = useUiPathProcesses();
  const { mutateAsync: startProcess, isPending: isStartingProcess } = useStartProcess();
  // Find the process by ID from the processes list
  useEffect(() => {
    if (processes && processId) {
      const process = processes.find(p => p.id?.toString() === processId);
      setSelectedProcess(process || null);
    }
  }, [processes, processId]);
  const handleStartProcess = async (
    processKey: string,
    folderId: number,
    inputArguments?: Record<string, any>
  ) => {
    try {
      console.log('🚀 Starting process:', { processKey, folderId, inputArguments });
      const result = await startProcess({
        processKey,
        folderId
      });
      console.log('✅ Process started successfully:', result);
      toast.success(`Process "${processKey}" started successfully`);
    } catch (error) {
      console.error('❌ Failed to start process:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start process';
      toast.error(errorMessage);
      throw error;
    }
  };
  const handleBack = () => {
    navigate('/');
  };
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="flex items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="text-muted-foreground">Loading process details...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <Alert variant="destructive" className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Process</AlertTitle>
              <AlertDescription>
                {(error as Error).message}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }
  if (!selectedProcess) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <div className="text-center space-y-4">
              <h1 className="text-2xl font-bold text-foreground">Process Not Found</h1>
              <p className="text-muted-foreground">
                The requested process could not be found.
              </p>
              <Button onClick={handleBack} variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          {/* Header */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-4">
              <Button onClick={handleBack} variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Process Details</h1>
              </div>
            </div>
            {/* Process Overview Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{selectedProcess.name}</CardTitle>
                    <CardDescription className="text-sm font-mono text-muted-foreground">
                      {selectedProcess.key}
                    </CardDescription>
                    {selectedProcess.description && (
                      <p className="text-sm text-muted-foreground">
                        {selectedProcess.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono">
                      v{selectedProcess.version || 'N/A'}
                    </Badge>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Available
                    </Badge>
                    <Button
                      onClick={() => setShowStartDialog(true)}
                      disabled={isStartingProcess}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Start Process
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
          {/* Tabs for different sections */}
          <Tabs defaultValue="configuration" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="configuration" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configuration
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Execution History
              </TabsTrigger>
            </TabsList>
            <TabsContent value="configuration" className="space-y-6">
              <ProcessConfiguration process={selectedProcess} />
            </TabsContent>
            <TabsContent value="history" className="space-y-6">
              <ProcessExecutionHistory processKey={selectedProcess.key} />
            </TabsContent>
          </Tabs>
          {/* Start Process Dialog */}
          <StartProcessDialog
            open={showStartDialog}
            onOpenChange={setShowStartDialog}
            process={selectedProcess}
            onStartProcess={handleStartProcess}
            isStarting={isStartingProcess}
          />
        </div>
      </div>
    </div>
  );
}