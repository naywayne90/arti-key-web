import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import { Typography, Box } from '@mui/material';
import {
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { LeaveComment } from '../types';
import { workflowService } from '../services/workflow';

interface DecisionTimelineProps {
  comments: LeaveComment[];
}

const DecisionTimeline: React.FC<DecisionTimelineProps> = ({ comments }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <ApprovedIcon color="success" />;
      case 'REJECTED':
        return <RejectedIcon color="error" />;
      default:
        return <PendingIcon color="warning" />;
    }
  };

  return (
    <Timeline>
      {comments.map((comment, index) => (
        <TimelineItem key={index}>
          <TimelineSeparator>
            <TimelineDot color={comment.status === 'APPROVED' ? 'success' : comment.status === 'REJECTED' ? 'error' : 'warning'}>
              {getStatusIcon(comment.status)}
            </TimelineDot>
            {index < comments.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent>
            <Box sx={{ mb: 1 }}>
              <Typography variant="subtitle2">
                {comment.userRole} - {new Date(comment.timestamp).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {comment.comment}
              </Typography>
            </Box>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default DecisionTimeline;
