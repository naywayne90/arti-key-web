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
  useTheme,
  alpha,
} from '@mui/material';
import { api } from '@/services/api';
import { artiColors } from '@/theme/artiTheme';
import WorkflowDashboard from './components/WorkflowDashboard';
import DemandesList from './components/DemandesList';
import DemandeForm from './components/DemandeForm';
import { useAuth } from '@/hooks/useAuth';
import { TabPanel } from '@/components/TabPanel';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import WorkIcon from '@mui/icons-material/Work';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import PageTransition from '../../components/PageTransition';

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
  const theme = useTheme();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const fetchDemandes = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/demandes', {
        params: { userId: user?.id }
      });
      const demandesData = Array.isArray(response.data) ? response.data : [];
      setDemandes(demandesData);
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
      setError('Impossible de charger les demandes');
      setDemandes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchDemandes();
    }
  }, [user?.id]);

  return (
    <PageTransition>
      <Container maxWidth="xl">
        <Box
          sx={{
            background: `linear-gradient(135deg, ${artiColors.blue.light} 0%, ${artiColors.green.light} 100%)`,
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 600,
              marginBottom: '8px',
              background: `linear-gradient(135deg, ${artiColors.blue.main} 0%, ${artiColors.green.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Gestion des Congés et Absences
          </Typography>
          <Box 
            sx={{
              position: 'relative',
              mb: 6,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -32,
                left: -24,
                right: -24,
                bottom: -32,
                background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.03)}, ${alpha(theme.palette.secondary.main, 0.03)})`,
                borderRadius: 4,
                zIndex: -1,
              }
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                    boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.15)}`,
                  }}
                >
                  <EventAvailableIcon 
                    sx={{ 
                      fontSize: 32,
                      color: theme.palette.primary.main,
                    }} 
                  />
                </Box>
              </Grid>
              <Grid item xs>
                <Typography 
                  variant="subtitle1" 
                  color="textSecondary"
                  sx={{
                    maxWidth: 600,
                    lineHeight: 1.6,
                    mt: 1,
                  }}
                >
                  Suivi et validation des demandes d'absences et congés conformément à la législation ivoirienne
                </Typography>
              </Grid>
              <Grid item xs={12} md="auto">
                <Grid container spacing={2}>
                  <Grid item xs={4} md={12}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: alpha(theme.palette.success.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <AccessTimeFilledIcon sx={{ color: theme.palette.success.main }} />
                      <Box>
                        <Typography variant="caption" color="success.main" fontWeight={500}>
                          Jours disponibles
                        </Typography>
                        <Typography variant="h6" color="success.main" fontWeight={600}>
                          {quotaInfo?.quotaRestant || '0'} jours
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>

          <Box mt={4} mb={4}>
            <WorkflowDashboard />
          </Box>

          <Box sx={{ width: '100%', mt: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                  },
                  '& .Mui-selected': {
                    fontWeight: 600,
                  },
                }}
              >
                <Tab label="Mes Demandes" />
                <Tab label="Nouvelle Demande" />
              </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
              <DemandesList demandes={demandes} isLoading={isLoading} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <DemandeForm onSuccess={fetchDemandes} />
            </TabPanel>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              '& > *': {
                borderRadius: '12px',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                },
              },
            }}
          >
            <Snackbar 
              open={!!error} 
              autoHideDuration={6000} 
              onClose={() => setError(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Alert onClose={() => setError(null)} severity="error">
                {error}
              </Alert>
            </Snackbar>
          </Box>
        </Box>
      </Container>
    </PageTransition>
  );
};

export default CongesAbsences;
