import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Check as ApproveIcon,
  Close as RejectIcon,
  RemoveRedEye as ViewIcon,
  CalendarToday as CalendarIcon,
  Assessment as StatsIcon,
} from '@mui/icons-material';
import LeaveCalendar from './components/LeaveCalendar';

interface LeaveRequest {
  id: string;
  employeeName: string;
  type: string;
  startDate: Date;
  endDate: Date;
  status: string;
  department: string;
  comments?: string;
  attachments?: string[];
}

const EspaceManager: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'requests' | 'calendar' | 'stats'>(
    'requests'
  );
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [approvalDialog, setApprovalDialog] = useState(false);
  const [comment, setComment] = useState('');

  // Mock data - à remplacer par les données réelles de l'API
  const pendingRequests: LeaveRequest[] = [
    {
      id: '1',
      employeeName: 'John Doe',
      type: 'Congé annuel',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-20'),
      status: 'En attente',
      department: 'IT',
      comments: 'Congés d\'été',
      attachments: ['justificatif.pdf'],
    },
    {
      id: '2',
      employeeName: 'Jane Smith',
      type: 'Congé maladie',
      startDate: new Date('2024-12-20'),
      endDate: new Date('2024-12-22'),
      status: 'EN_ATTENTE',
      department: 'IT',
      comments: 'Certificat médical joint',
    },
  ];

  const handleApproval = (approved: boolean) => {
    // Logique d'approbation à implémenter
    setApprovalDialog(false);
    setComment('');
    setSelectedRequest(null);
  };

  return (
    <Box p={3}>
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>
              Validation des demandes de congés
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
            <Button
              variant="outlined"
              startIcon={<CalendarIcon />}
              sx={{ mr: 1 }}
            >
              Calendrier
            </Button>
            <Button variant="outlined" startIcon={<StatsIcon />}>
              Statistiques
            </Button>
          </Grid>
        </Grid>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employé</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Période</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.employeeName}</TableCell>
                  <TableCell>{request.department}</TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>
                    {request.startDate.toLocaleDateString()} -{' '}
                    {request.endDate.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={request.status}
                      color={
                        request.status === 'Approuvé'
                          ? 'success'
                          : request.status === 'Refusé'
                          ? 'error'
                          : 'warning'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setSelectedRequest(request);
                        setApprovalDialog(true);
                      }}
                    >
                      <ViewIcon />
                    </IconButton>
                    <IconButton
                      color="success"
                      onClick={() => {
                        setSelectedRequest(request);
                        setApprovalDialog(true);
                      }}
                    >
                      <ApproveIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setSelectedRequest(request);
                        setApprovalDialog(true);
                      }}
                    >
                      <RejectIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={approvalDialog} onClose={() => setApprovalDialog(false)}>
        <DialogTitle>
          {selectedRequest?.employeeName} - {selectedRequest?.type}
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
          <Button onClick={() => setApprovalDialog(false)}>Annuler</Button>
          <Button onClick={() => handleApproval(true)} color="success">
            Approuver
          </Button>
          <Button onClick={() => handleApproval(false)} color="error">
            Refuser
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EspaceManager;
