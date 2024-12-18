import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Grid,
  IconButton,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Edit as EditIcon,
  Assessment as StatsIcon,
} from '@mui/icons-material';
import {
  LeaveRequest,
  LeaveStatistics,
  LeaveType,
  LeaveBalance,
} from '../../../types/leave';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface HRApprovalProps {
  requests: LeaveRequest[];
  statistics: LeaveStatistics;
  onApprove: (requestId: string, comment: string) => void;
  onReject: (requestId: string, comment: string) => void;
  onUpdateQuota: (employeeId: string, updates: Partial<LeaveBalance>) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`hr-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const StatisticsCard = ({ statistics }: { statistics: LeaveStatistics }) => {
  const pieData = Object.entries(statistics.requestsByType).map(
    ([type, count]) => ({
      name: type,
      value: count,
    })
  );

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Aperçu des demandes
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Statistiques globales
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Total des demandes
                </Typography>
                <Typography variant="h4">{statistics.totalRequests}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  En attente
                </Typography>
                <Typography variant="h4">{statistics.pendingRequests}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Approuvées
                </Typography>
                <Typography variant="h4">{statistics.approvedRequests}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Refusées
                </Typography>
                <Typography variant="h4">{statistics.rejectedRequests}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const QuotaDialog = ({
  open,
  onClose,
  employeeId,
  currentBalance,
  onUpdate,
}: {
  open: boolean;
  onClose: () => void;
  employeeId: string;
  currentBalance: LeaveBalance;
  onUpdate: (employeeId: string, updates: Partial<LeaveBalance>) => void;
}) => {
  const [balances, setBalances] = useState(currentBalance.balances);

  const handleUpdate = () => {
    onUpdate(employeeId, { balances });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Ajuster les quotas de congés</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {Object.entries(balances).map(([type, balance]) => (
            <Grid item xs={12} key={type}>
              <Typography variant="subtitle2" gutterBottom>
                {type}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    label="Total"
                    type="number"
                    value={balance.total}
                    onChange={(e) =>
                      setBalances({
                        ...balances,
                        [type]: {
                          ...balance,
                          total: Number(e.target.value),
                          remaining:
                            Number(e.target.value) - balance.used,
                        },
                      })
                    }
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Utilisés"
                    type="number"
                    value={balance.used}
                    disabled
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Restants"
                    type="number"
                    value={balance.remaining}
                    disabled
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleUpdate} variant="contained">
          Mettre à jour
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const HRApproval: React.FC<HRApprovalProps> = ({
  requests,
  statistics,
  onApprove,
  onReject,
  onUpdateQuota,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null
  );
  const [quotaDialog, setQuotaDialog] = useState<{
    open: boolean;
    employeeId: string;
    balance: LeaveBalance;
  } | null>(null);
  const [approvalDialog, setApprovalDialog] = useState<{
    open: boolean;
    action: 'approve' | 'reject';
    requestId: string;
  } | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleApprove = (requestId: string) => {
    setApprovalDialog({
      open: true,
      action: 'approve',
      requestId,
    });
  };

  const handleReject = (requestId: string) => {
    setApprovalDialog({
      open: true,
      action: 'reject',
      requestId,
    });
  };

  const handleQuotaEdit = (employeeId: string, balance: LeaveBalance) => {
    setQuotaDialog({
      open: true,
      employeeId,
      balance,
    });
  };

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Demandes en cours" />
          <Tab label="Statistiques" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Direction</TableCell>
                <TableCell>Employé</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Dates</TableCell>
                <TableCell>Durée</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell>Quotas</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.department}</TableCell>
                  <TableCell>{request.employeeName}</TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>
                    {new Date(request.startDate).toLocaleDateString()} -{' '}
                    {new Date(request.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{request.duration} jours</TableCell>
                  <TableCell>
                    {request.managerApproval && (
                      <Chip
                        label={
                          request.managerApproval.decision === 'APPROVED'
                            ? 'Approuvé'
                            : 'Refusé'
                        }
                        color={
                          request.managerApproval.decision === 'APPROVED'
                            ? 'success'
                            : 'error'
                        }
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleQuotaEdit(request.employeeId, {
                          employeeId: request.employeeId,
                          year: new Date().getFullYear(),
                          balances: {},
                          lastUpdated: new Date(),
                        })
                      }
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ '& > button': { mr: 1 } }}>
                      <IconButton
                        size="small"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="success"
                        size="small"
                        onClick={() => handleApprove(request.id)}
                      >
                        <ApproveIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleReject(request.id)}
                      >
                        <RejectIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <StatisticsCard statistics={statistics} />
      </TabPanel>

      {/* Dialogs */}
      {quotaDialog && (
        <QuotaDialog
          open={quotaDialog.open}
          onClose={() => setQuotaDialog(null)}
          employeeId={quotaDialog.employeeId}
          currentBalance={quotaDialog.balance}
          onUpdate={onUpdateQuota}
        />
      )}

      {/* Approval Dialog */}
      {approvalDialog && (
        <Dialog
          open={approvalDialog.open}
          onClose={() => setApprovalDialog(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {approvalDialog.action === 'approve'
              ? 'Valider la demande'
              : 'Refuser la demande'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Commentaire"
              fullWidth
              multiline
              rows={4}
              required={approvalDialog.action === 'reject'}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setApprovalDialog(null)}>Annuler</Button>
            <Button
              variant="contained"
              color={approvalDialog.action === 'approve' ? 'success' : 'error'}
            >
              Confirmer
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* View Request Details Dialog */}
      {selectedRequest && (
        <Dialog
          open={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Détails de la demande</DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Employé
                </Typography>
                <Typography variant="body1">{selectedRequest.employeeName}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Direction
                </Typography>
                <Typography variant="body1">{selectedRequest.department}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Motif
                </Typography>
                <Typography variant="body1">{selectedRequest.reason}</Typography>
              </Grid>
              {selectedRequest.attachments.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Justificatifs
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {selectedRequest.attachments.map((attachment) => (
                      <Box key={attachment.id} sx={{ mb: 2 }}>
                        <Button
                          variant="outlined"
                          href={attachment.fileUrl}
                          target="_blank"
                          startIcon={<VisibilityIcon />}
                        >
                          {attachment.fileName}
                        </Button>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              )}
              {selectedRequest.comments.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Historique des commentaires
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {selectedRequest.comments.map((comment) => (
                      <Box key={comment.id} sx={{ mb: 2 }}>
                        <Typography variant="subtitle2">
                          {comment.userName} ({comment.userRole})
                        </Typography>
                        <Typography variant="body2">{comment.comment}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(comment.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedRequest(null)}>Fermer</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default HRApproval;
