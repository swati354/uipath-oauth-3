import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ProcessTable } from '@/components/process/ProcessTable';
import { ProcessFilters } from '@/components/process/ProcessFilters';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { useUiPathProcesses, useStartProcess } from '@/lib/uipath/hooks';
import { initializeUiPathSDK } from '@/lib/uipath';
import { Activity, AlertCircle, Loader2, Settings, Zap } from 'lucide-react';
import { toast } from 'sonner';
import type { ProcessGetResponse } from 'uipath-sdk';
export function HomePage() {
  // SDK initialization state
  const [sdkInitialized, setSdkInitialized] = useState(false);
  const [sdkError, setSdkError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [folderFilter, setFolderFilter] = useState('all');
  // UiPath hooks - only enabled after SDK initialization
  const { 
    data: processes = [], 
    isLoading: processesLoading, 
    error: processesError,
    refetch: refetchProcesses 
  } = useUiPathProcesses(undefined, sdkInitialized);
  const { mutateAsync: startProcess, isPending: isStartingProcess } = useStartProcess();
  // Initialize UiPath SDK on component mount
  useEffect(() => {
    const initSDK = async () => {
      try {
        setIsInitializing(true);
        setSdkError(null);
        console.log('🚀 Initializing UiPath SDK...');
        await initializeUiPathSDK();
        setSdkInitialized(true);
        console.log('✅ UiPath SDK initialized successfully');
        toast.success('Connected to UiPath Orchestrator');
      } catch (error) {
        console.error('❌ Failed to initialize UiPath SDK:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setSdkError(errorMessage);
        toast.error('Failed to connect to UiPath Orchestrator');
      } finally {
        setIsInitializing(false);
      }
    };
    initSDK();
  }, []);
  // Filter processes based on search and filter criteria
  const filteredProcesses = React.useMemo(() => {
    return processes.filter((process: ProcessGetResponse) => {
      // Search filter
      const matchesSearch = !searchTerm || 
        process.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        process.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        process.key?.toLowerCase().includes(searchTerm.toLowerCase());
      // Status filter (for now, all processes are considered "available")
      const matchesStatus = statusFilter === 'all' || statusFilter === 'available';
      // Folder filter (simplified for now)
      const matchesFolder = folderFilter === 'all';
      return matchesSearch && matchesStatus && matchesFolder;
    });
  }, [processes, searchTerm, statusFilter, folderFilter]);
  // Handle process start
  const handleStartProcess = useCallback(async (
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
      // Refresh the processes list
      refetchProcesses();
    } catch (error) {
      console.error('❌ Failed to start process:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start process';
      toast.error(errorMessage);
      throw error;
    }
  }, [startProcess, refetchProcesses]);
  // Handle refresh
  const handleRefresh = useCallback(() => {
    refetchProcesses();
    toast.info('Refreshing processes...');
  }, [refetchProcesses]);
  // Retry SDK initialization
  const retryInitialization = useCallback(() => {
    setSdkInitialized(false);
    setSdkError(null);
    setIsInitializing(true);
    // Re-run initialization
    const initSDK = async () => {
      try {
        await initializeUiPathSDK();
        setSdkInitialized(true);
        toast.success('Connected to UiPath Orchestrator');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setSdkError(errorMessage);
        toast.error('Failed to connect to UiPath Orchestrator');
      } finally {
        setIsInitializing(false);
      }
    };
    initSDK();
  }, []);
  // Show initialization loading state
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background">
        <ThemeToggle />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
              <div className="flex items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <Activity className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-foreground">Connecting to UiPath Orchestrator</h1>
                <p className="text-muted-foreground">
                  Initializing SDK and establishing connection...
                </p>
              </div>
            </div>
          </div>
        </div>
        <Toaster richColors closeButton />
      </div>
    );
  }
  // Show SDK initialization error
  if (sdkError) {
    return (
      <div className="min-h-screen bg-background">
        <ThemeToggle />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
              <Alert variant="destructive" className="max-w-md">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Connection Failed</AlertTitle>
                <AlertDescription className="mt-2">
                  {sdkError}
                </AlertDescription>
              </Alert>
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Please check your UiPath Orchestrator configuration and try again.
                </p>
                <Button onClick={retryInitialization} variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Retry Connection
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Toaster richColors closeButton />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          {/* Header */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Activity className="h-8 w-8 text-primary" />
                <Zap className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">UiPath Process Monitor</h1>
                <p className="text-muted-foreground">
                  Monitor and manage your automation processes from UiPath Orchestrator
                </p>
              </div>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Processes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{processes.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Available</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{filteredProcesses.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Filtered Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{filteredProcesses.length}</div>
                </CardContent>
              </Card>
            </div>
          </div>
          {/* Filters */}
          <ProcessFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            folderFilter={folderFilter}
            onFolderFilterChange={setFolderFilter}
            onRefresh={handleRefresh}
            isRefreshing={processesLoading}
            className="mb-6"
          />
          {/* Error Alert */}
          {processesError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Processes</AlertTitle>
              <AlertDescription>
                {(processesError as Error).message}
              </AlertDescription>
            </Alert>
          )}
          {/* Loading State */}
          {processesLoading && !processesError && (
            <Card className="mb-6">
              <CardContent className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="text-muted-foreground">Loading processes...</span>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Process Table */}
          {!processesLoading && !processesError && (
            <ProcessTable
              processes={filteredProcesses}
              onStartProcess={handleStartProcess}
              isStarting={isStartingProcess}
            />
          )}
          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © Powered by UiPath
            </p>
          </footer>
        </div>
      </div>
      <Toaster richColors closeButton />
    </div>
  );
}