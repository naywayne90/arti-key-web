import React from 'react';
import { Card, CardContent, Typography, Box, IconButton, useTheme, keyframes } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { artiColors } from '../../../theme/artiTheme';

interface LeaveCardProps {
  title: string;
  description: string;
  icon: React.ReactElement;
  color?: string;
  onClick?: () => void;
  showBackButton?: boolean;
}

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const LeaveCard: React.FC<LeaveCardProps> = ({
  title,
  description,
  icon,
  color = artiColors.blue.light,
  onClick,
  showBackButton = false,
}) => {
  const theme = useTheme();

  return (
    <Card
      onClick={onClick}
      sx={{
        height: '100%',
        backgroundColor: color,
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: '0 8px 16px -4px rgba(145, 158, 171, 0.08), 0 4px 8px -4px rgba(145, 158, 171, 0.04)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: `${fadeInUp} 0.5s ease-out`,
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px -4px rgba(145, 158, 171, 0.12), 0 4px 8px -4px rgba(145, 158, 171, 0.08)',
        } : {},
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        },
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          p: 3,
          '&:last-child': { pb: 3 },
        }}
      >
        {showBackButton && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
              },
            }}
          >
            <ArrowBack />
          </IconButton>
        )}
        
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 2px 4px rgba(145, 158, 171, 0.12)',
              marginRight: 2,
              '& svg': {
                fontSize: 24,
                color: theme.palette.primary.main,
                transition: 'transform 0.2s ease-in-out',
              },
              '&:hover svg': {
                transform: 'scale(1.1)',
              },
            }}
          >
            {icon}
          </Box>
          <Typography
            variant="h6"
            component="h2"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              flexGrow: 1,
            }}
          >
            {title}
          </Typography>
        </Box>
        
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            lineHeight: 1.6,
            flexGrow: 1,
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default LeaveCard;
