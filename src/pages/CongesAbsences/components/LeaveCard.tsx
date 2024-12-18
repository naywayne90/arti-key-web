import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { artiColors } from '../../../theme/artiTheme';

interface LeaveCardProps {
  title: string;
  description: string;
  icon: React.ReactElement;
  color?: string;
}

const LeaveCard: React.FC<LeaveCardProps> = ({
  title,
  description,
  icon: Icon,
  color = 'blue',
}) => {
  const theme = useTheme();
  const colorScheme = artiColors[color];

  return (
    <Card
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${colorScheme.light} 0%, #ffffff 100%)`,
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.3s ease-in-out',
        border: `1px solid ${colorScheme.light}`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${colorScheme.light}40`,
          '& .icon-container': {
            transform: 'scale(1.1)',
          },
        },
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '24px !important',
        }}
      >
        <Box
          className="icon-container"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: colorScheme.light,
            marginBottom: 2,
            transition: 'transform 0.3s ease-in-out',
          }}
        >
          <Icon
            sx={{
              fontSize: '24px',
              color: colorScheme.main,
            }}
          />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: colorScheme.main,
            marginBottom: 1,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            flex: 1,
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default LeaveCard;
