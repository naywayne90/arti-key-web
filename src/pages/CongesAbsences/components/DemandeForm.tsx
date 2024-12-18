import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Alert,
  Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { fr } from 'date-fns/locale';

interface DemandeFormProps {
  onSuccess?: () => void;
}

const DemandeForm: React.FC<DemandeFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    typeDemande: '',
    dateDebut: null,
    dateFin: null,
    commentaire: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Si tout va bien, on appelle onSuccess
      if (onSuccess) {
        onSuccess();
      }
      
      // Réinitialisation du formulaire
      setFormData({
        typeDemande: '',
        dateDebut: null,
        dateFin: null,
        commentaire: '',
      });
    } catch (err) {
      setError('Une erreur est survenue lors de la soumission de la demande');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={0}>
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Nouvelle demande de congé
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Type de congé</InputLabel>
              <Select
                value={formData.typeDemande}
                label="Type de congé"
                onChange={(e) => setFormData({ ...formData, typeDemande: e.target.value })}
                required
              >
                <MenuItem value="CONGE_ANNUEL">Congé annuel</MenuItem>
                <MenuItem value="MALADIE">Maladie</MenuItem>
                <MenuItem value="EVENEMENT_FAMILIAL">Événement familial</MenuItem>
                <MenuItem value="AUTRE">Autres</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <DatePicker
              label="Date de début"
              value={formData.dateDebut}
              onChange={(date) => setFormData({ ...formData, dateDebut: date })}
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true
                }
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <DatePicker
              label="Date de fin"
              value={formData.dateFin}
              onChange={(date) => setFormData({ ...formData, dateFin: date })}
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true
                }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Commentaire"
              multiline
              rows={4}
              value={formData.commentaire}
              onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
            />
          </Grid>

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              fullWidth
            >
              {isSubmitting ? 'Envoi en cours...' : 'Soumettre la demande'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default DemandeForm;
