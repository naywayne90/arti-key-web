import { collection, doc, getDoc, getDocs, query, where, updateDoc, addDoc, Timestamp, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { LeaveRequest, LeaveEvent, LeaveQuota, LeaveStatus, UserRole } from '../types';

const LEAVE_REQUESTS_COLLECTION = 'leaveRequests';
const LEAVE_EVENTS_COLLECTION = 'leaveEvents';
const LEAVE_QUOTAS_COLLECTION = 'leaveQuotas';

// Fonction utilitaire pour convertir Timestamp en Date
const convertTimestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

// Fonction utilitaire pour convertir Date en Timestamp
const convertDateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

// Récupérer une demande de congé par ID
export const getLeaveRequest = async (requestId: string): Promise<LeaveRequest | null> => {
  try {
    const docRef = doc(db, LEAVE_REQUESTS_COLLECTION, requestId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      ...data,
      id: docSnap.id,
      startDate: convertTimestampToDate(data.startDate),
      endDate: convertTimestampToDate(data.endDate),
      lastUpdated: convertTimestampToDate(data.lastUpdated),
      createdAt: convertTimestampToDate(data.createdAt),
    } as LeaveRequest;
  } catch (error) {
    console.error('Error getting leave request:', error);
    throw error;
  }
};

// Récupérer les demandes de congés selon les critères
export const getLeaveRequests = async (
  userRole: UserRole,
  userId: string,
  status?: LeaveStatus[]
): Promise<LeaveRequest[]> => {
  try {
    let q = collection(db, LEAVE_REQUESTS_COLLECTION);
    
    // Filtres selon le rôle
    switch (userRole) {
      case 'EMPLOYEE':
        q = query(q, where('requesterId', '==', userId));
        break;
      case 'DIRECTION':
        q = query(q, where('department', '==', userId)); // userId est l'ID du département
        break;
      case 'DGPEC':
      case 'DG':
        // Pas de filtre supplémentaire, ils voient toutes les demandes
        break;
    }

    // Filtre par status si spécifié
    if (status && status.length > 0) {
      q = query(q, where('status', 'in', status));
    }

    // Tri par date de mise à jour
    q = query(q, orderBy('lastUpdated', 'desc'));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      startDate: convertTimestampToDate(doc.data().startDate),
      endDate: convertTimestampToDate(doc.data().endDate),
      lastUpdated: convertTimestampToDate(doc.data().lastUpdated),
      createdAt: convertTimestampToDate(doc.data().createdAt),
    } as LeaveRequest));
  } catch (error) {
    console.error('Error getting leave requests:', error);
    throw error;
  }
};

// Mettre à jour une demande de congé
export const updateLeaveRequest = async (
  requestId: string,
  request: Partial<LeaveRequest>
): Promise<void> => {
  try {
    const docRef = doc(db, LEAVE_REQUESTS_COLLECTION, requestId);
    const updateData = {
      ...request,
      lastUpdated: Timestamp.now(),
    };

    // Convertir les dates en Timestamp
    if (request.startDate) {
      updateData.startDate = convertDateToTimestamp(request.startDate);
    }
    if (request.endDate) {
      updateData.endDate = convertDateToTimestamp(request.endDate);
    }

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating leave request:', error);
    throw error;
  }
};

// Ajouter un événement à l'historique
export const addLeaveEvent = async (
  requestId: string,
  event: Omit<LeaveEvent, 'id'>
): Promise<string> => {
  try {
    const eventData = {
      ...event,
      requestId,
      timestamp: convertDateToTimestamp(event.timestamp),
    };

    const docRef = await addDoc(collection(db, LEAVE_EVENTS_COLLECTION), eventData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding leave event:', error);
    throw error;
  }
};

// Récupérer l'historique des événements d'une demande
export const getLeaveEvents = async (requestId: string): Promise<LeaveEvent[]> => {
  try {
    const q = query(
      collection(db, LEAVE_EVENTS_COLLECTION),
      where('requestId', '==', requestId),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      timestamp: convertTimestampToDate(doc.data().timestamp),
    } as LeaveEvent));
  } catch (error) {
    console.error('Error getting leave events:', error);
    throw error;
  }
};

// Récupérer le quota de congés d'un utilisateur
export const getLeaveQuota = async (userId: string, year: number): Promise<LeaveQuota | null> => {
  try {
    const q = query(
      collection(db, LEAVE_QUOTAS_COLLECTION),
      where('userId', '==', userId),
      where('year', '==', year)
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    return {
      ...doc.data(),
      id: doc.id,
      lastUpdated: convertTimestampToDate(doc.data().lastUpdated),
    } as LeaveQuota;
  } catch (error) {
    console.error('Error getting leave quota:', error);
    throw error;
  }
};

// Mettre à jour le quota de congés
export const updateLeaveQuota = async (
  quotaId: string,
  quota: Partial<LeaveQuota>
): Promise<void> => {
  try {
    const docRef = doc(db, LEAVE_QUOTAS_COLLECTION, quotaId);
    const updateData = {
      ...quota,
      lastUpdated: Timestamp.now(),
    };

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating leave quota:', error);
    throw error;
  }
};
