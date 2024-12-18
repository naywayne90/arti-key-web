import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from '@mui/material';
import {
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Pending as PendingIcon,
  Assessment as StatsIcon,
} from '@mui/icons-material';
import { LeaveRequest } from '../types';
import { workflowService } from '../services/workflow';
import DecisionTimeline from './DecisionTimeline';

interface DGApprovalProps {
  request: LeaveRequest;
  onApprove: (requestId: string, comment: string) => Promise<void>;
  onReject: (requestId: string, comment: string) => Promise<void>;
}

const DGApproval: React.FC<DGApprovalProps> = ({
  request,
  onApprove,
  onReject,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    if (!action) return;

    setLoading(true);
    try {
      if (action === 'approve') {
        await onApprove(request.id, comment);
      } else {
        await onReject(request.id, comment);
      }
      setOpenDialog(false);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              {request.employeeName}
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Type: {request.leaveType}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Du {new Date(request.startDate).toLocaleDateString()} au{' '}
              {new Date(request.endDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {request.reason}
            </Typography>
            {request.comments && <DecisionTimeline comments={request.comments} />}
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="success"
                startIcon={<ApprovedIcon />}
                onClick={() => {
                  setAction('approve');
                  setOpenDialog(true);
                }}
                disabled={request.status !== 'PENDING'}
              >
                Approuver
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<RejectedIcon />}
                onClick={() => {
                  setAction('reject');
                  setOpenDialog(true);
                }}
                disabled={request.status !== 'PENDING'}
              >
                Rejeter
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {action === 'approve' ? 'Approuver la demande' : 'Rejeter la demande'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Commentaire"
            fullWidth
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button
            onClick={handleAction}
            color={action === 'approve' ? 'success' : 'error'}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : action === 'approve' ? (
              'Confirmer l\'approbation'
            ) : (
              'Confirmer le rejet'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default DGApproval;
