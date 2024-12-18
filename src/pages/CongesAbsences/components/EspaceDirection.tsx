import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Pending as PendingIcon,
  Assessment as StatsIcon,
} from '@mui/icons-material';
import DirectionApproval from './DirectionApproval';
import { LeaveRequest } from '../types';

const EspaceDirection = () => {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<LeaveRequest[]>([
    {
      id: '1',
      employeeName: 'John Doe',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      leaveType: 'Congé annuel',
      reason: 'Vacances d\'été',
      status: 'PENDING',
      workflow: 'DIRECTION',
    },
    // Ajoutez d'autres demandes de test ici
  ]);

  const handleApprove = async (requestId: string, comment: string) => {
    setLoading(true);
    try {
      // TODO: Appeler l'API pour approuver la demande
      console.log('Approving request:', requestId, 'with comment:', comment);
      setRequests(requests.map(req =>
        req.id === requestId ? { ...req, status: 'APPROVED' } : req
      ));
    } catch (error) {
      console.error('Error approving request:', error);
    }
    setLoading(false);
  };

  const handleReject = async (requestId: string, comment: string) => {
    setLoading(true);
    try {
      // TODO: Appeler l'API pour rejeter la demande
      console.log('Rejecting request:', requestId, 'with comment:', comment);
      setRequests(requests.map(req =>
        req.id === requestId ? { ...req, status: 'REJECTED' } : req
      ));
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
    setLoading(false);
  };

  const stats = {
    pending: requests.filter(r => r.status === 'PENDING').length,
    approved: requests.filter(r => r.status === 'APPROVED').length,
    rejected: requests.filter(r => r.status === 'REJECTED').length,
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PendingIcon color="warning" sx={{ fontSize: 40 }} />
              <Typography variant="h5">{stats.pending}</Typography>
              <Typography color="textSecondary">En attente</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ApprovedIcon color="success" sx={{ fontSize: 40 }} />
              <Typography variant="h5">{stats.approved}</Typography>
              <Typography color="textSecondary">Approuvées</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <RejectedIcon color="error" sx={{ fontSize: 40 }} />
              <Typography variant="h5">{stats.rejected}</Typography>
              <Typography color="textSecondary">Rejetées</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <StatsIcon color="info" sx={{ fontSize: 40 }} />
              <Typography variant="h5">
                {stats.approved + stats.rejected + stats.pending}
              </Typography>
              <Typography color="textSecondary">Total</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box>
        {requests
          .filter(request => request.status === 'PENDING')
          .map(request => (
            <DirectionApproval
              key={request.id}
              request={request}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
      </Box>
    </Box>
  );
};

export default EspaceDirection;
