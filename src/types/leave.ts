export type LeaveType = 
  | 'CONGE_ANNUEL'
  | 'CONGE_MALADIE'
  | 'CONGE_DECES'
  | 'EVENEMENT_FAMILIAL'
  | 'AUTRE';

export type LeaveStatus = 
  | 'EN_ATTENTE_MANAGER'
  | 'VALIDE_MANAGER'
  | 'REFUSE_MANAGER'
  | 'EN_ATTENTE_RH'
  | 'VALIDE_RH'
  | 'REFUSE_RH'
  | 'EN_ATTENTE_DG'
  | 'VALIDE_DG'
  | 'REFUSE_DG'
  | 'ANNULE';

export interface LeaveAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: Date;
}

export interface LeaveComment {
  id: string;
  userId: string;
  userName: string;
  userRole: 'MANAGER' | 'RH' | 'DG';
  comment: string;
  createdAt: Date;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: LeaveType;
  startDate: Date;
  endDate: Date;
  duration: number; // en jours
  reason: string;
  status: LeaveStatus;
  attachments: LeaveAttachment[];
  comments: LeaveComment[];
  managerApproval?: {
    managerId: string;
    managerName: string;
    decision: 'APPROVED' | 'REJECTED';
    comment: string;
    date: Date;
  };
  hrApproval?: {
    hrId: string;
    hrName: string;
    decision: 'APPROVED' | 'REJECTED';
    comment: string;
    date: Date;
  };
  dgApproval?: {
    dgId: string;
    dgName: string;
    decision: 'APPROVED' | 'REJECTED';
    comment: string;
    date: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaveBalance {
  employeeId: string;
  year: number;
  balances: {
    [key in LeaveType]?: {
      total: number;
      used: number;
      remaining: number;
    };
  };
  lastUpdated: Date;
}

export interface LeaveStatistics {
  totalRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  pendingRequests: number;
  requestsByType: {
    [key in LeaveType]: number;
  };
  requestsByDepartment: {
    [department: string]: number;
  };
  periodStart: Date;
  periodEnd: Date;
}
