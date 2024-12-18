import { ReactNode, useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  EventAvailable,
  WorkspacePremium,
  DirectionsCar,
  School,
  Assessment,
  FolderSpecial,
  AccessTime,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 280;

interface LayoutProps {
  children: ReactNode;
}

const menuItems = [
  { text: 'Tableau de Bord', icon: <Dashboard />, path: '/' },
  { text: 'Employés', icon: <People />, path: '/employes' },
  { text: 'Congés et Absences', icon: <EventAvailable />, path: '/conges' },
  { text: 'Gestion des Carrières', icon: <WorkspacePremium />, path: '/carrieres' },
  { text: 'Parc Auto', icon: <DirectionsCar />, path: '/parc-auto' },
  { text: 'Formations', icon: <School />, path: '/formations' },
  { text: 'Performances', icon: <Assessment />, path: '/performances' },
  { text: 'Gestion des Dossiers Administratifs', icon: <FolderSpecial />, path: '/dossiers' },
  { text: 'Pointage', icon: <AccessTime />, path: '/pointage' },
];

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box 
      sx={{ 
        overflow: 'auto',
        height: '100%',
        backgroundColor: theme.palette.background.default,
        borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: theme.spacing(0, 3),
          ...theme.mixins.toolbar,
          justifyContent: 'center',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          minHeight: '80px !important',
          background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.02)}, ${alpha(theme.palette.secondary.main, 0.02)})`,
        }}
      >
        <Typography 
          variant="h6" 
          component="div"
          sx={{
            fontWeight: 700,
            fontSize: '1.5rem',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textAlign: 'center',
            letterSpacing: '-0.5px',
          }}
        >
          Arti Key RH
        </Typography>
      </Toolbar>
      <List sx={{ p: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem 
              key={item.text} 
              disablePadding 
              sx={{ mb: 1 }}
            >
              <ListItemButton
                selected={isActive}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  position: 'relative',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  py: 1.5,
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    backdropFilter: 'blur(4px)',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 8,
                      bottom: 8,
                      width: 4,
                      borderRadius: '0 4px 4px 0',
                      backgroundColor: theme.palette.primary.main,
                      boxShadow: `0 0 12px ${alpha(theme.palette.primary.main, 0.5)}`,
                    },
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    '& .MuiListItemIcon-root svg': {
                      transform: 'scale(1.1) rotate(5deg)',
                    },
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isActive ? theme.palette.primary.main : alpha(theme.palette.text.primary, 0.6),
                    minWidth: 40,
                    ml: 1,
                    '& svg': {
                      fontSize: 24,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isActive ? 'scale(1.2)' : 'scale(1)',
                    }
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{
                    ml: 1,
                    '& .MuiTypography-root': {
                      fontWeight: isActive ? 600 : 500,
                      fontSize: '0.95rem',
                      color: isActive ? theme.palette.text.primary : alpha(theme.palette.text.primary, 0.7),
                      transition: 'all 0.3s ease',
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          backdropFilter: 'blur(8px)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
              boxShadow: theme.shadows[8],
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
              boxShadow: `4px 0 8px ${alpha(theme.palette.common.black, 0.05)}`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: alpha(theme.palette.background.default, 0.8),
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
