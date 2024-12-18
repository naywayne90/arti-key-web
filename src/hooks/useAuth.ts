import { useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function useAuth() {
  // Pour le moment, on simule un utilisateur connecté
  const [user] = useState<User>({
    id: '1',
    email: 'user@example.com',
    name: 'John Doe',
    role: 'employee'
  });

  return {
    user,
    isAuthenticated: true,
    isLoading: false,
  };
}
