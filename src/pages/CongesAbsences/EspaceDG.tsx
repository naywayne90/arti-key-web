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
  CloudDownload as ExportIcon,
} from '@mui/icons-material';

interface LeaveRequest {
  id: string;
  employeeName: string;
  department: string;
  type: string;
  startDate: Date;
  endDate: Date;
  status: string;
  managerApproval: {
    status: string;
    date: Date;
    comment?: string;
  };
  dgpecApproval: {
    status: string;
    date: Date;
    comment?: string;
  };
}

const EspaceDG: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [approvalDialog, setApprovalDialog] = useState(false);
  const [comment, setComment] = useState('');

  // Mock data - à remplacer par les données réelles de l'API
  const requests: LeaveRequest[] = [
    {
      id: '1',
      employeeName: 'John Doe',
      department: 'IT',
      type: 'Congé annuel',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-20'),
      status: 'Validé par DGPEC',
      managerApproval: {
        status: 'Approuvé',
        date: new Date('2024-01-10'),
        comment: 'OK pour moi',
      },
      dgpecApproval: {
        status: 'Approuvé',
        date: new Date('2024-01-12'),
        comment: 'Quotas vérifiés',
      },
    },
    {
      id: '2',
      employeeName: 'Jane Smith',
      department: 'RH',
      type: 'Congé sans solde',
      startDate: new Date('2024-12-20'),
      endDate: new Date('2025-01-05'),
      status: 'EN_ATTENTE_DG',
      managerApproval: {
        status: 'VALIDE',
        date: new Date('2024-12-09'),
      },
      dgpecApproval: {
        status: 'VALIDE',
        date: new Date('2024-12-10'),
      },
    },
  ];

  const handleApproval = (approved: boolean) => {
    // Logique d'approbation à implémenter
    setApprovalDialog(false);
    setComment('');
    setSelectedRequest(null);
  };

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'Approuvé':
        return 'success';
      case 'Refusé':
        return 'error';
      case 'Validé par DGPEC':
        return 'info';
      case 'VALIDE':
        return 'success';
      case 'EN_ATTENTE_DG':
        return 'warning';
      default:
        return 'warning';
    }
  };

  return (
    <Box p={3}>
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>
              Validation finale des congés (DG)
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              sx={{ mr: 1 }}
            >
              Exporter
            </Button>
            <Button variant="outlined" startIcon={<StatsIcon />}>
              Tableau de bord
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
                <TableCell>Validation Manager</TableCell>
                <TableCell>Validation DGPEC</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
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
                      label={request.managerApproval.status}
                      color={getStatusChipColor(request.managerApproval.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={request.dgpecApproval.status}
                      color={getStatusChipColor(request.dgpecApproval.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={request.status}
                      color={getStatusChipColor(request.status)}
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
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Validation Manager
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedRequest?.managerApproval.comment}
            </Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Validation DGPEC
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedRequest?.dgpecApproval.comment}
            </Typography>
          </Box>
          <TextField
            autoFocus
            margin="dense"
            label="Votre commentaire"
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

export default EspaceDG;
