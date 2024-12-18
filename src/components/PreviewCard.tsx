import { Box, Paper, Typography, Avatar, Divider } from '@mui/material';
import { Employee } from '../types/employee';

interface PreviewCardProps {
  employee: Partial<Employee>;
}

const PreviewCard = ({ employee }: PreviewCardProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        position: 'sticky',
        top: 24,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Aperçu
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          src={employee.image}
          sx={{
            width: 64,
            height: 64,
            mr: 2,
            border: '2px solid',
            borderColor: 'primary.main',
          }}
        />
        <Box>
          <Typography variant="subtitle1">
            {employee.nom} {employee.prenoms}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {employee.matricule}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ '& > *:not(:last-child)': { mb: 2 } }}>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Poste
          </Typography>
          <Typography variant="body2">
            {employee.posteOccupe || '-'}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Direction
          </Typography>
          <Typography variant="body2">
            {employee.direction || '-'}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Email
          </Typography>
          <Typography variant="body2">
            {employee.email || '-'}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            Type de contrat
          </Typography>
          <Typography variant="body2">
            {employee.typeContrat || '-'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default PreviewCard;
