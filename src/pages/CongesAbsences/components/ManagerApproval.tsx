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
  Chip,
  IconButton,
  Box,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
} from '@mui/icons-material';
import { LeaveRequest, LeaveAttachment } from '../../../types/leave';

interface ManagerApprovalProps {
  requests: LeaveRequest[];
  onApprove: (requestId: string, comment: string) => void;
  onReject: (requestId: string, comment: string) => void;
}

interface ApprovalDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => void;
  title: string;
  action: 'approve' | 'reject';
}

const ApprovalDialog: React.FC<ApprovalDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  action,
}) => {
  const [comment, setComment] = useState('');

  const handleConfirm = () => {
    onConfirm(comment);
    setComment('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
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
          required
          error={action === 'reject' && !comment}
          helperText={
            action === 'reject' && !comment
              ? 'Un commentaire est obligatoire pour un refus'
              : ''
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={action === 'approve' ? 'success' : 'error'}
          disabled={action === 'reject' && !comment}
        >
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ManagerApproval: React.FC<ManagerApprovalProps> = ({
  requests,
  onApprove,
  onReject,
}) => {
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(
    null
  );
  const [approvalDialog, setApprovalDialog] = useState<{
    open: boolean;
    action: 'approve' | 'reject';
    requestId: string;
  } | null>(null);

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

  const handleConfirmDialog = (comment: string) => {
    if (!approvalDialog) return;

    if (approvalDialog.action === 'approve') {
      onApprove(approvalDialog.requestId, comment);
    } else {
      onReject(approvalDialog.requestId, comment);
    }
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Employé</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Date début</TableCell>
              <TableCell>Date fin</TableCell>
              <TableCell>Durée</TableCell>
              <TableCell>Justificatifs</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.employeeName}</TableCell>
                <TableCell>{request.type}</TableCell>
                <TableCell>
                  {new Date(request.startDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(request.endDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{request.duration} jours</TableCell>
                <TableCell>
                  {request.attachments.length > 0 && (
                    <IconButton
                      size="small"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ '& > button': { mr: 1 } }}>
                    <IconButton
                      color="success"
                      onClick={() => handleApprove(request.id)}
                    >
                      <ApproveIcon />
                    </IconButton>
                    <IconButton
                      color="error"
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

      {/* Dialog pour voir les justificatifs */}
      <Dialog
        open={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Justificatifs</DialogTitle>
        <DialogContent>
          {selectedRequest?.attachments.map((attachment) => (
            <Box key={attachment.id} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">{attachment.fileName}</Typography>
              {attachment.fileType.startsWith('image/') ? (
                <img
                  src={attachment.fileUrl}
                  alt={attachment.fileName}
                  style={{ maxWidth: '100%', maxHeight: 400 }}
                />
              ) : (
                <Button
                  variant="outlined"
                  href={attachment.fileUrl}
                  target="_blank"
                >
                  Voir le document
                </Button>
              )}
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedRequest(null)}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour la validation/refus */}
      {approvalDialog && (
        <ApprovalDialog
          open={approvalDialog.open}
          onClose={() => setApprovalDialog(null)}
          onConfirm={handleConfirmDialog}
          title={
            approvalDialog.action === 'approve'
              ? 'Valider la demande'
              : 'Refuser la demande'
          }
          action={approvalDialog.action}
        />
      )}
    </>
  );
};

export default ManagerApproval;
