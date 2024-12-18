import { useState } from 'react';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
} from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNotifications } from './NotificationProvider';

export default function NotificationBell() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { notifications, markAsRead } = useNotifications();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
    handleClose();
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 400,
            width: '300px',
          },
        }}
      >
        {notifications.length === 0 ? (
          <MenuItem>
            <Typography>Aucune notification</Typography>
          </MenuItem>
        ) : (
          <List>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id)}
                button
              >
                <ListItemText
                  primary={notification.titre}
                  secondary={
                    <Box component="span">
                      <Typography
                        component="span"
                        variant="body2"
                        color="textSecondary"
                      >
                        {notification.message}
                      </Typography>
                      <br />
                      <Typography
                        component="span"
                        variant="caption"
                        color="textSecondary"
                      >
                        {format(new Date(notification.createdAt), 'dd MMMM yyyy HH:mm', {
                          locale: fr,
                        })}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Menu>
    </>
  );
}
