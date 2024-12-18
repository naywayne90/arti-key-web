import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import NewLeaveDialog from './NewLeaveDialog';
import LeaveBalance from './LeaveBalance';
import LeaveTable from './LeaveTable';
import LeaveHistory from './LeaveHistory';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

interface EspaceDemandeurProps {
  userRole: string;
}

const EspaceDemandeur: React.FC<EspaceDemandeurProps> = ({ userRole }) => {
  const [openNewLeaveDialog, setOpenNewLeaveDialog] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  // Exemple d'événements (à remplacer par les vrais événements de la base de données)
  const events = [
    {
      id: '1',
      timestamp: new Date(),
      type: 'SUBMISSION',
      userRole: 'EMPLOYEE',
      status: 'PENDING_DIRECTION',
      comment: 'Demande de congés du 15 au 20 janvier',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 heure avant
      type: 'VALIDATION',
      userRole: 'DIRECTION',
      status: 'PENDING_DGPEC',
      comment: 'Validé - Planning d\'équipe vérifié',
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes avant
      type: 'VALIDATION',
      userRole: 'DGPEC',
      status: 'PENDING_DG',
      comment: 'Validé - Quotas respectés',
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenNewLeaveDialog(true)}
        >
          Nouvelle demande
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <LeaveBalance />
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper>
            <Tabs 
              value={selectedTab} 
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Mes demandes" />
              <Tab label="Historique" />
            </Tabs>

            <TabPanel value={selectedTab} index={0}>
              <Typography variant="h6" gutterBottom>
                Mes demandes
              </Typography>
              <LeaveTable
                columns={[
                  { id: 'type', label: 'Type' },
                  { id: 'dateDebut', label: 'Date début' },
                  { id: 'dateFin', label: 'Date fin' },
                  { id: 'duree', label: 'Durée (jours)' },
                  { id: 'statut', label: 'Statut' },
                  { id: 'actions', label: 'Actions' },
                ]}
              />
            </TabPanel>

            <TabPanel value={selectedTab} index={1}>
              <LeaveHistory events={events} />
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      <NewLeaveDialog
        open={openNewLeaveDialog}
        onClose={() => setOpenNewLeaveDialog(false)}
        userRole={userRole}
      />
    </Box>
  );
};

export default EspaceDemandeur;
