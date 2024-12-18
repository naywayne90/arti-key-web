export type LeaveStatus = 
  | 'DRAFT'
  | 'PENDING_DIRECTION'
  | 'PENDING_DG'
  | 'PENDING_DGPEC'
  | 'PENDING_DG_FINAL'
  | 'APPROVED'
  | 'REJECTED';

export type LeaveEventType = 
  | 'SUBMISSION'
  | 'VALIDATION'
  | 'REJECTION'
  | 'MODIFICATION';

export type UserRole = 
  | 'EMPLOYEE'
  | 'DIRECTION'
  | 'DG'
  | 'DGPEC';

export interface LeaveEvent {
  id?: string;
  type: LeaveEventType;
  userRole: UserRole;
  timestamp: Date;
  comment?: string;
  status: LeaveStatus;
}

export interface LeaveRequest {
  id: string;
  requesterName: string;
  requesterId: string;
  requesterRole: UserRole;
  department: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  reason: string;
  status: LeaveStatus;
  previousStatus?: LeaveStatus;
  lastUpdated: Date;
  createdAt: Date;
  attachments?: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    uploadedAt: Date;
  }>;
}

export interface LeaveQuota {
  id: string;
  userId: string;
  year: number;
  baseQuota: number;
  additionalQuota: number;
  usedQuota: number;
  remainingQuota: number;
  lastUpdated: Date;
}
