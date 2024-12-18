import React from 'react';
import { Box, Paper } from '@mui/material';
import ManagerApproval from './ManagerApproval';
import DGPECApproval from './DGPECApproval';
import DGApproval from './DGApproval';

interface ApprovalSectionProps {
  userRole: 'MANAGER' | 'DGPEC' | 'DG';
}

const ApprovalSection: React.FC<ApprovalSectionProps> = ({ userRole }) => {
  return (
    <Box>
      {userRole === 'MANAGER' && <ManagerApproval />}
      {userRole === 'DGPEC' && <DGPECApproval />}
      {userRole === 'DG' && <DGApproval />}
    </Box>
  );
};

export default ApprovalSection;
