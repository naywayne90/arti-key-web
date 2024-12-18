import React, { createContext, useContext, useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Notification } from '../../types';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>) => void;
  markAsRead: (notificationId: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
  userId: string;
}

export function NotificationProvider({ children, userId }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);

  useEffect(() => {
    if (!userId) return;

    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('destinataireId', '==', userId),
      where('lu', '==', false),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications: Notification[] = [];
      snapshot.forEach((doc) => {
        newNotifications.push({
          id: doc.id,
          ...doc.data(),
        } as Notification);
      });
      setNotifications(newNotifications);

      // Show the most recent notification if it exists
      if (newNotifications.length > 0) {
        setCurrentNotification(newNotifications[0]);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await db.collection('notifications').add({
        ...notification,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await db.collection('notifications').doc(notificationId).update({
        lu: true,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleClose = () => {
    if (currentNotification) {
      markAsRead(currentNotification.id);
      setCurrentNotification(null);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead }}>
      {children}
      {currentNotification && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleClose}
            severity={currentNotification.type.toLowerCase() as 'success' | 'info' | 'warning' | 'error'}
          >
            <strong>{currentNotification.titre}</strong>
            <br />
            {currentNotification.message}
          </Alert>
        </Snackbar>
      )}
    </NotificationContext.Provider>
  );
}
