/**
 * Unified export file for all UiPath hooks
 * Simplifies imports across the application
 */
// Process hooks
export {
  useUiPathProcesses,
  useUiPathProcess,
  useStartProcess
} from '../../hooks/useUiPathProcesses';
// Queue hooks
export {
  useUiPathQueues,
  useUiPathQueue
} from '../../hooks/useUiPathQueues';
// Task hooks
export {
  useUiPathTasks,
  useAssignTask,
  useCompleteTask
} from '../../hooks/useUiPathTasks';
// Asset hooks
export {
  useUiPathAssets,
  useUiPathAsset
} from '../../hooks/useUiPathAssets';
// Maestro hooks
export {
  useUiPathMaestroProcesses,
  useUiPathMaestroInstances,
  useUiPathMaestroInstanceById,
  usePauseMaestroInstance,
  useResumeMaestroInstance,
  useCancelMaestroInstance,
  useUiPathMaestroBpmnDiagram,
  useUiPathMaestroExecutionHistory,
  useUiPathMaestroVariables
} from '../../hooks/useUiPathMaestro';
// Entity hooks
export {
  useUiPathEntities
} from '../../hooks/useUiPathEntities';
export {
  useUiPathEntityRecords
} from '../../hooks/useUiPathEntityRecords';
// Bucket hooks
export {
  useUiPathBuckets
} from '../../hooks/useUiPathBuckets';
export {
  useUiPathBucketFile
} from '../../hooks/useUiPathBucketFile';
// Types
export type {
  ProcessGetResponse,
  QueueGetResponse,
  RawTaskGetResponse,
  AssetGetResponse
} from 'uipath-sdk';