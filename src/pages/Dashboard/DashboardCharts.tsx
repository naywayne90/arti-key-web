import { useQuery } from 'react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function PresenceChart() {
  const { data: stats, isLoading } = useQuery('presenceStats', async () => {
    const response = await axios.get(`${API_URL}/dashboard/presence-stats`);
    return response.data;
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  const data = [
    { name: 'Présents', value: stats?.presents || 0 },
    { name: 'Absents', value: stats?.absents || 0 },
    { name: 'Congés', value: stats?.conges || 0 },
    { name: 'Missions', value: stats?.missions || 0 },
  ];

  return (
    <Box height={300}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}

export function DepartementChart() {
  const { data: stats, isLoading } = useQuery('departementStats', async () => {
    const response = await axios.get(`${API_URL}/dashboard/departement-stats`);
    return response.data;
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box height={300}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={stats}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="employees" fill="#8884d8" name="Employés" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

export function CongesChart() {
  const { data: stats, isLoading } = useQuery('congesStats', async () => {
    const response = await axios.get(`${API_URL}/dashboard/conges-stats`);
    return response.data;
  });

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box height={300}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={stats}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="conges" fill="#82ca9d" name="Congés" />
          <Bar dataKey="absences" fill="#ffc658" name="Absences" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
