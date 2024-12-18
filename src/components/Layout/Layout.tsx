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
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  EventNote,
  BusinessCenter,
  DirectionsCar,
  School,
  Assessment,
  Folder,
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
  { text: 'Congés et Absences', icon: <EventNote />, path: '/conges' },
  { text: 'Gestion des Carrières', icon: <BusinessCenter />, path: '/carrieres' },
  { text: 'Parc Auto', icon: <DirectionsCar />, path: '/parc-auto' },
  { text: 'Formations', icon: <School />, path: '/formations' },
  { text: 'Performances', icon: <Assessment />, path: '/performances' },
  { text: 'Gestion des Dossiers Administratifs', icon: <Folder />, path: '/dossiers' },
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
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: theme.spacing(0, 2),
          ...theme.mixins.toolbar,
          justifyContent: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`,
          minHeight: '80px !important',
        }}
      >
        <Typography 
          variant="h6" 
          component="div"
          sx={{
            fontWeight: 600,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textAlign: 'center',
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
              sx={{ mb: 0.5 }}
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
                  transition: 'all 0.2s ease-in-out',
                  '&.Mui-selected': {
                    backgroundColor: `${theme.palette.primary.main}15`,
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}25`,
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      bottom: 4,
                      width: 4,
                      borderRadius: '0 4px 4px 0',
                      backgroundColor: theme.palette.primary.main,
                    },
                  },
                  '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}10`,
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
                    minWidth: 40,
                    '& svg': {
                      fontSize: 24,
                      transition: 'transform 0.2s ease-in-out',
                      transform: isActive ? 'scale(1.2)' : 'scale(1)',
                    }
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? theme.palette.text.primary : theme.palette.text.secondary,
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
          borderBottom: `1px solid ${theme.palette.divider}`,
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
              boxShadow: 'none',
              border: 'none',
              borderRight: `1px solid ${theme.palette.divider}`,
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
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
