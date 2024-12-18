import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  Pending as PendingIcon,
  Assessment as StatsIcon,
} from '@mui/icons-material';
import { LeaveRequest } from '../types';
import { workflowService } from '../services/workflow';
import DGPECApproval from './DGPECApproval';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const EspaceDGPEC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await workflowService.getRequestsByRole('DGPEC');
      setRequests(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors de la récupération des demandes');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string, comment: string) => {
    try {
      await workflowService.approveRequest(requestId, comment, 'DGPEC');
      await fetchRequests();
    } catch (err) {
      setError('Erreur lors de l\'approbation de la demande');
      console.error('Error approving request:', err);
    }
  };

  const handleReject = async (requestId: string, comment: string) => {
    try {
      await workflowService.rejectRequest(requestId, comment, 'DGPEC');
      await fetchRequests();
    } catch (err) {
      setError('Erreur lors du rejet de la demande');
      console.error('Error rejecting request:', err);
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const processedRequests = requests.filter(r => r.status !== 'PENDING');

  const stats = {
    pending: pendingRequests.length,
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
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PendingIcon color="warning" sx={{ fontSize: 40 }} />
              <Typography variant="h5">{stats.pending}</Typography>
              <Typography color="textSecondary">En attente</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ApprovedIcon color="success" sx={{ fontSize: 40 }} />
              <Typography variant="h5">{stats.approved}</Typography>
              <Typography color="textSecondary">Approuvées</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <RejectedIcon color="error" sx={{ fontSize: 40 }} />
              <Typography variant="h5">{stats.rejected}</Typography>
              <Typography color="textSecondary">Rejetées</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label={`En attente (${pendingRequests.length})`} />
          <Tab label={`Traitées (${processedRequests.length})`} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {pendingRequests.length === 0 ? (
          <Typography variant="body1" color="textSecondary" align="center">
            Aucune demande en attente
          </Typography>
        ) : (
          pendingRequests.map((request) => (
            <DGPECApproval
              key={request.id}
              request={request}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {processedRequests.length === 0 ? (
          <Typography variant="body1" color="textSecondary" align="center">
            Aucune demande traitée
          </Typography>
        ) : (
          processedRequests.map((request) => (
            <DGPECApproval
              key={request.id}
              request={request}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))
        )}
      </TabPanel>
    </Box>
  );
};

export default EspaceDGPEC;
