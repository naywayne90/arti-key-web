import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from '@mui/material';
import { api } from '@/services/api';
import { artiColors } from '@/theme/artiTheme';
import DemandesList from './components/DemandesList';
import DemandeForm from './components/DemandeForm';
import { useAuth } from '@/hooks/useAuth';
import { TabPanel } from '@/components/TabPanel';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CongesAbsences: React.FC = () => {
  const [demandes, setDemandes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quotaInfo, setQuotaInfo] = useState<any>(null);
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const fetchDemandes = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/demandes', {
        params: { userId: user?.id }
      });
      setDemandes(response.data);
    } catch (error) {
      setError('Impossible de charger les demandes');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuotaInfo = async () => {
    try {
      const response = await api.get(`/api/users/${user?.id}/quota-conges`);
      setQuotaInfo(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des informations de quota:', error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchDemandes();
      fetchQuotaInfo();
    }
  }, [user?.id]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Gestion des congés et absences
      </Typography>

      {quotaInfo && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Quota annuel
                </Typography>
                <Typography variant="h5">
                  {quotaInfo.quotaTotal} jours
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Jours pris
                </Typography>
                <Typography variant="h5">
                  {quotaInfo.joursPris} jours
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Jours restants
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: quotaInfo.joursRestants > 0 ? artiColors.green.main : artiColors.red.main 
                  }}
                >
                  {quotaInfo.joursRestants} jours
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Nouvelle demande" />
          <Tab label="Mes demandes" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            <DemandeForm onSuccess={fetchDemandes} />
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            <DemandesList demandes={demandes} isLoading={isLoading} />
          </Box>
        </TabPanel>
      </Paper>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CongesAbsences;
