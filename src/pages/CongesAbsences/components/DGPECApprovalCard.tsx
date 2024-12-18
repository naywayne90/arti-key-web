import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Typography,
  Box,
  Stack,
  IconButton,
  Tooltip,
  Divider,
  Grid,
  Alert,
} from '@mui/material';
import {
  Check as ApproveIcon,
  Close as RejectIcon,
  Edit as EditIcon,
  History as HistoryIcon,
  Description as FileIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { Document, Page } from 'react-pdf';
import { formatPeriod } from '../../../utils/dateUtils';
import LeaveStatistics from './LeaveStatistics';

interface EmployeeQuota {
  employeeId: string;
  employeeName: string;
  quotas: {
    type: string;
    total: number;
    used: number;
    remaining: number;
  }[];
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  startDate: Date;
  endDate: Date;
  workingDays: number;
  status: 'manager_approved' | 'dgpec_approved' | 'dgpec_rejected';
  files: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  managerComment: string;
  managerApprovalDate: Date;
  reason?: string;
}

interface DecisionHistory {
  requestId: string;
  employeeName: string;
  type: string;
  decision: string;
  decidedBy: string;
  comment: string;
  timestamp: Date;
}

interface DGPECApprovalCardProps {
  pendingRequests: LeaveRequest[];
  employeeQuotas: EmployeeQuota[];
  decisionHistory: DecisionHistory[];
  stats: {
    totalRequests: number;
    approved: number;
    rejected: number;
    byType: Array<{ type: string; count: number }>;
  };
  onApprove: (requestId: string, comment: string) => Promise<void>;
  onReject: (requestId: string, comment: string) => Promise<void>;
  onQuotaAdjust: (
    employeeId: string,
    type: string,
    adjustment: number,
    reason: string
  ) => Promise<void>;
}

export const DGPECApprovalCard: React.FC<DGPECApprovalCardProps> = ({
  pendingRequests,
  employeeQuotas,
  decisionHistory,
  stats,
  onApprove,
  onReject,
  onQuotaAdjust,
}) => {
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ url: string; type: string } | null>(null);
  const [comment, setComment] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [showQuotaDialog, setShowQuotaDialog] = useState(false);
  const [selectedQuota, setSelectedQuota] = useState<{
    employeeId: string;
    type: string;
    current: number;
  } | null>(null);
  const [quotaAdjustment, setQuotaAdjustment] = useState('');
  const [quotaReason, setQuotaReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDecision = async (decision: 'approve' | 'reject') => {
    if (!selectedRequest || !comment.trim()) return;

    setIsProcessing(true);
    try {
      if (decision === 'approve') {
        await onApprove(selectedRequest.id, comment);
      } else {
        await onReject(selectedRequest.id, comment);
      }
      setSelectedRequest(null);
      setComment('');
    } catch (error) {
      console.error('Error processing decision:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuotaAdjust = async () => {
    if (!selectedQuota || !quotaReason.trim() || !quotaAdjustment) return;

    setIsProcessing(true);
    try {
      await onQuotaAdjust(
        selectedQuota.employeeId,
        selectedQuota.type,
        Number(quotaAdjustment),
        quotaReason
      );
      setShowQuotaDialog(false);
      setSelectedQuota(null);
      setQuotaAdjustment('');
      setQuotaReason('');
    } catch (error) {
      console.error('Error adjusting quota:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderFilePreview = () => {
    if (!selectedFile) return null;

    if (selectedFile.type.startsWith('image/')) {
      return (
        <Box sx={{ maxWidth: '100%', maxHeight: '500px', overflow: 'auto' }}>
          <img src={selectedFile.url} alt="Document" style={{ maxWidth: '100%' }} />
        </Box>
      );
    }

    if (selectedFile.type === 'application/pdf') {
      return (
        <Box sx={{ maxWidth: '100%', maxHeight: '500px', overflow: 'auto' }}>
          <Document file={selectedFile.url}>
            <Page pageNumber={1} width={600} />
          </Document>
        </Box>
      );
    }

    return (
      <Typography color="text.secondary">
        Type de fichier non pris en charge pour la prévisualisation
      </Typography>
    );
  };

  return (
    <Box sx={{ mb: 4 }}>
      <LeaveStatistics stats={stats} />
      
      <Card sx={{ mt: 4 }}>
        <CardHeader
          title="Validation DGPEC"
          action={
            <Stack direction="row" spacing={1}>
              <Tooltip title="Historique des décisions">
                <IconButton onClick={() => setShowHistory(true)}>
                  <HistoryIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Gérer les quotas">
                <IconButton onClick={() => setShowQuotaDialog(true)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          }
        />
        <Divider />
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Demandeur</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Période</TableCell>
                  <TableCell>Quota Restant</TableCell>
                  <TableCell>Justificatifs</TableCell>
                  <TableCell>Décision Manager</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingRequests.map((request) => {
                  const employeeQuota = employeeQuotas.find(
                    (q) => q.employeeId === request.employeeId
                  );
                  const quota = employeeQuota?.quotas.find(
                    (q) => q.type === request.type
                  );

                  return (
                    <TableRow
                      key={request.id}
                      sx={{
                        '&:hover': { backgroundColor: 'action.hover' },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <TableCell>{request.employeeName}</TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>
                        {formatPeriod(request.startDate, request.endDate)}
                        <Typography variant="caption" display="block" color="text.secondary">
                          {request.workingDays} jours ouvrables
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {quota ? (
                          <Typography
                            color={
                              quota.remaining < request.workingDays
                                ? 'error'
                                : 'success'
                            }
                          >
                            {quota.remaining} jours
                          </Typography>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          {request.files.map((file, index) => (
                            <Tooltip key={index} title={file.name}>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  setSelectedFile({
                                    url: file.url,
                                    type: file.type,
                                  })
                                }
                              >
                                <FileIcon />
                              </IconButton>
                            </Tooltip>
                          ))}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={request.managerComment}>
                          <Box>
                            <Typography variant="body2">
                              Approuvé le{' '}
                              {request.managerApprovalDate.toLocaleDateString('fr-FR')}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}
                            >
                              {request.managerComment}
                            </Typography>
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="Voir l'historique">
                            <IconButton
                              size="small"
                              onClick={() => setShowHistory(true)}
                            >
                              <TimelineIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Approuver">
                            <IconButton
                              color="success"
                              size="small"
                              onClick={() => setSelectedRequest(request)}
                              disabled={
                                quota
                                  ? quota.remaining < request.workingDays
                                  : false
                              }
                            >
                              <ApproveIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Rejeter">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <RejectIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {pendingRequests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="text.secondary" py={3}>
                        Aucune demande en attente de validation
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog de décision */}
      <Dialog
        open={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Décision - Demande de {selectedRequest?.employeeName}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Type de congé
              </Typography>
              <Typography>{selectedRequest?.type}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Période
              </Typography>
              <Typography>
                {selectedRequest &&
                  formatPeriod(selectedRequest.startDate, selectedRequest.endDate)}
              </Typography>
            </Box>
            {selectedRequest?.reason && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Motif
                </Typography>
                <Typography>{selectedRequest.reason}</Typography>
              </Box>
            )}
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Commentaire du manager
              </Typography>
              <Typography>{selectedRequest?.managerComment}</Typography>
            </Box>
            <TextField
              label="Votre commentaire"
              multiline
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              fullWidth
              error={!comment.trim()}
              helperText={
                !comment.trim() && 'Un commentaire est requis pour la décision'
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedRequest(null)}>Annuler</Button>
          <Button
            onClick={() => handleDecision('reject')}
            color="error"
            disabled={!comment.trim() || isProcessing}
          >
            Rejeter
          </Button>
          <Button
            onClick={() => handleDecision('approve')}
            color="success"
            disabled={!comment.trim() || isProcessing}
          >
            Approuver
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de gestion des quotas */}
      <Dialog
        open={showQuotaDialog}
        onClose={() => setShowQuotaDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Gestion des Quotas</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            {employeeQuotas.map((employee) => (
              <Grid item xs={12} key={employee.employeeId}>
                <Typography variant="h6" gutterBottom>
                  {employee.employeeName}
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Type de congé</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="right">Utilisé</TableCell>
                        <TableCell align="right">Restant</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {employee.quotas.map((quota) => (
                        <TableRow key={quota.type}>
                          <TableCell>{quota.type}</TableCell>
                          <TableCell align="right">{quota.total}</TableCell>
                          <TableCell align="right">{quota.used}</TableCell>
                          <TableCell align="right">{quota.remaining}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() =>
                                setSelectedQuota({
                                  employeeId: employee.employeeId,
                                  type: quota.type,
                                  current: quota.total,
                                })
                              }
                            >
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowQuotaDialog(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog d'ajustement de quota */}
      <Dialog
        open={!!selectedQuota}
        onClose={() => setSelectedQuota(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Ajuster le Quota</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Alert severity="info">
              Quota actuel : {selectedQuota?.current} jours
            </Alert>
            <TextField
              label="Ajustement (+ ou -)"
              type="number"
              value={quotaAdjustment}
              onChange={(e) => setQuotaAdjustment(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Motif de l'ajustement"
              multiline
              rows={3}
              value={quotaReason}
              onChange={(e) => setQuotaReason(e.target.value)}
              required
              fullWidth
              error={!quotaReason.trim()}
              helperText={
                !quotaReason.trim() &&
                'Un motif est requis pour ajuster le quota'
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedQuota(null)}>Annuler</Button>
          <Button
            onClick={handleQuotaAdjust}
            color="primary"
            disabled={!quotaReason.trim() || !quotaAdjustment || isProcessing}
          >
            Valider l'ajustement
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de prévisualisation des fichiers */}
      <Dialog
        open={!!selectedFile}
        onClose={() => setSelectedFile(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Prévisualisation du Document</DialogTitle>
        <DialogContent>{renderFilePreview()}</DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedFile(null)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog d'historique */}
      <Dialog
        open={showHistory}
        onClose={() => setShowHistory(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Historique des Décisions</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Employé</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Décision</TableCell>
                  <TableCell>Par</TableCell>
                  <TableCell>Commentaire</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {decisionHistory.map((decision, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {decision.timestamp.toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>{decision.employeeName}</TableCell>
                    <TableCell>{decision.type}</TableCell>
                    <TableCell>{decision.decision}</TableCell>
                    <TableCell>{decision.decidedBy}</TableCell>
                    <TableCell>{decision.comment}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHistory(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DGPECApprovalCard;
