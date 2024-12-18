import React, { useState } from 'react';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Paper,
  CircularProgress,
  TableContainer
} from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Demande {
  id: string;
  typeDemande: string;
  dateDebut: string;
  dateFin: string;
  statut: string;
  commentaire?: string;
  justificatif?: string;
  nombreJours: number;
}

const typeDemandeLabels: { [key: string]: string } = {
  CONGE_ANNUEL: 'Congé annuel',
  MALADIE: 'Maladie',
  EVENEMENT_FAMILIAL: 'Événement familial',
  AUTRE: 'Autres'
};

const statutColors: { [key: string]: string } = {
  EN_ATTENTE: '#ffd700',
  VALIDE: '#4caf50',
  REJETE: '#f44336'
};

const statutLabels: { [key: string]: string } = {
  EN_ATTENTE: 'En attente',
  VALIDE: 'Validée',
  REJETE: 'Rejetée'
};

interface DemandesListProps {
  demandes: Demande[];
  isLoading: boolean;
}

const DemandesList: React.FC<DemandesListProps> = ({ demandes = [], isLoading = false }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState<Demande | null>(null);

  const handleRowClick = (demande: Demande) => {
    setSelectedDemande(demande);
    setOpenDialog(true);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  const demandesList = Array.isArray(demandes) ? demandes : [];

  if (demandesList.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Aucune demande trouvée</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Période</TableCell>
              <TableCell>Jours</TableCell>
              <TableCell>Statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {demandesList.map((demande) => (
              <TableRow
                key={demande.id}
                onClick={() => handleRowClick(demande)}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
              >
                <TableCell>{typeDemandeLabels[demande.typeDemande] || demande.typeDemande}</TableCell>
                <TableCell>
                  {format(new Date(demande.dateDebut), 'dd/MM/yyyy', { locale: fr })} -{' '}
                  {format(new Date(demande.dateFin), 'dd/MM/yyyy', { locale: fr })}
                </TableCell>
                <TableCell>{demande.nombreJours} jour(s)</TableCell>
                <TableCell>
                  <Chip
                    label={statutLabels[demande.statut] || demande.statut}
                    sx={{
                      backgroundColor: statutColors[demande.statut],
                      color: 'white'
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Détails de la demande
        </DialogTitle>
        <DialogContent>
          {selectedDemande && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Type : {typeDemandeLabels[selectedDemande.typeDemande]}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Période : {format(new Date(selectedDemande.dateDebut), 'dd/MM/yyyy', { locale: fr })} -{' '}
                {format(new Date(selectedDemande.dateFin), 'dd/MM/yyyy', { locale: fr })}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Nombre de jours : {selectedDemande.nombreJours} jour(s)
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Statut : {statutLabels[selectedDemande.statut]}
              </Typography>
              {selectedDemande.commentaire && (
                <Typography variant="subtitle1" gutterBottom>
                  Commentaire : {selectedDemande.commentaire}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DemandesList;
