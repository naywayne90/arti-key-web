import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  Typography,
  Paper,
  Box,
  Fade,
  useTheme,
} from '@mui/material';
import {
  Person as EmployeeIcon,
  SupervisorAccount as ManagerIcon,
  Business as DGPECIcon,
  AccountBalance as DGIcon,
  Check as ApproveIcon,
  Close as RejectIcon,
  Undo as ReturnIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { WorkflowLog, WorkflowAction } from '../types/workflow';

interface WorkflowTimelineProps {
  logs: WorkflowLog[];
  highlightLatest?: boolean;
}

const ACTION_ICONS: Record<WorkflowAction, React.ElementType> = {
  submission: EmployeeIcon,
  manager_approval: ApproveIcon,
  manager_rejection: RejectIcon,
  dgpec_approval: ApproveIcon,
  dgpec_rejection: RejectIcon,
  dgpec_quota_adjustment: EditIcon,
  dg_approval: ApproveIcon,
  dg_rejection: RejectIcon,
  dg_return_to_dgpec: ReturnIcon,
};

const ROLE_ICONS: Record<string, React.ElementType> = {
  employee: EmployeeIcon,
  manager: ManagerIcon,
  dgpec: DGPECIcon,
  dg: DGIcon,
};

const ACTION_LABELS: Record<WorkflowAction, string> = {
  submission: 'Soumission de la demande',
  manager_approval: 'Approbation du manager',
  manager_rejection: 'Rejet du manager',
  dgpec_approval: 'Approbation DGPEC',
  dgpec_rejection: 'Rejet DGPEC',
  dgpec_quota_adjustment: 'Ajustement des quotas',
  dg_approval: 'Approbation Direction Générale',
  dg_rejection: 'Rejet Direction Générale',
  dg_return_to_dgpec: 'Retour à la DGPEC',
};

const ACTION_COLORS: Record<WorkflowAction, string> = {
  submission: 'info.main',
  manager_approval: 'success.main',
  manager_rejection: 'error.main',
  dgpec_approval: 'success.main',
  dgpec_rejection: 'error.main',
  dgpec_quota_adjustment: 'warning.main',
  dg_approval: 'success.main',
  dg_rejection: 'error.main',
  dg_return_to_dgpec: 'warning.main',
};

export const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({
  logs,
  highlightLatest = true,
}) => {
  const theme = useTheme();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <Timeline position="right">
      {logs.map((log, index) => {
        const ActionIcon = ACTION_ICONS[log.action];
        const RoleIcon = ROLE_ICONS[log.userRole];
        const isLatest = index === logs.length - 1;

        return (
          <Fade
            key={log.id}
            in
            timeout={500}
            style={{
              transitionDelay: `${index * 100}ms`,
            }}
          >
            <TimelineItem>
              <TimelineOppositeContent>
                <Typography
                  variant="body2"
                  color={isLatest && highlightLatest ? 'primary' : 'text.secondary'}
                >
                  {formatDate(log.timestamp)}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot
                  sx={{
                    bgcolor: ACTION_COLORS[log.action],
                    ...(isLatest && highlightLatest
                      ? {
                          boxShadow: `0 0 0 3px ${theme.palette.background.paper}, 0 0 0 6px ${theme.palette.primary.light}`,
                        }
                      : {}),
                  }}
                >
                  <ActionIcon />
                </TimelineDot>
                {index < logs.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                <Paper
                  elevation={isLatest && highlightLatest ? 3 : 1}
                  sx={{
                    p: 2,
                    ...(isLatest && highlightLatest
                      ? {
                          borderLeft: `4px solid ${theme.palette.primary.main}`,
                        }
                      : {}),
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <RoleIcon
                      fontSize="small"
                      color={isLatest && highlightLatest ? 'primary' : 'action'}
                    />
                    <Typography
                      variant="subtitle2"
                      color={
                        isLatest && highlightLatest ? 'primary.main' : 'text.primary'
                      }
                    >
                      {ACTION_LABELS[log.action]}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    par {log.userName}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      color: isLatest && highlightLatest ? 'text.primary' : 'text.secondary',
                    }}
                  >
                    {log.comment}
                  </Typography>
                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Informations supplémentaires :
                      </Typography>
                      <Box
                        component="pre"
                        sx={{
                          mt: 0.5,
                          p: 1,
                          bgcolor: 'action.hover',
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          overflow: 'auto',
                        }}
                      >
                        {JSON.stringify(log.metadata, null, 2)}
                      </Box>
                    </Box>
                  )}
                </Paper>
              </TimelineContent>
            </TimelineItem>
          </Fade>
        );
      })}
    </Timeline>
  );
};

export default WorkflowTimeline;
