import { api } from '@/services/api';
import { LeaveRequest, LeaveStatus, WorkflowStage } from '../types';

export const WORKFLOW_STAGES: WorkflowStage[] = ['EMPLOYEE', 'DIRECTION', 'DGPEC', 'DG'];

export const workflowService = {
  // Vérifier si l'utilisateur peut approuver une demande
  canApprove: (userRole: string, currentStage: WorkflowStage): boolean => {
    const stageIndex = WORKFLOW_STAGES.indexOf(currentStage);
    const userStageIndex = WORKFLOW_STAGES.indexOf(userRole as WorkflowStage);
    return userStageIndex === stageIndex;
  },

  // Obtenir la prochaine étape du workflow
  getNextStage: (currentStage: WorkflowStage): WorkflowStage | null => {
    const currentIndex = WORKFLOW_STAGES.indexOf(currentStage);
    if (currentIndex < WORKFLOW_STAGES.length - 1) {
      return WORKFLOW_STAGES[currentIndex + 1];
    }
    return null;
  },

  // Approuver une demande
  approveRequest: async (requestId: string, comment: string, userRole: string) => {
    try {
      const response = await api.post(`/api/demandes/${requestId}/approve`, {
        comment,
        userRole
      });
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de l'approbation de la demande");
    }
  },

  // Rejeter une demande
  rejectRequest: async (requestId: string, comment: string, userRole: string) => {
    try {
      const response = await api.post(`/api/demandes/${requestId}/reject`, {
        comment,
        userRole
      });
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors du rejet de la demande");
    }
  },

  // Obtenir les demandes pour un rôle spécifique
  getRequestsByRole: async (userRole: string) => {
    try {
      const response = await api.get<LeaveRequest[]>(`/api/demandes/role/${userRole}`);
      return response.data;
    } catch (error) {
      throw new Error("Erreur lors de la récupération des demandes");
    }
  },

  // Obtenir le statut formaté
  getStatusLabel: (status: LeaveStatus): string => {
    const statusLabels: Record<LeaveStatus, string> = {
      'PENDING': 'En attente',
      'APPROVED': 'Approuvée',
      'REJECTED': 'Rejetée'
    };
    return statusLabels[status] || status;
  },

  // Obtenir la couleur du statut
  getStatusColor: (status: LeaveStatus): string => {
    const statusColors: Record<LeaveStatus, string> = {
      'PENDING': 'warning',
      'APPROVED': 'success',
      'REJECTED': 'error'
    };
    return statusColors[status] || 'default';
  }
};
