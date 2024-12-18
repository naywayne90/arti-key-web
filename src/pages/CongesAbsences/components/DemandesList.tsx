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
  Link,
  CircularProgress,
  TableContainer
} from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { artiColors } from '@/theme/artiTheme';

interface Demande {
  id: string;
  typeDemande: string;
  dateDebut: string;
  dateFin: string;
  statut: string;
  commentaire?: string;
  justificatif?: string;
  nombreJours: number;
  detailsJours: Array<{
    date: string;
    type: 'ouvrable' | 'weekend' | 'ferie';
    description?: string;
  }>;
}

const typeDemandeLabels: { [key: string]: string } = {
  CONGE_ANNUEL: 'Congé annuel',
  MALADIE: 'Maladie',
  EVENEMENT_FAMILIAL: 'Événement familial',
  AUTRE: 'Autres'
};

const statutColors: { [key: string]: string } = {
  EN_ATTENTE: artiColors.yellow.main,
  VALIDE: artiColors.green.main,
  REJETE: artiColors.red.main
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

const DemandesList: React.FC<DemandesListProps> = ({ demandes, isLoading }) => {
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

  if (!demandes.length) {
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
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {demandes.map((demande) => (
              <TableRow
                key={demande.id}
                hover
                onClick={() => handleRowClick(demande)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>{typeDemandeLabels[demande.typeDemande]}</TableCell>
                <TableCell>
                  {format(new Date(demande.dateDebut), 'dd/MM/yyyy', { locale: fr })} -{' '}
                  {format(new Date(demande.dateFin), 'dd/MM/yyyy', { locale: fr })}
                </TableCell>
                <TableCell>{demande.nombreJours} jour(s)</TableCell>
                <TableCell>
                  <Chip
                    label={statutLabels[demande.statut]}
                    sx={{
                      bgcolor: `${statutColors[demande.statut]}20`,
                      color: statutColors[demande.statut],
                      fontWeight: 'medium'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRowClick(demande);
                    }}
                  >
                    Détails
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Détails de la demande</DialogTitle>
        <DialogContent>
          {selectedDemande && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Type de demande</strong>
                <Typography component="span" ml={1}>
                  {typeDemandeLabels[selectedDemande.typeDemande]}
                </Typography>
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                <strong>Période</strong>
                <Typography component="span" ml={1}>
                  Du {format(new Date(selectedDemande.dateDebut), 'dd MMMM yyyy', { locale: fr })} au{' '}
                  {format(new Date(selectedDemande.dateFin), 'dd MMMM yyyy', { locale: fr })}
                </Typography>
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                <strong>Nombre de jours</strong>
                <Typography component="span" ml={1}>
                  {selectedDemande.nombreJours} jour(s)
                </Typography>
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                <strong>Statut</strong>
                <Chip
                  label={statutLabels[selectedDemande.statut]}
                  sx={{
                    ml: 1,
                    bgcolor: `${statutColors[selectedDemande.statut]}20`,
                    color: statutColors[selectedDemande.statut],
                    fontWeight: 'medium'
                  }}
                />
              </Typography>

              {selectedDemande.commentaire && (
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Commentaire</strong>
                  <Typography component="p" mt={1}>
                    {selectedDemande.commentaire}
                  </Typography>
                </Typography>
              )}

              {selectedDemande.justificatif && (
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Justificatif</strong>
                  <Box mt={1}>
                    <Link
                      href={selectedDemande.justificatif}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Voir le justificatif
                    </Link>
                  </Box>
                </Typography>
              )}

              {selectedDemande.detailsJours && (
                <Box mt={2}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Détail des jours</strong>
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Description</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedDemande.detailsJours.map((jour, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {format(new Date(jour.date), 'dd/MM/yyyy', { locale: fr })}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={
                                  jour.type === 'ouvrable'
                                    ? 'Ouvrable'
                                    : jour.type === 'weekend'
                                    ? 'Weekend'
                                    : 'Férié'
                                }
                                size="small"
                                color={
                                  jour.type === 'ouvrable'
                                    ? 'primary'
                                    : jour.type === 'weekend'
                                    ? 'default'
                                    : 'secondary'
                                }
                              />
                            </TableCell>
                            <TableCell>{jour.description || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
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
