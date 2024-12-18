import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Employee, EmployeeStatus, ContractType, EmployeeCategory, EmployeeSegment, EmployeeCollege, EmployeeFamily, MaritalStatus, PaymentMode } from '../../types/employee';

const EDUCATION_LEVELS = [
  'BEPC',
  'BAC',
  'BAC+1',
  'BAC+2',
  'BAC+3',
  'BAC+4',
  'BAC+5',
  'BAC+8',
];

const SUPPORTED_FILE_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'application/pdf'];

const calculateMinimumBirthDate = () => {
  const today = new Date();
  return new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
};

const validationSchema = Yup.object({
  // Informations Personnelles
  photo: Yup.mixed().required('Photo requise').test('fileFormat', 'Format non supporté', value => 
    value && SUPPORTED_FILE_FORMATS.includes(value.type)
  ),
  matricule: Yup.string().required('Matricule requis'),
  firstName: Yup.string().required('Prénom requis'),
  lastName: Yup.string().required('Nom requis'),
  cni: Yup.object({
    number: Yup.string().required('Numéro CNI requis'),
    expiryDate: Yup.date().required('Date d\'expiration CNI requise'),
  }),
  passport: Yup.object({
    number: Yup.string(),
    issueDate: Yup.date(),
    expiryDate: Yup.date(),
  }),
  genre: Yup.string().oneOf(['homme', 'femme']).required('Genre requis'),
  birthDate: Yup.date().required('Date de naissance requise'),
  nationality: Yup.string().required('Nationalité requise'),
  location: Yup.string().required('Localisation requise'),
  dateNaissance: Yup.date()
    .required('La date de naissance est requise')
    .max(calculateMinimumBirthDate(), 'L\'employé doit avoir au moins 18 ans')
    .nullable(),
  lieuNaissance: Yup.string()
    .required('Le lieu de naissance est requis')
    .min(2, 'Le lieu de naissance doit contenir au moins 2 caractères'),
  paysNaissance: Yup.string()
    .required('Le pays de naissance est requis')
    .min(2, 'Le pays de naissance doit contenir au moins 2 caractères'),

  // Coordonnées
  professionalEmail: Yup.string()
    .email('Email invalide')
    .matches(/@arti\.ci$/, 'Doit être une adresse @arti.ci')
    .required('Email professionnel requis'),
  professionalPhone: Yup.string().required('Téléphone professionnel requis'),
  personalPhone: Yup.string().required('Téléphone personnel requis'),
  address: Yup.string().required('Adresse requise'),

  // Informations Professionnelles
  direction: Yup.string().required('Direction requise'),
  college: Yup.string().required('Collège requis'),
  family: Yup.string().required('Famille requise'),
  contractType: Yup.string().required('Type de contrat requis'),
  contractDuration: Yup.string().when('contractType', {
    is: (val: string) => val === 'CDD' || val === 'Stage',
    then: Yup.string().required('Durée requise pour CDD/Stage'),
  }),
  category: Yup.string().required('Catégorie requise'),
  niveau: Yup.string()
    .required('Le niveau est requis')
    .oneOf([
      'sans_diplome',
      'permis',
      'bepc',
      'bac',
      'bac2',
      'bac3',
      'bac4',
      'bac5',
      'bac6',
      'bac7',
      'bac8',
      'autres'
    ], 'Niveau invalide'),
  domain: Yup.string().required('Domaine requis'),
  segment: Yup.string().required('Segment requis'),
  status: Yup.string().required('Statut requis'),
  hireDate: Yup.date().required('Date d\'embauche requise'),
  isCivilServant: Yup.boolean(),
  departureDate: Yup.date().when('status', {
    is: 'Départ',
    then: Yup.date().required('Date de départ requise'),
  }),
  departureReason: Yup.string().when('status', {
    is: 'Départ',
    then: Yup.string().required('Motif de départ requis'),
  }),
  posteOccupe: Yup.string().required('Poste occupé requis'),
  segmentPoste: Yup.string().required('Segment poste requis'),
  localisation: Yup.string().required('Localisation requise'),

  // Rémunération
  salary: {
    base: Yup.number().required('Salaire de base requis'),
    transport: Yup.number().required('Indemnité transport requise'),
    housing: Yup.number().required('Indemnité logement requise'),
  },
  paymentMode: Yup.string().required('Mode de paiement requis'),
  cnpsNumber: Yup.string(),
  ipsCgraeNumber: Yup.string(),
  insurances: Yup.string(),

  // Situation Familiale
  maritalStatus: Yup.string().required('Situation matrimoniale requise'),
  numberOfChildren: Yup.number().min(0).required('Nombre d\'enfants requis'),
  emergencyContact: Yup.object({
    name: Yup.string().required('Nom du contact d\'urgence requis'),
    relationship: Yup.string().required('Lien avec le contact requis'),
    phone: Yup.string().required('Téléphone du contact requis'),
  }),

  // Documents
  documents: Yup.object({
    cv: Yup.mixed().required('CV requis'),
    diplomas: Yup.array().of(Yup.mixed()).min(1, 'Au moins un diplôme requis'),
    criminalRecord: Yup.mixed().required('Casier judiciaire requis'),
    medicalCertificate: Yup.mixed().required('Certificat médical requis'),
    drivingLicense: Yup.mixed(),
    certifications: Yup.array().of(Yup.mixed()),
  }),
});

const steps = [
  'Informations Personnelles',
  'Coordonnées',
  'Informations Professionnelles',
  'Rémunération et Sécurité sociale',
  'Situation Familiale',
  'Documents',
];

export default function EmployeeForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      // Informations Personnelles
      photo: null,
      matricule: '',
      firstName: '',
      lastName: '',
      cni: { number: '', expiryDate: null },
      passport: { number: '', issueDate: null, expiryDate: null },
      genre: '',
      birthDate: null,
      nationality: '',
      location: '',
      dateNaissance: null,
      lieuNaissance: '',
      paysNaissance: '',

      // Coordonnées
      professionalEmail: '',
      professionalPhone: '',
      personalPhone: '',
      address: '',

      // Informations Professionnelles
      direction: '',
      college: '',
      family: '',
      contractType: '',
      contractDuration: '',
      category: '',
      niveau: '',
      domain: '',
      segment: '',
      status: 'En poste',
      hireDate: null,
      isCivilServant: false,
      departureDate: null,
      departureReason: '',
      posteOccupe: '',
      segmentPoste: '',
      localisation: '',

      // Rémunération
      salary: {
        base: 0,
        transport: 0,
        housing: 0,
      },
      paymentMode: '',
      cnpsNumber: '',
      ipsCgraeNumber: '',
      insurances: '',

      // Situation Familiale
      maritalStatus: '',
      numberOfChildren: 0,
      emergencyContact: {
        name: '',
        relationship: '',
        phone: '',
      },

      // Documents
      documents: {
        cv: null,
        diplomas: [],
        criminalRecord: null,
        medicalCertificate: null,
        drivingLicense: null,
        certifications: [],
      },
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
      // Implement your submit logic here
    },
  });

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      formik.setFieldValue('photo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      if (field.includes('diplomas') || field.includes('certifications')) {
        formik.setFieldValue(field, Array.from(files));
      } else {
        formik.setFieldValue(field, files[0]);
      }
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                {imagePreview && (
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Photo preview"
                    sx={{ width: 200, height: 200, objectFit: 'cover', borderRadius: '50%', mb: 2 }}
                  />
                )}
                <Button
                  variant="contained"
                  component="label"
                >
                  Choisir une photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="matricule"
                label="Matricule"
                value={formik.values.matricule}
                onChange={formik.handleChange}
                error={formik.touched.matricule && Boolean(formik.errors.matricule)}
                helperText={formik.touched.matricule && formik.errors.matricule}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="firstName"
                label="Prénom"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="lastName"
                label="Nom"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="cni.number"
                label="Numéro CNI"
                value={formik.values.cni.number}
                onChange={formik.handleChange}
                error={formik.touched.cni?.number && Boolean(formik.errors.cni?.number)}
                helperText={formik.touched.cni?.number && formik.errors.cni?.number}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Date d'expiration CNI"
                value={formik.values.cni.expiryDate}
                onChange={(date) => formik.setFieldValue('cni.expiryDate', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.cni?.expiryDate && Boolean(formik.errors.cni?.expiryDate),
                    helperText: formik.touched.cni?.expiryDate && formik.errors.cni?.expiryDate,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="passport.number"
                label="Numéro de passeport"
                placeholder="Numéro de passeport (optionnel)"
                value={formik.values.passport.number}
                onChange={formik.handleChange}
                error={formik.touched.passport?.number && Boolean(formik.errors.passport?.number)}
                helperText={formik.touched.passport?.number && formik.errors.passport?.number}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Date d'expiration du passeport"
                value={formik.values.passport.expiryDate}
                onChange={(date) => formik.setFieldValue('passport.expiryDate', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.passport?.expiryDate && Boolean(formik.errors.passport?.expiryDate),
                    helperText: (formik.touched.passport?.expiryDate && formik.errors.passport?.expiryDate) || '(Optionnel)',
                    placeholder: 'Date d\'expiration (optionnel)'
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl 
                fullWidth 
                required
                error={formik.touched.genre && Boolean(formik.errors.genre)}
              >
                <InputLabel>Genre</InputLabel>
                <Select
                  name="genre"
                  value={formik.values.genre}
                  onChange={formik.handleChange}
                  label="Genre"
                >
                  <MenuItem value="homme">Homme</MenuItem>
                  <MenuItem value="femme">Femme</MenuItem>
                </Select>
                {formik.touched.genre && formik.errors.genre && (
                  <FormHelperText>{formik.errors.genre}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="nationality"
                label="Nationalité"
                placeholder="Ex: Ivoirienne"
                value={formik.values.nationality}
                onChange={formik.handleChange}
                error={formik.touched.nationality && Boolean(formik.errors.nationality)}
                helperText={formik.touched.nationality && formik.errors.nationality}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Date de naissance"
                value={formik.values.dateNaissance}
                onChange={(date) => formik.setFieldValue('dateNaissance', date)}
                format="dd/MM/yyyy"
                maxDate={calculateMinimumBirthDate()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: formik.touched.dateNaissance && Boolean(formik.errors.dateNaissance),
                    helperText: (formik.touched.dateNaissance && formik.errors.dateNaissance) || 'Format: jj/mm/aaaa',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                name="lieuNaissance"
                label="Lieu de naissance"
                placeholder="Ville ou région de naissance"
                value={formik.values.lieuNaissance}
                onChange={formik.handleChange}
                error={formik.touched.lieuNaissance && Boolean(formik.errors.lieuNaissance)}
                helperText={formik.touched.lieuNaissance && formik.errors.lieuNaissance}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                name="paysNaissance"
                label="Pays de naissance"
                placeholder="Ex: Côte d'Ivoire"
                value={formik.values.paysNaissance}
                onChange={formik.handleChange}
                error={formik.touched.paysNaissance && Boolean(formik.errors.paysNaissance)}
                helperText={formik.touched.paysNaissance && formik.errors.paysNaissance}
              />
            </Grid>
            {/* Ajoutez les autres champs d'informations personnelles ici */}
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="professionalEmail"
                label="Email professionnel"
                value={formik.values.professionalEmail}
                onChange={formik.handleChange}
                error={formik.touched.professionalEmail && Boolean(formik.errors.professionalEmail)}
                helperText={formik.touched.professionalEmail && formik.errors.professionalEmail}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="professionalPhone"
                label="Téléphone professionnel"
                value={formik.values.professionalPhone}
                onChange={formik.handleChange}
                error={formik.touched.professionalPhone && Boolean(formik.errors.professionalPhone)}
                helperText={formik.touched.professionalPhone && formik.errors.professionalPhone}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="personalPhone"
                label="Téléphone personnel"
                value={formik.values.personalPhone}
                onChange={formik.handleChange}
                error={formik.touched.personalPhone && Boolean(formik.errors.personalPhone)}
                helperText={formik.touched.personalPhone && formik.errors.personalPhone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="address"
                label="Adresse"
                multiline
                rows={3}
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Information professionnelle
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="direction"
                label="Direction"
                placeholder="ex: DSI"
                value={formik.values.direction}
                onChange={formik.handleChange}
                error={formik.touched.direction && Boolean(formik.errors.direction)}
                helperText={formik.touched.direction && formik.errors.direction}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={formik.touched.college && Boolean(formik.errors.college)}>
                <InputLabel>Collège</InputLabel>
                <Select
                  name="college"
                  value={formik.values.college}
                  onChange={formik.handleChange}
                  label="Collège"
                >
                  {['A', 'B'].map((college) => (
                    <MenuItem key={college} value={college}>
                      Collège {college}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={formik.touched.family && Boolean(formik.errors.family)}>
                <InputLabel>Famille</InputLabel>
                <Select
                  name="family"
                  value={formik.values.family}
                  onChange={formik.handleChange}
                  label="Famille"
                >
                  {['Support', 'Gouvernance', 'Métier'].map((family) => (
                    <MenuItem key={family} value={family}>
                      {family}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={formik.touched.contractType && Boolean(formik.errors.contractType)}>
                <InputLabel>Type de contrat</InputLabel>
                <Select
                  name="contractType"
                  value={formik.values.contractType}
                  onChange={formik.handleChange}
                  label="Type de contrat"
                >
                  {['CDI', 'CDD', 'Stage'].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {(formik.values.contractType === 'CDD' || formik.values.contractType === 'Stage') && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="contractDuration"
                  label="Durée du contrat"
                  value={formik.values.contractDuration}
                  onChange={formik.handleChange}
                  error={formik.touched.contractDuration && Boolean(formik.errors.contractDuration)}
                  helperText={formik.touched.contractDuration && formik.errors.contractDuration}
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="category"
                label="Catégorie"
                placeholder="ex: Chauffeur"
                value={formik.values.category}
                onChange={formik.handleChange}
                error={formik.touched.category && Boolean(formik.errors.category)}
                helperText={formik.touched.category && formik.errors.category}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                name="niveau"
                label="Niveau"
                value={formik.values.niveau}
                onChange={formik.handleChange}
                error={formik.touched.niveau && Boolean(formik.errors.niveau)}
                helperText={formik.touched.niveau && formik.errors.niveau}
              >
                <MenuItem value="sans_diplome">Sans diplôme</MenuItem>
                <MenuItem value="permis">Permis de conduire</MenuItem>
                <MenuItem value="bepc">Bepc</MenuItem>
                <MenuItem value="bac">BAC</MenuItem>
                <MenuItem value="bac2">BAC+2</MenuItem>
                <MenuItem value="bac3">BAC+3</MenuItem>
                <MenuItem value="bac4">BAC+4</MenuItem>
                <MenuItem value="bac5">BAC+5</MenuItem>
                <MenuItem value="bac6">BAC+6</MenuItem>
                <MenuItem value="bac7">BAC+7</MenuItem>
                <MenuItem value="bac8">BAC+8</MenuItem>
                <MenuItem value="autres">AUTRES</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Date d'embauche"
                value={formik.values.hireDate}
                onChange={(date) => formik.setFieldValue('hireDate', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: formik.touched.hireDate && Boolean(formik.errors.hireDate),
                    helperText: formik.touched.hireDate && formik.errors.hireDate,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="posteOccupe"
                label="Poste occupé"
                placeholder="Ex: Chef comptable"
                value={formik.values.posteOccupe}
                onChange={formik.handleChange}
                error={formik.touched.posteOccupe && Boolean(formik.errors.posteOccupe)}
                helperText={formik.touched.posteOccupe && formik.errors.posteOccupe}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="domain"
                label="Domaine"
                placeholder="ex: Informatique"
                value={formik.values.domain}
                onChange={formik.handleChange}
                error={formik.touched.domain && Boolean(formik.errors.domain)}
                helperText={formik.touched.domain && formik.errors.domain}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={formik.touched.status && Boolean(formik.errors.status)}>
                <InputLabel>Statut</InputLabel>
                <Select
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  label="Statut"
                >
                  {['En poste', 'En congés', 'Départ'].map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.isCivilServant}
                    onChange={(e) => formik.setFieldValue('isCivilServant', e.target.checked)}
                    name="isCivilServant"
                  />
                }
                label="Fonctionnaire"
              />
            </Grid>
            {formik.values.status === 'Départ' && (
              <>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Date de départ"
                    value={formik.values.departureDate}
                    onChange={(date) => formik.setFieldValue('departureDate', date)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: formik.touched.departureDate && Boolean(formik.errors.departureDate),
                        helperText: formik.touched.departureDate && formik.errors.departureDate,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    name="departureReason"
                    label="Motif de départ"
                    value={formik.values.departureReason}
                    onChange={formik.handleChange}
                    error={formik.touched.departureReason && Boolean(formik.errors.departureReason)}
                    helperText={formik.touched.departureReason && formik.errors.departureReason}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                name="segmentPoste"
                label="Segment poste"
                value={formik.values.segmentPoste}
                onChange={formik.handleChange}
                error={formik.touched.segmentPoste && Boolean(formik.errors.segmentPoste)}
                helperText={formik.touched.segmentPoste && formik.errors.segmentPoste}
              >
                <MenuItem value="agent_maitrise">Agent de maîtrise</MenuItem>
                <MenuItem value="sous_directeur">Sous-Directeur</MenuItem>
                <MenuItem value="chef_service">Chef de Service</MenuItem>
                <MenuItem value="directeur">Directeur</MenuItem>
                <MenuItem value="ouvrier">Ouvrier</MenuItem>
                <MenuItem value="autre">Autre</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="localisation"
                label="Localisation"
                placeholder="Ex: Abidjan"
                value={formik.values.localisation}
                onChange={formik.handleChange}
                error={formik.touched.localisation && Boolean(formik.errors.localisation)}
                helperText={formik.touched.localisation && formik.errors.localisation}
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Rémunération et Sécurité sociale
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                name="salary.base"
                label="Salaire de base"
                type="number"
                value={formik.values.salary.base}
                onChange={formik.handleChange}
                error={formik.touched.salary?.base && Boolean(formik.errors.salary?.base)}
                helperText={formik.touched.salary?.base && formik.errors.salary?.base}
                InputProps={{
                  startAdornment: <InputAdornment position="start">FCFA</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                name="salary.transport"
                label="Indemnité transport"
                type="number"
                value={formik.values.salary.transport}
                onChange={formik.handleChange}
                error={formik.touched.salary?.transport && Boolean(formik.errors.salary?.transport)}
                helperText={formik.touched.salary?.transport && formik.errors.salary?.transport}
                InputProps={{
                  startAdornment: <InputAdornment position="start">FCFA</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                name="salary.housing"
                label="Indemnité logement"
                type="number"
                value={formik.values.salary.housing}
                onChange={formik.handleChange}
                error={formik.touched.salary?.housing && Boolean(formik.errors.salary?.housing)}
                helperText={formik.touched.salary?.housing && formik.errors.salary?.housing}
                InputProps={{
                  startAdornment: <InputAdornment position="start">FCFA</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl 
                fullWidth 
                required
                error={formik.touched.paymentMode && Boolean(formik.errors.paymentMode)}
              >
                <InputLabel>Mode de paiement</InputLabel>
                <Select
                  name="paymentMode"
                  value={formik.values.paymentMode}
                  onChange={formik.handleChange}
                  label="Mode de paiement"
                >
                  <MenuItem value="virement">Virement bancaire</MenuItem>
                  <MenuItem value="cheque">Chèque</MenuItem>
                  <MenuItem value="especes">Espèces</MenuItem>
                </Select>
                {formik.touched.paymentMode && formik.errors.paymentMode && (
                  <FormHelperText>{formik.errors.paymentMode}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="cnpsNumber"
                label="Numéro CNPS"
                value={formik.values.cnpsNumber}
                onChange={formik.handleChange}
                error={formik.touched.cnpsNumber && Boolean(formik.errors.cnpsNumber)}
                helperText={(formik.touched.cnpsNumber && formik.errors.cnpsNumber) || '(Optionnel)'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="ipsCgraeNumber"
                label="Numéro IPS-CGRAE"
                value={formik.values.ipsCgraeNumber}
                onChange={formik.handleChange}
                error={formik.touched.ipsCgraeNumber && Boolean(formik.errors.ipsCgraeNumber)}
                helperText={(formik.touched.ipsCgraeNumber && formik.errors.ipsCgraeNumber) || '(Optionnel)'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="insurances"
                label="Assurances et mutuelles"
                multiline
                rows={2}
                value={formik.values.insurances}
                onChange={formik.handleChange}
                error={formik.touched.insurances && Boolean(formik.errors.insurances)}
                helperText={(formik.touched.insurances && formik.errors.insurances) || '(Optionnel)'}
              />
            </Grid>
          </Grid>
        );
      case 4:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={formik.touched.maritalStatus && Boolean(formik.errors.maritalStatus)}>
                <InputLabel>Situation matrimoniale</InputLabel>
                <Select
                  name="maritalStatus"
                  value={formik.values.maritalStatus}
                  onChange={formik.handleChange}
                  label="Situation matrimoniale"
                >
                  {[
                    'Célibataire',
                    'Marié(e)',
                    'Divorcé(e)',
                    'Veuf/Veuve'
                  ].map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="numberOfChildren"
                label="Nombre d'enfants"
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
                value={formik.values.numberOfChildren}
                onChange={formik.handleChange}
                error={formik.touched.numberOfChildren && Boolean(formik.errors.numberOfChildren)}
                helperText={formik.touched.numberOfChildren && formik.errors.numberOfChildren}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Contact d'urgence
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="emergencyContact.name"
                label="Nom complet"
                value={formik.values.emergencyContact.name}
                onChange={formik.handleChange}
                error={formik.touched.emergencyContact?.name && Boolean(formik.errors.emergencyContact?.name)}
                helperText={formik.touched.emergencyContact?.name && formik.errors.emergencyContact?.name}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="emergencyContact.relationship"
                label="Lien de parenté"
                value={formik.values.emergencyContact.relationship}
                onChange={formik.handleChange}
                error={formik.touched.emergencyContact?.relationship && Boolean(formik.errors.emergencyContact?.relationship)}
                helperText={formik.touched.emergencyContact?.relationship && formik.errors.emergencyContact?.relationship}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="emergencyContact.phone"
                label="Téléphone"
                value={formik.values.emergencyContact.phone}
                onChange={formik.handleChange}
                error={formik.touched.emergencyContact?.phone && Boolean(formik.errors.emergencyContact?.phone)}
                helperText={formik.touched.emergencyContact?.phone && formik.errors.emergencyContact?.phone}
              />
            </Grid>
          </Grid>
        );
      case 5:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Documents obligatoires
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ height: '56px' }}
              >
                {formik.values.documents.cv ? 'CV sélectionné' : 'Télécharger CV'}
                <input
                  type="file"
                  hidden
                  accept=".pdf,.doc,.docx"
                  onChange={(event) => handleFileChange('documents.cv')(event)}
                />
              </Button>
              {formik.touched.documents?.cv && formik.errors.documents?.cv && (
                <Typography color="error" variant="caption">
                  {formik.errors.documents.cv as string}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ height: '56px' }}
              >
                {formik.values.documents.diplomas?.length ? `${formik.values.documents.diplomas.length} diplôme(s) sélectionné(s)` : 'Télécharger diplômes'}
                <input
                  type="file"
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={(event) => handleFileChange('documents.diplomas')(event)}
                />
              </Button>
              {formik.touched.documents?.diplomas && formik.errors.documents?.diplomas && (
                <Typography color="error" variant="caption">
                  {formik.errors.documents.diplomas as string}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ height: '56px' }}
              >
                {formik.values.documents.criminalRecord ? 'Casier judiciaire sélectionné' : 'Télécharger casier judiciaire'}
                <input
                  type="file"
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(event) => handleFileChange('documents.criminalRecord')(event)}
                />
              </Button>
              {formik.touched.documents?.criminalRecord && formik.errors.documents?.criminalRecord && (
                <Typography color="error" variant="caption">
                  {formik.errors.documents.criminalRecord as string}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ height: '56px' }}
              >
                {formik.values.documents.medicalCertificate ? 'Certificat médical sélectionné' : 'Télécharger certificat médical'}
                <input
                  type="file"
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(event) => handleFileChange('documents.medicalCertificate')(event)}
                />
              </Button>
              {formik.touched.documents?.medicalCertificate && formik.errors.documents?.medicalCertificate && (
                <Typography color="error" variant="caption">
                  {formik.errors.documents.medicalCertificate as string}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Documents optionnels
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ height: '56px' }}
              >
                {formik.values.documents.drivingLicense ? 'Permis de conduire sélectionné' : 'Télécharger permis de conduire'}
                <input
                  type="file"
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(event) => handleFileChange('documents.drivingLicense')(event)}
                />
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ height: '56px' }}
              >
                {formik.values.documents.certifications?.length ? `${formik.values.documents.certifications.length} certification(s) sélectionnée(s)` : 'Télécharger certifications'}
                <input
                  type="file"
                  hidden
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={(event) => handleFileChange('documents.certifications')(event)}
                />
              </Button>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Nouvel Employé
      </Typography>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Card>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            {renderStepContent(activeStep)}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              {activeStep > 0 && (
                <Button onClick={handleBack} sx={{ mr: 1 }}>
                  Précédent
                </Button>
              )}
              <Button
                variant="contained"
                onClick={activeStep === steps.length - 1 ? formik.submitForm : handleNext}
              >
                {activeStep === steps.length - 1 ? 'Enregistrer' : 'Suivant'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
