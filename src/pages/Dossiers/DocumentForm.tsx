import { useState } from 'react';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  MenuItem,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Document } from '../../types';
import { useQuery } from 'react-query';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

interface DocumentFormProps {
  onSubmit: (values: Partial<Document>, file: File) => void;
  onCancel: () => void;
}

const validationSchema = Yup.object({
  type: Yup.string().required('Le type est requis'),
  nom: Yup.string().required('Le nom est requis'),
  description: Yup.string().required('La description est requise'),
  employeeId: Yup.string().required('L\'employé est requis'),
});

const documentTypes = ['CONTRAT', 'CV', 'DIPLOME', 'AUTRE'];

export default function DocumentForm({ onSubmit, onCancel }: DocumentFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: employees } = useQuery('employees', async () => {
    const response = await axios.get(`${API_URL}/employes`);
    return response.data;
  });

  const formik = useFormik({
    initialValues: {
      type: '',
      nom: '',
      description: '',
      employeeId: '',
    },
    validationSchema,
    onSubmit: (values) => {
      if (selectedFile) {
        onSubmit(values, selectedFile);
      }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      formik.setFieldValue('nom', event.target.files[0].name);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <DialogTitle>Nouveau Document</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                name="type"
                label="Type de document"
                value={formik.values.type}
                onChange={formik.handleChange}
                error={formik.touched.type && Boolean(formik.errors.type)}
                helperText={formik.touched.type && formik.errors.type}
              >
                {documentTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                name="employeeId"
                label="Employé"
                value={formik.values.employeeId}
                onChange={formik.handleChange}
                error={formik.touched.employeeId && Boolean(formik.errors.employeeId)}
                helperText={formik.touched.employeeId && formik.errors.employeeId}
              >
                {employees?.map((employee: any) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.nom} {employee.prenom}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="description"
                label="Description"
                multiline
                rows={2}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" component="label">
                Sélectionner un fichier
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </Button>
              {selectedFile && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Fichier sélectionné: {selectedFile.name}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Annuler</Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!selectedFile}
        >
          Enregistrer
        </Button>
      </DialogActions>
    </form>
  );
}
