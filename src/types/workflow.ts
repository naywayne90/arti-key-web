export type WorkflowAction =
  | 'submission'
  | 'manager_approval'
  | 'manager_rejection'
  | 'dgpec_approval'
  | 'dgpec_rejection'
  | 'dgpec_quota_adjustment'
  | 'dg_approval'
  | 'dg_rejection'
  | 'dg_return_to_dgpec';

export type WorkflowStep = 'submitted' | 'manager' | 'dgpec' | 'dg' | 'completed' | 'rejected';

export interface WorkflowLog {
  id: string;
  requestId: string;
  action: WorkflowAction;
  userId: string;
  userName: string;
  userRole: string;
  timestamp: Date;
  comment: string;
  metadata?: Record<string, any>;
}

export interface WorkflowState {
  currentStep: WorkflowStep;
  logs: WorkflowLog[];
  lastUpdate: Date;
}

export interface LeaveRequestWorkflow {
  id: string;
  requestId: string;
  state: WorkflowState;
  createdAt: Date;
  updatedAt: Date;
}
