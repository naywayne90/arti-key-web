import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Leave, LeaveStatus } from '../../../types/leave';

interface LeavesListProps {
  filter: 'MY_REQUESTS' | 'TO_APPROVE' | 'HISTORY';
}

const getStatusColor = (status: LeaveStatus) => {
  switch (status) {
    case 'EN_ATTENTE':
      return 'warning';
    case 'APPROUVE':
      return 'success';
    case 'REFUSE':
      return 'error';
    case 'ANNULE':
      return 'default';
    default:
      return 'default';
  }
};

const LeavesList: React.FC<LeavesListProps> = ({ filter }) => {
  // TODO: Implement actual data fetching based on filter
  const leaves: Leave[] = [];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Date début</TableCell>
            <TableCell>Date fin</TableCell>
            <TableCell>Durée (jours)</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leaves.map((leave) => (
            <TableRow key={leave.id}>
              <TableCell>{leave.type}</TableCell>
              <TableCell>
                {new Date(leave.startDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(leave.endDate).toLocaleDateString()}
              </TableCell>
              <TableCell>{leave.duration}</TableCell>
              <TableCell>
                <Chip
                  label={leave.status}
                  color={getStatusColor(leave.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Tooltip title="Voir les détails">
                  <IconButton size="small">
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
                {leave.status === 'EN_ATTENTE' && (
                  <>
                    <Tooltip title="Modifier">
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LeavesList;
