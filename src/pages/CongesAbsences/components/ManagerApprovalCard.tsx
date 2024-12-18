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
  Fade,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Check as ApproveIcon,
  Close as RejectIcon,
  Visibility as ViewIcon,
  Description as FileIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { formatPeriod } from '../../../utils/dateUtils';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';

// Workaround for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  type: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  files: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  reason?: string;
  createdAt: Date;
}

interface DecisionHistory {
  id: string;
  requestId: string;
  employeeName: string;
  decision: 'approved' | 'rejected';
  comment: string;
  decidedAt: Date;
}

interface ManagerApprovalCardProps {
  pendingRequests: LeaveRequest[];
  decisionHistory: DecisionHistory[];
  onApprove: (requestId: string, comment: string) => Promise<void>;
  onReject: (requestId: string, comment: string) => Promise<void>;
}

export const ManagerApprovalCard: React.FC<ManagerApprovalCardProps> = ({
  pendingRequests,
  decisionHistory,
  onApprove,
  onReject,
}) => {
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [comment, setComment] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ url: string; type: string } | null>(null);

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
    <Card elevation={2}>
      <CardHeader
        title="Validation des Demandes"
        action={
          <Tooltip title="Historique des décisions">
            <IconButton onClick={() => setShowHistory(true)}>
              <HistoryIcon />
            </IconButton>
          </Tooltip>
        }
      />
      <CardContent>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Demandeur</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Période</TableCell>
                <TableCell>Justificatifs</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pendingRequests.map((request) => (
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
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {request.files.map((file, index) => (
                        <Tooltip key={index} title={file.name}>
                          <IconButton
                            size="small"
                            onClick={() => setSelectedFile({ url: file.url, type: file.type })}
                          >
                            <FileIcon />
                          </IconButton>
                        </Tooltip>
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Voir les détails">
                        <IconButton
                          size="small"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Approuver">
                        <IconButton
                          color="success"
                          size="small"
                          onClick={() => setSelectedRequest(request)}
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
              ))}
              {pendingRequests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="text.secondary" py={3}>
                      Aucune demande en attente
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

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
              <TextField
                label="Commentaire"
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
              startIcon={isProcessing && <CircularProgress size={20} />}
            >
              Rejeter
            </Button>
            <Button
              onClick={() => handleDecision('approve')}
              color="success"
              disabled={!comment.trim() || isProcessing}
              startIcon={isProcessing && <CircularProgress size={20} />}
            >
              Approuver
            </Button>
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
                    <TableCell>Décision</TableCell>
                    <TableCell>Commentaire</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {decisionHistory.map((decision) => (
                    <TableRow key={decision.id}>
                      <TableCell>
                        {decision.decidedAt.toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell>{decision.employeeName}</TableCell>
                      <TableCell>
                        <Fade in>
                          <Typography
                            color={
                              decision.decision === 'approved'
                                ? 'success.main'
                                : 'error.main'
                            }
                          >
                            {decision.decision === 'approved'
                              ? 'Approuvée'
                              : 'Rejetée'}
                          </Typography>
                        </Fade>
                      </TableCell>
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

        {/* Dialog de prévisualisation des fichiers */}
        <Dialog
          open={!!selectedFile}
          onClose={() => setSelectedFile(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Prévisualisation du Document</DialogTitle>
          <DialogContent>
            {renderFilePreview()}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedFile(null)}>Fermer</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ManagerApprovalCard;
