import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  History as HistoryIcon,
  CalendarToday as CalendarIcon,
  RemoveRedEye as ViewIcon,
} from '@mui/icons-material';
import NewLeaveDialog from './components/NewLeaveDialog';
import LeaveCalendar from './components/LeaveCalendar';

const EspaceDemandeur: React.FC = () => {
  const [openNewLeaveDialog, setOpenNewLeaveDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'list' | 'calendar'>('list');

  // Mock data - à remplacer par les données réelles de l'API
  const leaveRequests = [
    {
      id: '1',
      type: 'Congé annuel',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-20'),
      status: 'En attente',
      workingDays: 5,
      comments: '',
      attachments: [],
    },
    {
      id: '2',
      type: 'Congé maladie',
      startDate: new Date('2024-11-15'),
      endDate: new Date('2024-11-17'),
      status: 'Approuvé',
      workingDays: 3,
      comments: 'Certificat médical fourni',
      attachments: [],
    },
  ];

  const leaveBalance = {
    annual: { total: 30, used: 15, remaining: 15 },
    sick: { total: 15, used: 3, remaining: 12 },
    other: { total: 10, used: 0, remaining: 10 },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approuvé':
        return 'success';
      case 'Refusé':
        return 'error';
      case 'En attente':
        return 'warning';
      default:
        return 'default';
    }
  };

  const renderContent = () => {
    if (selectedTab === 'calendar') {
      return <LeaveCalendar requests={leaveRequests} />;
    }

    return (
      <List>
        {leaveRequests.map((request) => (
          <React.Fragment key={request.id}>
            <ListItem>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="subtitle1">{request.type}</Typography>
                    <Chip
                      size="small"
                      label={`${request.workingDays} jours`}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Du {request.startDate.toLocaleDateString()} au{' '}
                      {request.endDate.toLocaleDateString()}
                    </Typography>
                    {request.comments && (
                      <Typography variant="body2" color="text.secondary">
                        {request.comments}
                      </Typography>
                    )}
                  </>
                }
              />
              <ListItemSecondaryAction>
                <Chip
                  label={request.status}
                  color={
                    request.status === 'Approuvé'
                      ? 'success'
                      : request.status === 'Refusé'
                      ? 'error'
                      : 'warning'
                  }
                  size="small"
                />
                <IconButton size="small" sx={{ ml: 1 }}>
                  <ViewIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    );
  };

  return (
    <Box p={3}>
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>
              Mes demandes de congés
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenNewLeaveDialog(true)}
            >
              Nouvelle demande
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, mb: 2 }}>
          <Button
            variant={selectedTab === 'list' ? 'contained' : 'outlined'}
            startIcon={<HistoryIcon />}
            onClick={() => setSelectedTab('list')}
            sx={{ mr: 1 }}
          >
            Liste
          </Button>
          <Button
            variant={selectedTab === 'calendar' ? 'contained' : 'outlined'}
            startIcon={<CalendarIcon />}
            onClick={() => setSelectedTab('calendar')}
          >
            Calendrier
          </Button>
        </Box>

        {renderContent()}
      </Paper>

      <NewLeaveDialog
        open={openNewLeaveDialog}
        onClose={() => setOpenNewLeaveDialog(false)}
      />
    </Box>
  );
};

export default EspaceDemandeur;
