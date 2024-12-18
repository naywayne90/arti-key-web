import { useQuery } from '@tanstack/react-query';
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  People,
  EventNote,
  School,
  AccessTime,
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

interface DashboardStats {
  totalEmployes: number;
  congesEnAttente: number;
  formationsEnCours: number;
  presents: number;
  absents: number;
}

// Mock data for development
const mockStats: DashboardStats = {
  totalEmployes: 150,
  congesEnAttente: 5,
  formationsEnCours: 3,
  presents: 142,
  absents: 8,
};

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}/dashboard/stats`);
        return response.data;
      } catch (error) {
        console.log('Using mock data due to API error:', error);
        return mockStats;
      }
    },
    retry: false,
    initialData: mockStats,
  });

  const StatCard = ({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          {icon}
          <Typography variant="h6" component="div" ml={1}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Tableau de Bord
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Employés"
            value={stats?.totalEmployes || 0}
            icon={<People color="primary" sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Congés en attente"
            value={stats?.congesEnAttente || 0}
            icon={<EventNote color="secondary" sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Formations en cours"
            value={stats?.formationsEnCours || 0}
            icon={<School color="primary" sx={{ fontSize: 40 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Présents aujourd'hui"
            value={stats?.presents || 0}
            icon={<AccessTime color="secondary" sx={{ fontSize: 40 }} />}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Statistiques des Présences
            </Typography>
            {/* Add a chart here */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Congés en Attente
            </Typography>
            {/* Add a list of pending leaves here */}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
