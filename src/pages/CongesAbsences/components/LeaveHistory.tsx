import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  Paper,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  Send as SubmissionIcon,
  CheckCircle as ValidationIcon,
  Cancel as RejectionIcon,
  Edit as ModificationIcon,
} from '@mui/icons-material';

interface LeaveEvent {
  id: string;
  timestamp: Date;
  type: 'SUBMISSION' | 'VALIDATION' | 'REJECTION' | 'MODIFICATION';
  userRole: 'EMPLOYEE' | 'DIRECTION' | 'DGPEC' | 'DG';
  comment?: string;
  status: string;
}

interface LeaveHistoryProps {
  events: LeaveEvent[];
}

const LeaveHistory: React.FC<LeaveHistoryProps> = ({ events }) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'SUBMISSION':
        return <SubmissionIcon />;
      case 'VALIDATION':
        return <ValidationIcon color="success" />;
      case 'REJECTION':
        return <RejectionIcon color="error" />;
      case 'MODIFICATION':
        return <ModificationIcon color="info" />;
      default:
        return null;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'SUBMISSION':
        return 'primary';
      case 'VALIDATION':
        return 'success';
      case 'REJECTION':
        return 'error';
      case 'MODIFICATION':
        return 'info';
      default:
        return 'default';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'EMPLOYEE':
        return 'Employé';
      case 'DIRECTION':
        return 'Direction';
      case 'DGPEC':
        return 'DGPEC';
      case 'DG':
        return 'DG';
      default:
        return role;
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Historique de la demande
      </Typography>
      <Timeline position="right">
        {events.map((event, index) => (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineDot color={getEventColor(event.type)}>
                {getEventIcon(event.type)}
              </TimelineDot>
              {index < events.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">
                  {event.type === 'SUBMISSION' ? 'Soumission' :
                   event.type === 'VALIDATION' ? 'Validation' :
                   event.type === 'REJECTION' ? 'Rejet' : 'Modification'}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {event.timestamp.toLocaleString()}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Chip
                    size="small"
                    label={getRoleLabel(event.userRole)}
                    color={getEventColor(event.type)}
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    size="small"
                    label={event.status}
                    variant="outlined"
                  />
                </Box>
                {event.comment && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {event.comment}
                  </Typography>
                )}
              </Box>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Paper>
  );
};

export default LeaveHistory;
