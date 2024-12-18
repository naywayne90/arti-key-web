import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  TextField,
} from '@mui/material';
import { LeaveRequest } from '../types';

interface DirectionApprovalProps {
  request: LeaveRequest;
  onApprove: (requestId: string, comment: string) => void;
  onReject: (requestId: string, comment: string) => void;
}

const DirectionApproval: React.FC<DirectionApprovalProps> = ({
  request,
  onApprove,
  onReject,
}) => {
  const [comment, setComment] = React.useState('');

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Demande de {request.employeeName}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Du {new Date(request.startDate).toLocaleDateString()} au{' '}
              {new Date(request.endDate).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" paragraph>
              Type: {request.leaveType}
            </Typography>
            <Typography variant="body2" paragraph>
              Motif: {request.reason}
            </Typography>
            <Chip
              label={request.status}
              color={
                request.status === 'APPROVED'
                  ? 'success'
                  : request.status === 'REJECTED'
                  ? 'error'
                  : 'warning'
              }
              sx={{ mt: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              label="Commentaire"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="error"
                onClick={() => onReject(request.id, comment)}
              >
                Rejeter
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => onApprove(request.id, comment)}
              >
                Approuver
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DirectionApproval;
