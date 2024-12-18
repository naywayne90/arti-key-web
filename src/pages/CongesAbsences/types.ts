export type UserRole = 'EMPLOYEE' | 'DIRECTION' | 'DGPEC' | 'DG';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type WorkflowStage = 'EMPLOYEE' | 'DIRECTION' | 'DGPEC' | 'DG';

export interface LeaveRequest {
  id: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
  status: LeaveStatus;
  workflow: WorkflowStage;
  comments?: Array<{
    author: string;
    text: string;
    timestamp: string;
  }>;
}
