import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { artiColors } from '@/theme/artiTheme';

interface DemandeFormData {
  typeDemande: string;
  dateDebut: Date | null;
  dateFin: Date | null;
  justificatif?: File;
  commentaire?: string;
}

const typesDemande = [
  { value: 'CONGE_ANNUEL', label: 'Congé annuel' },
  { value: 'MALADIE', label: 'Maladie' },
  { value: 'EVENEMENT_FAMILIAL', label: 'Événement familial' },
  { value: 'AUTRE', label: 'Autres' }
];

const DemandeForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calculJours, setCalculJours] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
    trigger
  } = useForm<DemandeFormData>({
    defaultValues: {
      typeDemande: '',
      dateDebut: null,
      dateFin: null,
      commentaire: '',
      justificatif: undefined
    },
    mode: 'onChange'
  });

  const dateDebut = watch('dateDebut');
  const dateFin = watch('dateFin');
  const typeDemande = watch('typeDemande');

  const calculateJours = useCallback(async () => {
    if (dateDebut && dateFin && typeDemande) {
      try {
        const response = await api.post('/api/conges/calcul', {
          dateDebut: dateDebut.toISOString(),
          dateFin: dateFin.toISOString(),
          typeDemande
        });
        setCalculJours(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erreur lors du calcul des jours');
        setCalculJours(null);
      }
    }
  }, [dateDebut, dateFin, typeDemande]);

  React.useEffect(() => {
    calculateJours();
  }, [calculateJours]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Le fichier est trop volumineux (max 5MB)');
        return;
      }
      if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
        setError('Type de fichier non autorisé (PDF, JPEG, PNG uniquement)');
        return;
      }
      setValue('justificatif', file);
      setError(null);
    }
  };

  const onSubmit = async (data: DemandeFormData) => {
    if (!calculJours) {
      setError('Impossible de soumettre la demande sans le calcul des jours');
      return;
    }
    setOpenDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      const data = {
        typeDemande,
        dateDebut,
        dateFin,
        commentaire: watch('commentaire'),
        justificatif: watch('justificatif')
      };

      formData.append('typeDemande', data.typeDemande);
      formData.append('dateDebut', data.dateDebut?.toISOString() || '');
      formData.append('dateFin', data.dateFin?.toISOString() || '');
      
      if (data.commentaire) {
        formData.append('commentaire', data.commentaire);
      }
      
      if (data.justificatif) {
        formData.append('justificatif', data.justificatif);
      }

      await api.post('/api/demandes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      reset();
      setOpenDialog(false);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la soumission');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Controller
              name="typeDemande"
              control={control}
              rules={{ required: 'Ce champ est requis' }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.typeDemande}>
                  <InputLabel id="type-demande-label">Type de demande</InputLabel>
                  <Select
                    {...field}
                    labelId="type-demande-label"
                    label="Type de demande"
                  >
                    {typesDemande.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="dateDebut"
              control={control}
              rules={{ required: 'Ce champ est requis' }}
              render={({ field }) => (
                <DatePicker
                  label="Date de début"
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.dateDebut,
                      helperText: errors.dateDebut?.message
                    }
                  }}
                  minDate={new Date()}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="dateFin"
              control={control}
              rules={{ required: 'Ce champ est requis' }}
              render={({ field }) => (
                <DatePicker
                  label="Date de fin"
                  value={field.value}
                  onChange={(date) => field.onChange(date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.dateFin,
                      helperText: errors.dateFin?.message
                    }
                  }}
                  minDate={dateDebut || new Date()}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="commentaire"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={4}
                  label="Commentaire (optionnel)"
                  error={!!errors.commentaire}
                  helperText={errors.commentaire?.message}
                />
              )}
            />
          </Grid>

          {typeDemande !== 'CONGE_ANNUEL' && (
            <Grid item xs={12}>
              <input
                accept="application/pdf,image/jpeg,image/png"
                style={{ display: 'none' }}
                id="justificatif-file"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="justificatif-file">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                >
                  {watch('justificatif') ? 'Changer le justificatif' : 'Ajouter un justificatif'}
                </Button>
              </label>
              {watch('justificatif') && (
                <Typography variant="caption" display="block" mt={1}>
                  Fichier sélectionné: {watch('justificatif').name}
                </Typography>
              )}
            </Grid>
          )}

          {calculJours && (
            <Grid item xs={12}>
              <Alert severity="info">
                Cette demande compte pour {calculJours.nombreJours} jour(s)
              </Alert>
            </Grid>
          )}

          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting || !calculJours}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Soumettre la demande'}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmer la demande</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir soumettre cette demande ?
          </Typography>
          {calculJours && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Cette demande compte pour {calculJours.nombreJours} jour(s)
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button
            onClick={handleConfirmSubmit}
            variant="contained"
            disabled={isSubmitting}
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default DemandeForm;
