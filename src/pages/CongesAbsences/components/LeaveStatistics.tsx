import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface LeaveStats {
  totalRequests: number;
  approved: number;
  rejected: number;
  byType: {
    type: string;
    count: number;
  }[];
}

interface LeaveStatisticsProps {
  stats: LeaveStats;
}

const LeaveStatistics: React.FC<LeaveStatisticsProps> = ({ stats }) => {
  const approvalRate = (stats.approved / stats.totalRequests) * 100 || 0;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Taux d'Approbation
            </Typography>
            <Box sx={{ mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={approvalRate}
                color={approvalRate > 70 ? 'success' : 'warning'}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {stats.approved} approuvées sur {stats.totalRequests} demandes
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Répartition par Type
            </Typography>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={stats.byType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2196f3" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default LeaveStatistics;
