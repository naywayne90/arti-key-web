import React from 'react';
import { Box, Typography, useTheme, keyframes } from '@mui/material';
import { EventNote } from '@mui/icons-material';
import { artiColors } from '../../../theme/artiTheme';

interface PageHeaderProps {
  title: string;
  description: string;
}

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        mb: 4,
        p: 3,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
        boxShadow: '0 2px 4px -2px rgba(145, 158, 171, 0.12), 0 4px 8px -2px rgba(145, 158, 171, 0.08)',
        position: 'relative',
        overflow: 'hidden',
        animation: `${fadeIn} 0.6s ease-out`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${artiColors.blue.main}, ${artiColors.green.main})`,
          animation: `${slideIn} 0.8s ease-out`,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: artiColors.blue.light,
          color: artiColors.blue.main,
          transition: 'all 0.2s ease-in-out',
          animation: `${fadeIn} 0.6s ease-out`,
          '&:hover': {
            transform: 'scale(1.05)',
            backgroundColor: `${artiColors.blue.light}CC`,
          },
        }}
      >
        <EventNote sx={{ 
          fontSize: 32,
          animation: `${fadeIn} 0.6s ease-out`,
        }} />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 1,
            background: `linear-gradient(45deg, ${artiColors.blue.main}, ${artiColors.green.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            animation: `${fadeIn} 0.6s ease-out`,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            maxWidth: '800px',
            lineHeight: 1.6,
            animation: `${fadeIn} 0.6s ease-out 0.2s`,
            opacity: 0,
            animationFillMode: 'forwards',
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default PageHeader;
