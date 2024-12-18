import React from 'react';
import { Grid, Box, useTheme } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import WorkflowCard from './WorkflowCard';
import { useNavigate } from 'react-router-dom';

const WorkflowDashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const workflowSteps = [
    {
      title: 'Espace Demandeur',
      description: 'Soumettez vos demandes de congés et suivez leur statut en temps réel.',
      icon: <PersonIcon fontSize="large" />,
      path: '/conges-absences/espace-demandeur',
      bgColor: `${theme.palette.primary.main}15`,
      pendingCount: 0
    },
    {
      title: 'Direction',
      description: 'Validation des demandes par les managers et gestion des équipes.',
      icon: <GroupsIcon fontSize="large" />,
      path: '/conges-absences/espace-manager',
      bgColor: `${theme.palette.success.main}15`,
      pendingCount: 3
    },
    {
      title: 'DGPEC',
      description: 'Contrôlez et ajustez les demandes selon les politiques RH.',
      icon: <BusinessIcon fontSize="large" />,
      path: '/conges-absences/espace-dgpec',
      bgColor: `${theme.palette.warning.main}15`,
      pendingCount: 2
    },
    {
      title: 'Direction Générale',
      description: 'Validation finale des demandes de congés.',
      icon: <AccountBalanceIcon fontSize="large" />,
      path: '/conges-absences/espace-dg',
      bgColor: `${theme.palette.info.main}15`,
      pendingCount: 1
    }
  ];

  return (
    <Box sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
      <Grid 
        container 
        spacing={3} 
        sx={{
          '& .MuiGrid-item': {
            display: 'flex',
          }
        }}
      >
        {workflowSteps.map((step, index) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={3} 
            key={index}
          >
            <WorkflowCard
              title={step.title}
              description={step.description}
              icon={step.icon}
              pendingCount={step.pendingCount}
              onClick={() => navigate(step.path)}
              bgColor={step.bgColor}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WorkflowDashboard;
