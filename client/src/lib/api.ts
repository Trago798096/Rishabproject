import { apiRequest } from './queryClient';

// Base URL will be the same domain in production, but we need to specify it for development
const getBaseUrl = () => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // If in production on Vercel, API calls go to the same domain
    return '';
  }
  // In development, default to localhost
  return 'http://localhost:5000';
};

// API client for matches
export const matchesApi = {
  getAll: async (active?: boolean) => {
    const url = active !== undefined 
      ? `/api/matches?active=${active}`
      : '/api/matches';
    const res = await apiRequest('GET', url);
    return res.json();
  },
  
  getById: async (id: number) => {
    const res = await apiRequest('GET', `/api/matches/${id}`);
    return res.json();
  },
  
  getTicketTypes: async (matchId: number) => {
    const res = await apiRequest('GET', `/api/matches/${matchId}/tickets`);
    return res.json();
  },
  
  create: async (matchData: any) => {
    const res = await apiRequest('POST', '/api/admin/matches', matchData);
    return res.json();
  },
  
  update: async (id: number, matchData: any) => {
    const res = await apiRequest('PATCH', `/api/admin/matches/${id}`, matchData);
    return res.json();
  },
  
  delete: async (id: number) => {
    await apiRequest('DELETE', `/api/admin/matches/${id}`);
    return true;
  }
};

// API client for ticket types
export const ticketTypesApi = {
  getById: async (id: number) => {
    const res = await apiRequest('GET', `/api/ticket-types/${id}`);
    return res.json();
  },
  
  create: async (ticketTypeData: any) => {
    const res = await apiRequest('POST', '/api/admin/ticket-types', ticketTypeData);
    return res.json();
  },
  
  update: async (id: number, ticketTypeData: any) => {
    const res = await apiRequest('PATCH', `/api/admin/ticket-types/${id}`, ticketTypeData);
    return res.json();
  },
  
  delete: async (id: number) => {
    await apiRequest('DELETE', `/api/admin/ticket-types/${id}`);
    return true;
  }
};

// API client for bookings
export const bookingsApi = {
  create: async (bookingData: any) => {
    const res = await apiRequest('POST', '/api/bookings', bookingData);
    return res.json();
  },
  
  updatePayment: async (bookingId: string, paymentData: any) => {
    const res = await apiRequest('PATCH', `/api/bookings/${bookingId}/payment`, paymentData);
    return res.json();
  },
  
  getByEmail: async (email: string) => {
    const res = await apiRequest('GET', `/api/bookings?email=${encodeURIComponent(email)}`);
    return res.json();
  },
  
  getByBookingId: async (bookingId: string) => {
    const res = await apiRequest('GET', `/api/bookings/${bookingId}`);
    return res.json();
  },
  
  getAll: async () => {
    const res = await apiRequest('GET', '/api/admin/bookings');
    return res.json();
  },
  
  updateStatus: async (bookingId: string, status: string) => {
    const res = await apiRequest('PATCH', `/api/admin/bookings/${bookingId}/status`, { status });
    return res.json();
  }
};

// API client for UPI details
export const upiDetailsApi = {
  getActive: async () => {
    const res = await apiRequest('GET', '/api/upi-details');
    return res.json();
  },
  
  create: async (upiDetailData: any) => {
    const res = await apiRequest('POST', '/api/admin/upi-details', upiDetailData);
    return res.json();
  },
  
  update: async (id: number, upiDetailData: any) => {
    const res = await apiRequest('PATCH', `/api/admin/upi-details/${id}`, upiDetailData);
    return res.json();
  }
};

// API client for admin authentication
export const authApi = {
  login: async (credentials: any) => {
    const res = await apiRequest('POST', '/api/admin/login', credentials);
    return res.json();
  }
};