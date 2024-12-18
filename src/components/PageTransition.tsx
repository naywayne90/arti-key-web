import React, { useEffect, useState } from 'react';
import { Box, Fade } from '@mui/material';
import { keyframes } from '@mui/system';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <Fade in={show} timeout={600}>
      <Box
        sx={{
          animation: `${slideIn} 0.6s ease-out`,
          '& > *': {
            opacity: show ? 1 : 0,
            transform: show ? 'none' : 'translateY(20px)',
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }
        }}
      >
        {children}
      </Box>
    </Fade>
  );
};

export default PageTransition;
