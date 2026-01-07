/**
 * UiPath Dashboard Page
 *
 * Main dashboard showing overview of processes, queues, and tasks
 */
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ProcessCard } from '@/components/uipath/ProcessCard';
import { QueueMonitor } from '@/components/uipath/QueueMonitor';
import { TaskCard } from '@/components/uipath/TaskCard';
import { useUiPathProcesses, useStartProcess } from '@/hooks/useUiPathProcesses';
import { useUiPathQueues } from '@/hooks/useUiPathQueues';
import { useUiPathTasks, useAssignTask, useCompleteTask } from '@/hooks/useUiPathTasks';
import { AlertCircle, Activity, Zap, BarChart3, CheckSquare, Loader2 } from 'lucide-react';
import { TaskType } from 'uipath-sdk';
export function DashboardPage() {
  const { data: processes, isLoading: processesLoading, error: processesError } = useUiPathProcesses();
  const { data: queues, isLoading: queuesLoading, error: queuesError } = useUiPathQueues();
  const { data: tasks, isLoading: tasksLoading, error: tasksError } = useUiPathTasks();
  const { mutate: startProcess, isPending: isStartingProcess } = useStartProcess();
  const { mutate: assignTask, isPending: isAssigningTask } = useAssignTask();
  const { mutate: completeTask, isPending: isCompletingTask } = useCompleteTask();
  const handleStartProcess = (processKey: string) => {
    // Use default folderId of 1 if not specified
    const folderId = 1;
    startProcess({ processKey, folderId });
  };
  const handleAssignTask = (taskId: string) => {
    // Convert string taskId to number
    const numericTaskId = parseInt(taskId, 10);
    if (isNaN(numericTaskId)) {
      console.error('Invalid task ID:', taskId);
      return;
    }
    // In a real app, you'd have a dialog to select the user
    // For demo purposes, we'll use a placeholder email
    assignTask({ taskId: numericTaskId, userNameOrEmail: 'user@example.com' });
  };
  const handleCompleteTask = (taskId: string) => {
    // Convert string taskId to number
    const numericTaskId = parseInt(taskId, 10);
    if (isNaN(numericTaskId)) {
      console.error('Invalid task ID:', taskId);
      return;
    }
    // In a real app, you'd have a form to collect task data
    // For demo purposes, we'll just complete with empty data
    completeTask({
      taskId: numericTaskId,
      type: TaskType.External,
      folderId: 1
    });
  };
  const LoadingSkeleton = ({ count = 3 }: { count?: number }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="animate-pulse border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-muted rounded-lg" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-2/3" />
            <div className="h-8 bg-muted rounded w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
  const EmptyState = ({ 
    icon: Icon, 
    title, 
    description 
  }: { 
    icon: React.ElementType; 
    title: string; 
    description: string; 
  }) => (
    <div className="col-span-full text-center py-16">
      <div className="rounded-full bg-muted p-6 w-20 h-20 mx-auto mb-6">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  );
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <main className="space-y-8">
            {/* Header */}
            <header className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                  <Activity className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">UiPath Automation Dashboard</h1>
                  <p className="text-muted-foreground mt-1">
                    Monitor and manage your UiPath Orchestrator processes, queues, and tasks
                  </p>
                </div>
              </div>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Zap className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Processes</CardTitle>
                        <div className="text-2xl font-bold text-foreground">
                          {processesLoading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                          ) : (
                            processes?.length || 0
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100">
                        <BarChart3 className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Queues</CardTitle>
                        <div className="text-2xl font-bold text-foreground">
                          {queuesLoading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                          ) : (
                            queues?.length || 0
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-100">
                        <CheckSquare className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Tasks</CardTitle>
                        <div className="text-2xl font-bold text-foreground">
                          {tasksLoading ? (
                            <Loader2 className="h-6 w-6 animate-spin" />
                          ) : (
                            tasks?.length || 0
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </header>
            {/* Tabs for different sections */}
            <Tabs defaultValue="processes" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-lg">
                <TabsTrigger 
                  value="processes" 
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Processes
                </TabsTrigger>
                <TabsTrigger 
                  value="queues" 
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Queues
                </TabsTrigger>
                <TabsTrigger 
                  value="tasks" 
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all duration-200"
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Tasks
                </TabsTrigger>
              </TabsList>
              {/* Processes Tab */}
              <TabsContent value="processes" className="space-y-6">
                {processesError && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error Loading Processes</AlertTitle>
                    <AlertDescription>
                      Failed to load processes: {(processesError as Error).message}
                    </AlertDescription>
                  </Alert>
                )}
                {processesLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {processes && processes.length > 0 ? (
                      processes.map((process: any) => (
                        <ProcessCard
                          key={process.id}
                          process={{
                            id: process.id,
                            name: process.name,
                            key: process.key,
                            description: process.description,
                            version: process.processVersion,
                            status: 'available'
                          }}
                          onStart={handleStartProcess}
                          isStarting={isStartingProcess}
                        />
                      ))
                    ) : (
                      <EmptyState
                        icon={Zap}
                        title="No processes found"
                        description="Create processes in UiPath Orchestrator to see them here."
                      />
                    )}
                  </div>
                )}
              </TabsContent>
              {/* Queues Tab */}
              <TabsContent value="queues" className="space-y-6">
                {queuesError && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error Loading Queues</AlertTitle>
                    <AlertDescription>
                      Failed to load queues: {(queuesError as Error).message}
                    </AlertDescription>
                  </Alert>
                )}
                {queuesLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {queues && queues.length > 0 ? (
                      queues.map((queue: any) => (
                        <QueueMonitor
                          key={queue.id}
                          queue={{
                            id: queue.id,
                            name: queue.name,
                            description: queue.description,
                            itemCounts: {
                              new: queue.newItemsCount || 0,
                              inProgress: queue.inProgressItemsCount || 0,
                              failed: queue.failedItemsCount || 0,
                              successful: queue.successfulItemsCount || 0,
                            },
                          }}
                        />
                      ))
                    ) : (
                      <EmptyState
                        icon={BarChart3}
                        title="No queues found"
                        description="Create queues in UiPath Orchestrator to see them here."
                      />
                    )}
                  </div>
                )}
              </TabsContent>
              {/* Tasks Tab */}
              <TabsContent value="tasks" className="space-y-6">
                {tasksError && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error Loading Tasks</AlertTitle>
                    <AlertDescription>
                      Failed to load tasks: {(tasksError as Error).message}
                    </AlertDescription>
                  </Alert>
                )}
                {tasksLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks && tasks.length > 0 ? (
                      tasks.map((task: any) => (
                        <TaskCard
                          key={task.id}
                          task={{
                            id: task.id,
                            title: task.title || task.name || 'Untitled Task',
                            description: task.description,
                            priority: task.priority || 'Medium',
                            status: task.status || 'Pending',
                            dueDate: task.dueDate,
                            assignee: task.assignee,
                          }}
                          onAssign={handleAssignTask}
                          onComplete={handleCompleteTask}
                          isAssigning={isAssigningTask}
                          isCompleting={isCompletingTask}
                        />
                      ))
                    ) : (
                      <EmptyState
                        icon={CheckSquare}
                        title="No tasks found"
                        description="Create tasks in UiPath Action Center to see them here."
                      />
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </main>
          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © Powered by UiPath
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}