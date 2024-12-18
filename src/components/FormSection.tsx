import { ReactNode } from 'react';
import { Box, Paper, Typography } from '@mui/material';

interface FormSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

const FormSection = ({ title, icon, children }: FormSectionProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        backgroundColor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        {icon && (
          <Box sx={{ mr: 1, color: 'primary.main', display: 'flex' }}>
            {icon}
          </Box>
        )}
        <Typography variant="h6" color="primary.main" fontWeight="500">
          {title}
        </Typography>
      </Box>
      {children}
    </Paper>
  );
};

export default FormSection;
