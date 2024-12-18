import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Divider,
} from '@mui/material';
import { LeaveBalance } from '../../../types/leave';

const LeaveBalanceCard: React.FC = () => {
  // TODO: Implement actual data fetching
  const balance: LeaveBalance = {
    employeeId: '1',
    year: new Date().getFullYear(),
    totalDays: 30,
    usedDays: 12,
    remainingDays: 18,
    lastUpdated: new Date(),
  };

  const progress = (balance.usedDays / balance.totalDays) * 100;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Solde des congés {balance.year}
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Jours disponibles
          </Typography>
          <Typography variant="h4" sx={{ mt: 1 }}>
            {balance.remainingDays}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ mt: 1, mb: 2 }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total
            </Typography>
            <Typography variant="h6">{balance.totalDays}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Utilisés
            </Typography>
            <Typography variant="h6">{balance.usedDays}</Typography>
          </Box>
        </Box>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 2 }}
        >
          Dernière mise à jour:{' '}
          {new Date(balance.lastUpdated).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default LeaveBalanceCard;
