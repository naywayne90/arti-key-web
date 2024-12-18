import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  IconButton,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  SupervisorAccount as SupervisorAccountIcon,
  Assessment as AssessmentIcon,
  Gavel as GavelIcon,
  ArrowForward as ArrowForwardIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  notifications?: number;
  onClick: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  icon,
  color,
  notifications,
  onClick,
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
          cursor: 'pointer',
        },
        position: 'relative',
        overflow: 'visible',
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          left: 20,
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: theme.shadows[4],
        }}
      >
        {icon}
      </Box>
      {notifications && notifications > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            right: -10,
            zIndex: 1,
          }}
        >
          <Chip
            icon={<NotificationsIcon />}
            label={notifications}
            color="error"
            size="small"
          />
        </Box>
      )}
      <CardContent sx={{ pt: 5, pb: 2, px: 3, flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, minHeight: 60 }}
        >
          {description}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            mt: 'auto',
          }}
        >
          <IconButton
            size="small"
            sx={{
              backgroundColor: alpha(color, 0.1),
              '&:hover': {
                backgroundColor: alpha(color, 0.2),
              },
            }}
          >
            <ArrowForwardIcon sx={{ color }} />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // Ces valeurs devraient venir de votre système d'authentification
  const [userRoles] = useState(['DEMANDEUR', 'MANAGER', 'DGPEC', 'DG']);
  const [notifications] = useState({
    demandeur: 2,
    manager: 5,
    dgpec: 3,
    dg: 1,
  });

  const cards = [
    {
      title: 'Espace Demandeur',
      description:
        'Soumettez vos demandes de congés et absences, consultez vos soldes et suivez l\'état de vos demandes en cours.',
      icon: <DescriptionIcon sx={{ color: 'white', fontSize: 30 }} />,
      color: theme.palette.primary.main,
      role: 'DEMANDEUR',
      notifications: notifications.demandeur,
      onClick: () => navigate('/conges-absences/demandeur'),
    },
    {
      title: 'Espace Manager',
      description:
        'Validez les demandes de votre équipe, consultez le planning des absences et gérez les remplacements.',
      icon: <SupervisorAccountIcon sx={{ color: 'white', fontSize: 30 }} />,
      color: theme.palette.success.main,
      role: 'MANAGER',
      notifications: notifications.manager,
      onClick: () => navigate('/conges-absences/manager'),
    },
    {
      title: 'Espace DGPEC',
      description:
        'Gérez les quotas, vérifiez les justificatifs et suivez les statistiques globales des congés et absences.',
      icon: <AssessmentIcon sx={{ color: 'white', fontSize: 30 }} />,
      color: theme.palette.info.main,
      role: 'DGPEC',
      notifications: notifications.dgpec,
      onClick: () => navigate('/conges-absences/dgpec'),
    },
    {
      title: 'Direction Générale',
      description:
        'Validez les demandes spéciales, consultez les rapports et supervisez la politique des congés.',
      icon: <GavelIcon sx={{ color: 'white', fontSize: 30 }} />,
      color: theme.palette.warning.main,
      role: 'DG',
      notifications: notifications.dg,
      onClick: () => navigate('/conges-absences/dg'),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Gestion des Congés et Absences
      </Typography>
      <Grid container spacing={4}>
        {cards
          .filter((card) => userRoles.includes(card.role))
          .map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <DashboardCard {...card} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
