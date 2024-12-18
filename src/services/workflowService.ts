import { WorkflowAction, WorkflowLog, WorkflowState, WorkflowStep } from '../types/workflow';

class WorkflowService {
  private async logAction(
    requestId: string,
    action: WorkflowAction,
    userId: string,
    userName: string,
    userRole: string,
    comment: string,
    metadata?: Record<string, any>
  ): Promise<WorkflowLog> {
    const log: WorkflowLog = {
      id: crypto.randomUUID(),
      requestId,
      action,
      userId,
      userName,
      userRole,
      timestamp: new Date(),
      comment,
      metadata,
    };

    // Enregistrer dans la base de données
    await this.saveLogToDatabase(log);

    // Notifier les parties concernées
    await this.notifyParties(log);

    return log;
  }

  private async saveLogToDatabase(log: WorkflowLog): Promise<void> {
    // Implémentation de la sauvegarde dans la base de données
    const query = `
      INSERT INTO workflow_logs (
        id, request_id, action, user_id, user_name, user_role,
        timestamp, comment, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      log.id,
      log.requestId,
      log.action,
      log.userId,
      log.userName,
      log.userRole,
      log.timestamp,
      log.comment,
      JSON.stringify(log.metadata || {}),
    ];

    try {
      await db.execute(query, values);
    } catch (error) {
      console.error('Error saving workflow log:', error);
      throw new Error('Failed to save workflow log');
    }
  }

  private async notifyParties(log: WorkflowLog): Promise<void> {
    // Récupérer les parties concernées
    const request = await this.getLeaveRequest(log.requestId);
    const notifications: Array<{ userId: string; message: string }> = [];

    switch (log.action) {
      case 'submission':
        notifications.push({
          userId: request.managerId,
          message: `Nouvelle demande de congé de ${request.employeeName} à valider`,
        });
        break;
      case 'manager_approval':
        notifications.push({
          userId: request.dgpecId,
          message: `Demande de congé de ${request.employeeName} approuvée par le manager`,
        });
        break;
      // ... autres cas
    }

    // Envoyer les notifications
    await Promise.all(
      notifications.map((notification) =>
        this.sendNotification(notification.userId, notification.message)
      )
    );
  }

  private determineNextStep(currentStep: WorkflowStep, action: WorkflowAction): WorkflowStep {
    const workflow: Record<WorkflowStep, Record<WorkflowAction, WorkflowStep>> = {
      submitted: {
        manager_approval: 'manager',
        manager_rejection: 'rejected',
      },
      manager: {
        dgpec_approval: 'dgpec',
        dgpec_rejection: 'rejected',
      },
      dgpec: {
        dg_approval: 'completed',
        dg_rejection: 'rejected',
        dg_return_to_dgpec: 'dgpec',
      },
      completed: {},
      rejected: {},
    };

    return workflow[currentStep]?.[action] || currentStep;
  }

  public async getWorkflowState(requestId: string): Promise<WorkflowState> {
    const query = `
      SELECT * FROM workflow_logs
      WHERE request_id = ?
      ORDER BY timestamp ASC
    `;

    try {
      const logs = await db.execute(query, [requestId]);
      const currentStep = this.calculateCurrentStep(logs);

      return {
        currentStep,
        logs,
        lastUpdate: logs[logs.length - 1]?.timestamp || new Date(),
      };
    } catch (error) {
      console.error('Error fetching workflow state:', error);
      throw new Error('Failed to fetch workflow state');
    }
  }

  private calculateCurrentStep(logs: WorkflowLog[]): WorkflowStep {
    if (logs.length === 0) return 'submitted';

    const lastLog = logs[logs.length - 1];
    switch (lastLog.action) {
      case 'manager_rejection':
      case 'dgpec_rejection':
      case 'dg_rejection':
        return 'rejected';
      case 'dg_approval':
        return 'completed';
      case 'manager_approval':
        return 'dgpec';
      case 'dgpec_approval':
        return 'dg';
      case 'dg_return_to_dgpec':
        return 'dgpec';
      default:
        return 'submitted';
    }
  }

  public async submitRequest(
    requestId: string,
    userId: string,
    userName: string,
    comment: string
  ): Promise<void> {
    await this.logAction(
      requestId,
      'submission',
      userId,
      userName,
      'employee',
      comment
    );
  }

  public async approveByManager(
    requestId: string,
    userId: string,
    userName: string,
    comment: string
  ): Promise<void> {
    await this.logAction(
      requestId,
      'manager_approval',
      userId,
      userName,
      'manager',
      comment
    );
  }

  public async approveByDGPEC(
    requestId: string,
    userId: string,
    userName: string,
    comment: string,
    quotaAdjustment?: { type: string; amount: number }
  ): Promise<void> {
    await this.logAction(
      requestId,
      'dgpec_approval',
      userId,
      userName,
      'dgpec',
      comment,
      quotaAdjustment
    );
  }

  public async approveByDG(
    requestId: string,
    userId: string,
    userName: string,
    comment: string
  ): Promise<void> {
    await this.logAction(
      requestId,
      'dg_approval',
      userId,
      userName,
      'dg',
      comment
    );
  }

  public async reject(
    requestId: string,
    userId: string,
    userName: string,
    userRole: string,
    comment: string
  ): Promise<void> {
    const action = `${userRole}_rejection` as WorkflowAction;
    await this.logAction(requestId, action, userId, userName, userRole, comment);
  }

  public async returnToDGPEC(
    requestId: string,
    userId: string,
    userName: string,
    comment: string
  ): Promise<void> {
    await this.logAction(
      requestId,
      'dg_return_to_dgpec',
      userId,
      userName,
      'dg',
      comment
    );
  }
}

export const workflowService = new WorkflowService();
