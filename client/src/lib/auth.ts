import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminUser, LoginCredentials } from '@shared/schema';
import { adminLogin } from './api';

interface AuthState {
  admin: Omit<AdminUser, 'password'> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      admin: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await adminLogin(credentials);
          const admin = await response.json();
          set({ admin, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: 'Login failed. Please check your credentials.', isLoading: false });
        }
      },
      logout: () => {
        set({ admin: null, isAuthenticated: false });
      },
    }),
    {
      name: 'admin-auth',
    }
  )
);

export const useBookingEmailStore = create<{
  email: string;
  setEmail: (email: string) => void;
}>()(
  persist(
    (set) => ({
      email: '',
      setEmail: (email: string) => set({ email }),
    }),
    {
      name: 'booking-email',
    }
  )
);
