import { ReactNode } from 'react';
import { Box, Paper, Stepper, Step, StepLabel, Typography } from '@mui/material';

interface StepFormProps {
  activeStep: number;
  steps: string[];
  children: ReactNode;
}

const StepForm = ({ activeStep, steps, children }: StepFormProps) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper 
        activeStep={activeStep} 
        alternativeLabel
        sx={{
          mb: 4,
          '& .MuiStepLabel-root .Mui-completed': {
            color: 'primary.main',
          },
          '& .MuiStepLabel-root .Mui-active': {
            color: 'primary.main',
          },
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {children}
      </Paper>
    </Box>
  );
};

export default StepForm;
