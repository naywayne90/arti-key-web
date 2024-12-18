import React from 'react';
import { Card, CardContent, CardHeader, Typography, Box, IconButton, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import NotificationsIcon from '@mui/icons-material/Notifications';

interface WorkflowCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  pendingCount?: number;
  onClick?: () => void;
  bgColor?: string;
}

const StyledCard = styled(Card)<{ bgcolor?: string }>(({ theme, bgcolor }) => ({
  width: '100%',
  height: '100%',
  minHeight: 200,
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: bgcolor || theme.palette.background.paper,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  borderRadius: theme.shape.borderRadius * 2,
  '&:hover': {
    transform: 'scale(1.02) translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  padding: theme.spacing(1.2),
  backgroundColor: 'rgba(255,255,255,0.3)',
  marginRight: theme.spacing(1.5),
  '& .MuiSvgIcon-root': {
    color: theme.palette.text.primary,
  },
}));

const StyledCardHeader = styled(CardHeader)(({ theme }) => ({
  padding: theme.spacing(2.5, 2),
  '& .MuiCardHeader-content': {
    overflow: 'hidden',
  },
  '& .MuiTypography-root': {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: 600,
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(0, 2, 2.5, 2),
  '&:last-child': {
    paddingBottom: theme.spacing(2.5),
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    fontSize: '0.75rem',
    height: 18,
    minWidth: 18,
    padding: '0 4px',
  },
}));

const WorkflowCard: React.FC<WorkflowCardProps> = ({
  title,
  description,
  icon,
  pendingCount = 0,
  onClick,
  bgColor,
}) => {
  return (
    <StyledCard onClick={onClick} bgcolor={bgColor}>
      <StyledCardHeader
        action={
          pendingCount > 0 ? (
            <IconButton size="small">
              <StyledBadge badgeContent={pendingCount} color="error">
                <NotificationsIcon fontSize="small" />
              </StyledBadge>
            </IconButton>
          ) : null
        }
        title={
          <Box display="flex" alignItems="center">
            <IconWrapper>
              {icon}
            </IconWrapper>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          </Box>
        }
      />
      <StyledCardContent>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            lineHeight: 1.6,
            opacity: 0.85,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {description}
        </Typography>
      </StyledCardContent>
    </StyledCard>
  );
};

export default WorkflowCard;
