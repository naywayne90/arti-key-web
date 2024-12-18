import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const LeaveBalance: React.FC = () => {
  // Ces données devraient venir de l'API
  const balance = {
    available: 18,
    total: 30,
    used: 12,
    lastUpdate: '18/12/2024',
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Solde des congés 2024
      </Typography>

      <Box sx={{ my: 3 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Jours disponibles
        </Typography>
        <Typography variant="h3" color="primary" sx={{ mb: 2 }}>
          {balance.available}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Total
          </Typography>
          <Typography variant="body1">{balance.total}</Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            Utilisés
          </Typography>
          <Typography variant="body1">{balance.used}</Typography>
        </Box>
      </Box>

      <Typography variant="caption" color="text.secondary">
        Dernière mise à jour: {balance.lastUpdate}
      </Typography>
    </Paper>
  );
};

export default LeaveBalance;
