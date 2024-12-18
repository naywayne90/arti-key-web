import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
  IconButton,
  Stack,
  FormHelperText,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Description as FileIcon,
  InsertDriveFile as AttachmentIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { calculateWorkingDays, formatPeriod } from '../../../utils/dateUtils';

interface NewLeaveDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: LeaveRequestData) => Promise<void>;
}

interface LeaveRequestData {
  type: string;
  startDate: Date | null;
  endDate: Date | null;
  workingDays: number;
  reason: string;
  files: File[];
}

const LEAVE_TYPES = [
  {
    value: 'CONGE_ANNUEL',
    label: 'Congé annuel',
    requiresDoc: false,
    maxDays: 30,
  },
  {
    value: 'CONGE_MALADIE',
    label: 'Congé maladie',
    requiresDoc: true,
    maxDays: 180,
  },
  {
    value: 'CONGE_DECES',
    label: 'Congé décès',
    requiresDoc: true,
    maxDays: 5,
  },
  {
    value: 'EVENEMENT_FAMILIAL',
    label: 'Événement familial',
    requiresDoc: true,
    maxDays: 3,
  },
  {
    value: 'AUTRE',
    label: 'Autre',
    requiresDoc: false,
    maxDays: null,
  },
];

const STEPS = ['Type de congé', 'Période', 'Justificatifs', 'Résumé'];

const NewLeaveDialog: React.FC<NewLeaveDialogProps> = ({ open, onClose, onSubmit }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<LeaveRequestData>({
    type: '',
    startDate: null,
    endDate: null,
    workingDays: 0,
    reason: '',
    files: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...acceptedFiles],
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 5,
  });

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    switch (activeStep) {
      case 0:
        if (!formData.type) {
          newErrors.type = 'Veuillez sélectionner un type de congé';
        }
        break;
      case 1:
        if (!formData.startDate) {
          newErrors.startDate = 'Veuillez sélectionner une date de début';
        }
        if (!formData.endDate) {
          newErrors.endDate = 'Veuillez sélectionner une date de fin';
        }
        if (
          formData.startDate &&
          formData.endDate &&
          formData.startDate > formData.endDate
        ) {
          newErrors.endDate =
            'La date de fin doit être postérieure à la date de début';
        }
        break;
      case 2:
        const selectedType = LEAVE_TYPES.find(
          (type) => type.value === formData.type
        );
        if (selectedType?.requiresDoc && formData.files.length === 0) {
          newErrors.files =
            'Un justificatif est requis pour ce type de congé';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (validateStep()) {
      try {
        const workingDays = formData.startDate && formData.endDate
          ? calculateWorkingDays(formData.startDate, formData.endDate)
          : 0;

        await onSubmit({
          ...formData,
          workingDays,
        });
        onClose();
      } catch (error) {
        setErrors({ submit: 'Une erreur est survenue lors de la soumission' });
      }
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <FormControl fullWidth error={!!errors.type}>
            <InputLabel>Type de congé</InputLabel>
            <Select
              value={formData.type}
              label="Type de congé"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, type: e.target.value }))
              }
            >
              {LEAVE_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
            {errors.type && (
              <FormHelperText>{errors.type}</FormHelperText>
            )}
          </FormControl>
        );

      case 1:
        return (
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={fr}
          >
            <Stack spacing={3}>
              <DatePicker
                label="Date de début"
                value={formData.startDate}
                onChange={(date) =>
                  setFormData((prev) => ({ ...prev, startDate: date }))
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.startDate,
                    helperText: errors.startDate,
                  },
                }}
              />
              <DatePicker
                label="Date de fin"
                value={formData.endDate}
                onChange={(date) =>
                  setFormData((prev) => ({ ...prev, endDate: date }))
                }
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.endDate,
                    helperText: errors.endDate,
                  },
                }}
              />
            </Stack>
          </LocalizationProvider>
        );

      case 2:
        return (
          <Box>
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed',
                borderColor: isDragActive ? 'primary.main' : 'grey.300',
                borderRadius: 1,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                mb: 2,
              }}
            >
              <input {...getInputProps()} />
              <UploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography>
                {isDragActive
                  ? 'Déposez les fichiers ici'
                  : 'Glissez-déposez vos justificatifs ici ou cliquez pour sélectionner'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Formats acceptés : PDF, JPEG, PNG (max 5MB)
              </Typography>
            </Box>

            {errors.files && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.files}
              </Alert>
            )}

            <Stack spacing={1}>
              {formData.files.map((file, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    border: '1px solid',
                    borderColor: 'grey.300',
                    borderRadius: 1,
                  }}
                >
                  <FileIcon sx={{ mr: 1 }} />
                  <Typography
                    variant="body2"
                    sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {file.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mx: 1 }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => removeFile(index)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Résumé de votre demande
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Type de congé
                </Typography>
                <Typography>
                  {LEAVE_TYPES.find((type) => type.value === formData.type)?.label}
                </Typography>
              </Box>

              {formData.startDate && formData.endDate && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Période
                  </Typography>
                  <Typography>
                    {formatPeriod(formData.startDate, formData.endDate)}
                  </Typography>
                </Box>
              )}

              {formData.reason && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Motif
                  </Typography>
                  <Typography>{formData.reason}</Typography>
                </Box>
              )}

              {formData.files.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Pièces jointes
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {formData.files.map((file, index) => (
                      <Chip
                        key={index}
                        icon={<AttachmentIcon />}
                        label={file.name}
                        onDelete={() => removeFile(index)}
                      />
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          </Box>
        );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { minHeight: '50vh' },
      }}
    >
      <DialogTitle>Nouvelle demande de congé</DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ py: 3 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 2 }}>{renderStepContent()}</Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        {activeStep > 0 && (
          <Button onClick={handleBack}>Précédent</Button>
        )}
        {activeStep < STEPS.length - 1 ? (
          <Button onClick={handleNext} variant="contained">
            Suivant
          </Button>
        ) : (
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Soumettre
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default NewLeaveDialog;
