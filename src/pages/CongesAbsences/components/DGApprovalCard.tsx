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
  Chip,
  Grid,
  Collapse,
  Alert,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Check as ApproveIcon,
  Close as RejectIcon,
  Undo as ReturnIcon,
  Description as FileIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { Document, Page } from 'react-pdf';
import { formatPeriod } from '../../../utils/dateUtils';
import DecisionTimeline from './DecisionTimeline';

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: string;
  startDate: Date;
  endDate: Date;
  workingDays: number;
  status: string;
  reason?: string;
  files: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  decisions: Array<{
    id: string;
    step: 'submission' | 'manager' | 'dgpec' | 'dg';
    status: 'pending' | 'approved' | 'rejected' | 'returned';
    decidedBy: string;
    comment: string;
    timestamp: Date;
  }>;
}

interface DGApprovalCardProps {
  pendingRequests: LeaveRequest[];
  onApprove: (requestId: string, comment: string) => Promise<void>;
  onReject: (requestId: string, comment: string) => Promise<void>;
  onReturn: (requestId: string, comment: string) => Promise<void>;
  onNotify: (employeeId: string, message: string) => Promise<void>;
}

export const DGApprovalCard: React.FC<DGApprovalCardProps> = ({
  pendingRequests,
  onApprove,
  onReject,
  onReturn,
  onNotify,
}) => {
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [comment, setComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ url: string; type: string } | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleDecision = async (decision: 'approve' | 'reject' | 'return') => {
    if (!selectedRequest || !comment.trim()) return;

    setIsProcessing(true);
    try {
      switch (decision) {
        case 'approve':
          await onApprove(selectedRequest.id, comment);
          await onNotify(
            selectedRequest.employeeId,
            `Votre demande de congé a été approuvée par la Direction Générale.`
          );
          break;
        case 'reject':
          await onReject(selectedRequest.id, comment);
          await onNotify(
            selectedRequest.employeeId,
            `Votre demande de congé a été rejetée par la Direction Générale.`
          );
          break;
        case 'return':
          await onReturn(selectedRequest.id, comment);
          await onNotify(
            selectedRequest.employeeId,
            `Votre demande de congé a été retournée pour modification.`
          );
          break;
      }

      setNotification({
        type: 'success',
        message: 'Décision enregistrée avec succès',
      });
      setSelectedRequest(null);
      setComment('');
    } catch (error) {
      setNotification({
        type: 'error',
        message: "Une erreur s'est produite lors du traitement de la décision",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderFilePreview = (file: { url: string; type: string }) => {
    if (file.type.startsWith('image/')) {
      return (
        <Box
          component="img"
          src={file.url}
          alt="Document"
          sx={{
            maxWidth: '100%',
            maxHeight: 100,
            objectFit: 'contain',
            borderRadius: 1,
          }}
        />
      );
    }

    if (file.type === 'application/pdf') {
      return (
        <Box sx={{ height: 100 }}>
          <Document file={file.url}>
            <Page pageNumber={1} height={100} />
          </Document>
        </Box>
      );
    }

    return (
      <Paper
        variant="outlined"
        sx={{
          p: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <FileIcon />
        <Typography variant="caption" noWrap>
          {file.name}
        </Typography>
      </Paper>
    );
  };

  return (
    <Box>
      {notification && (
        <Fade in>
          <Alert
            severity={notification.type}
            sx={{ mb: 2 }}
            onClose={() => setNotification(null)}
          >
            {notification.message}
          </Alert>
        </Fade>
      )}

      <Card>
        <CardHeader title="Validation Direction Générale" />
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" />
                  <TableCell>Demandeur</TableCell>
                  <TableCell>Département</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Période</TableCell>
                  <TableCell>Statut</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingRequests.map((request) => (
                  <React.Fragment key={request.id}>
                    <TableRow
                      sx={{
                        '&:hover': { backgroundColor: 'action.hover' },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <TableCell padding="checkbox">
                        <IconButton
                          size="small"
                          onClick={() =>
                            setExpandedRow(
                              expandedRow === request.id ? null : request.id
                            )
                          }
                        >
                          {expandedRow === request.id ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </TableCell>
                      <TableCell>{request.employeeName}</TableCell>
                      <TableCell>{request.department}</TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>
                        {formatPeriod(request.startDate, request.endDate)}
                        <Typography variant="caption" display="block" color="text.secondary">
                          {request.workingDays} jours ouvrables
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={request.status}
                          color={
                            request.status === 'En attente'
                              ? 'warning'
                              : request.status === 'Approuvé'
                              ? 'success'
                              : 'error'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
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
                          <Tooltip title="Retourner à la DGPEC">
                            <IconButton
                              color="info"
                              size="small"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <ReturnIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={7} sx={{ py: 0 }}>
                        <Collapse in={expandedRow === request.id}>
                          <Box sx={{ py: 2 }}>
                            <Grid container spacing={3}>
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Détails de la demande
                                </Typography>
                                {request.reason && (
                                  <Box sx={{ mb: 2 }}>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      Motif
                                    </Typography>
                                    <Typography>{request.reason}</Typography>
                                  </Box>
                                )}
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                  gutterBottom
                                >
                                  Pièces jointes
                                </Typography>
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  sx={{
                                    overflowX: 'auto',
                                    pb: 1,
                                  }}
                                >
                                  {request.files.map((file, index) => (
                                    <Zoom
                                      key={index}
                                      in
                                      style={{
                                        transitionDelay: `${index * 100}ms`,
                                      }}
                                    >
                                      <Box
                                        onClick={() =>
                                          setSelectedFile({
                                            url: file.url,
                                            type: file.type,
                                          })
                                        }
                                        sx={{ cursor: 'pointer' }}
                                      >
                                        {renderFilePreview(file)}
                                      </Box>
                                    </Zoom>
                                  ))}
                                </Stack>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" gutterBottom>
                                  Historique des décisions
                                </Typography>
                                <DecisionTimeline decisions={request.decisions} />
                              </Grid>
                            </Grid>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog de décision */}
      <Dialog
        open={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Décision - Demande de {selectedRequest?.employeeName}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
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
                  label="Votre commentaire"
                  multiline
                  rows={4}
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
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Historique des décisions
              </Typography>
              <DecisionTimeline decisions={selectedRequest?.decisions || []} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedRequest(null)}>Annuler</Button>
          <Button
            onClick={() => handleDecision('return')}
            color="info"
            disabled={!comment.trim() || isProcessing}
          >
            Retourner à la DGPEC
          </Button>
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

      {/* Dialog de prévisualisation des fichiers */}
      <Dialog
        open={!!selectedFile}
        onClose={() => setSelectedFile(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Prévisualisation du Document</DialogTitle>
        <DialogContent>
          <Box sx={{ maxWidth: '100%', maxHeight: '80vh', overflow: 'auto' }}>
            {selectedFile?.type.startsWith('image/') ? (
              <img
                src={selectedFile.url}
                alt="Document"
                style={{ maxWidth: '100%' }}
              />
            ) : (
              <Document file={selectedFile?.url}>
                <Page pageNumber={1} width={600} />
              </Document>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedFile(null)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DGApprovalCard;
