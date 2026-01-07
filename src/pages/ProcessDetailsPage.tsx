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
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <div className="absolute inset-0 h-8 w-8 rounded-full border-2 border-primary/20"></div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium text-foreground">Loading process details</h3>
                  <p className="text-sm text-muted-foreground">Please wait while we fetch the information...</p>
                </div>
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
            <div className="flex items-center justify-center min-h-[60vh]">
              <Alert variant="destructive" className="max-w-md border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error Loading Process</AlertTitle>
                <AlertDescription className="mt-2">
                  {(error as Error).message}
                </AlertDescription>
              </Alert>
            </div>
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
            <div className="text-center space-y-6 max-w-md mx-auto">
              <div className="rounded-full bg-muted p-6 w-20 h-20 mx-auto">
                <AlertCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">Process Not Found</h1>
                <p className="text-muted-foreground">
                  The requested process could not be found or may have been removed.
                </p>
              </div>
              <Button onClick={handleBack} variant="outline" className="hover:bg-secondary">
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
          <div className="mb-8 space-y-6">
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleBack} 
                variant="outline" 
                size="sm"
                className="hover:bg-secondary transition-colors duration-200"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Process Details</h1>
              </div>
            </div>
            {/* Process Overview Card */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div>
                      <CardTitle className="text-xl text-foreground">{selectedProcess.name}</CardTitle>
                      <CardDescription className="text-sm font-mono text-muted-foreground mt-1">
                        {selectedProcess.key}
                      </CardDescription>
                    </div>
                    {selectedProcess.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                        {selectedProcess.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge variant="outline" className="font-mono bg-secondary/50">
                      v{selectedProcess.processVersion || 'N/A'}
                    </Badge>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">
                      Available
                    </Badge>
                    <Button
                      onClick={() => setShowStartDialog(true)}
                      disabled={isStartingProcess}
                      className="bg-primary hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
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
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger value="configuration" className="flex items-center gap-2 data-[state=active]:bg-background">
                <Settings className="h-4 w-4" />
                Configuration
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2 data-[state=active]:bg-background">
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