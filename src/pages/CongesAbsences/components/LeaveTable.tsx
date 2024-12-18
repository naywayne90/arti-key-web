import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface Column {
  id: string;
  label: string;
}

interface LeaveTableProps {
  columns?: Column[];
}

const LeaveTable: React.FC<LeaveTableProps> = ({ 
  columns = [
    { id: 'type', label: 'Type' },
    { id: 'dateDebut', label: 'Date début' },
    { id: 'dateFin', label: 'Date fin' },
    { id: 'duree', label: 'Durée (jours)' },
    { id: 'statut', label: 'Statut' },
    { id: 'actions', label: 'Actions' },
  ]
}) => {
  // Ces données devraient venir de l'API
  const requests = [
    {
      id: 1,
      type: 'Congé annuel',
      dateDebut: '2024-01-15',
      dateFin: '2024-01-20',
      duree: 5,
      statut: 'En attente',
    },
    {
      id: 2,
      type: 'RTT',
      dateDebut: '2024-02-01',
      dateFin: '2024-02-01',
      duree: 1,
      statut: 'Approuvé',
    },
    {
      id: 3,
      type: 'Congé sans solde',
      dateDebut: '2024-03-10',
      dateFin: '2024-03-15',
      duree: 5,
      statut: 'Refusé',
    },
  ];

  const getStatusColor = (status: string): "success" | "error" | "warning" | "default" => {
    switch (status) {
      case 'Approuvé':
        return 'success';
      case 'Refusé':
        return 'error';
      case 'En attente':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id}>{column.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.type}</TableCell>
              <TableCell>{request.dateDebut}</TableCell>
              <TableCell>{request.dateFin}</TableCell>
              <TableCell>{request.duree}</TableCell>
              <TableCell>
                <Chip
                  label={request.statut}
                  color={getStatusColor(request.statut)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <IconButton size="small" color="primary">
                  <ViewIcon />
                </IconButton>
                {request.statut === 'En attente' && (
                  <>
                    <IconButton size="small" color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
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

export default LeaveTable;
