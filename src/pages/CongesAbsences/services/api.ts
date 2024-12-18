import axios from 'axios';
import { LeaveRequest } from '../types';

const API_BASE_URL = '/api';

export const congesApi = {
  // Récupérer le quota de congés
  getQuota: async (employeeId: string) => {
    const response = await axios.get(`${API_BASE_URL}/conges/quota/${employeeId}`);
    return response.data;
  },

  // Calculer le nombre de jours
  calculateDays: async (startDate: string, endDate: string, leaveType: string) => {
    const response = await axios.post(`${API_BASE_URL}/conges/calcul`, {
      dateDebut: startDate,
      dateFin: endDate,
      typeDemande: leaveType
    });
    return response.data;
  },

  // Soumettre une demande de congé
  submitLeaveRequest: async (formData: FormData) => {
    const response = await axios.post(`${API_BASE_URL}/demandes`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Récupérer la liste des demandes
  getLeaveRequests: async () => {
    const response = await axios.get<LeaveRequest[]>(`${API_BASE_URL}/demandes`);
    return response.data;
  },

  // Mettre à jour le statut d'une demande
  updateLeaveStatus: async (requestId: string, status: string, comment?: string) => {
    const response = await axios.put(`${API_BASE_URL}/demandes/${requestId}`, {
      status,
      comment
    });
    return response.data;
  }
};
