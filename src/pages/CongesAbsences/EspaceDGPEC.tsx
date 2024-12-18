import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  RemoveRedEye as ViewIcon,
  CalendarToday as CalendarIcon,
  Assessment as StatsIcon,
  CloudDownload as ExportIcon,
} from '@mui/icons-material';
import LeaveCalendar from './components/LeaveCalendar';

interface LeaveQuota {
  id: string;
  department: string;
  type: string;
  baseQuota: number;
  additionalQuota: number;
  usedQuota: number;
}

const EspaceDGPEC: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'quotas' | 'calendar' | 'stats'>(
    'quotas'
  );
  const [quotaDialog, setQuotaDialog] = useState(false);
  const [selectedQuota, setSelectedQuota] = useState<LeaveQuota | null>(null);

  // Mock data - à remplacer par les données réelles de l'API
  const quotas: LeaveQuota[] = [
    {
      id: '1',
      department: 'IT',
      type: 'Congé annuel',
      baseQuota: 30,
      additionalQuota: 5,
      usedQuota: 15,
    },
    {
      id: '2',
      department: 'RH',
      type: 'Congé annuel',
      baseQuota: 30,
      additionalQuota: 0,
      usedQuota: 20,
    },
    {
      id: '3',
      department: 'Finance',
      type: 'Congé annuel',
      baseQuota: 30,
      additionalQuota: 1,
      usedQuota: 18,
    },
  ];

  const handleQuotaUpdate = () => {
    // Logique de mise à jour des quotas à implémenter
    setQuotaDialog(false);
    setSelectedQuota(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Espace DGPEC
      </Typography>

      {/* Statistiques globales */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Employés
              </Typography>
              <Typography variant="h3" color="primary">
                150
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                En congé
              </Typography>
              <Typography variant="h3" color="warning.main">
                12
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quota moyen utilisé
              </Typography>
              <Typography variant="h3" color="success.main">
                45%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Demandes en attente
              </Typography>
              <Typography variant="h3" color="error.main">
                8
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <Button
          variant={selectedTab === 'quotas' ? 'contained' : 'outlined'}
          onClick={() => setSelectedTab('quotas')}
        >
          Quotas
        </Button>
        <Button
          variant={selectedTab === 'calendar' ? 'contained' : 'outlined'}
          startIcon={<CalendarIcon />}
          onClick={() => setSelectedTab('calendar')}
        >
          Calendrier
        </Button>
        <Button
          variant={selectedTab === 'stats' ? 'contained' : 'outlined'}
          startIcon={<StatsIcon />}
          onClick={() => setSelectedTab('stats')}
        >
          Statistiques
        </Button>
        <Button
          variant="outlined"
          startIcon={<ExportIcon />}
          sx={{ ml: 'auto' }}
        >
          Exporter
        </Button>
      </Box>

      {/* Contenu principal */}
      <Paper sx={{ p: 2 }}>
        {selectedTab === 'quotas' && (
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom>
                  Gestion des congés (DGPEC)
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
                <Button
                  variant="outlined"
                  startIcon={<CalendarIcon />}
                  sx={{ mr: 1 }}
                >
                  Vue globale
                </Button>
                <Button variant="outlined" startIcon={<ViewIcon />}>
                  Rapports
                </Button>
              </Grid>
            </Grid>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Service</TableCell>
                    <TableCell>Type de congé</TableCell>
                    <TableCell>Quota de base</TableCell>
                    <TableCell>Quota additionnel</TableCell>
                    <TableCell>Quota utilisé</TableCell>
                    <TableCell>Quota restant</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {quotas.map((quota) => (
                    <TableRow key={quota.id}>
                      <TableCell>{quota.department}</TableCell>
                      <TableCell>{quota.type}</TableCell>
                      <TableCell>{quota.baseQuota}</TableCell>
                      <TableCell>{quota.additionalQuota}</TableCell>
                      <TableCell>{quota.usedQuota}</TableCell>
                      <TableCell>
                        {quota.baseQuota + quota.additionalQuota - quota.usedQuota}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setSelectedQuota(quota);
                            setQuotaDialog(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {selectedTab === 'calendar' && (
          <LeaveCalendar
            leaves={[]} // À remplir avec les données réelles
            holidays={[]}
            departments={['IT', 'RH', 'Finance']}
          />
        )}

        {selectedTab === 'stats' && (
          <Typography variant="body1" color="text.secondary">
            Statistiques détaillées à implémenter...
          </Typography>
        )}
      </Paper>

      <Dialog open={quotaDialog} onClose={() => setQuotaDialog(false)}>
        <DialogTitle>
          Modifier les quotas - {selectedQuota?.department}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type de congé</InputLabel>
                <Select
                  value={selectedQuota?.type || ''}
                  label="Type de congé"
                >
                  <MenuItem value="Congé annuel">Congé annuel</MenuItem>
                  <MenuItem value="Congé maladie">Congé maladie</MenuItem>
                  <MenuItem value="Congé exceptionnel">
                    Congé exceptionnel
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Quota de base"
                type="number"
                fullWidth
                value={selectedQuota?.baseQuota || 0}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Quota additionnel"
                type="number"
                fullWidth
                value={selectedQuota?.additionalQuota || 0}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuotaDialog(false)}>Annuler</Button>
          <Button onClick={handleQuotaUpdate} color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EspaceDGPEC;
