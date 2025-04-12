import { apiRequest } from './queryClient';
import { Match, TicketType, Booking, UPIDetails, Admin } from "@shared/schema";
import type { Match as MatchType, Booking as BookingType, TicketType as TicketTypeType, UPIDetail } from '@shared/schema';


const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '';
  }
  return 'http://localhost:5000';
};

// API client for matches
export const matchesApi = {
  getAll: async (active?: boolean): Promise<Match[]> => {
    const url = active !== undefined 
      ? `/api/matches?active=${active}`
      : '/api/matches';
    const res = await apiRequest('GET', url);
    return res.json();
  },
  getById: async (id: number): Promise<Match> => {
    const res = await apiRequest('GET', `/api/matches/${id}`);
    return res.json();
  },
  getTicketTypes: async (matchId: number): Promise<TicketType[]> => {
    const res = await apiRequest('GET', `/api/matches/${matchId}/tickets`);
    return res.json();
  },
  create: async (matchData: Partial<Match>): Promise<Match> => {
    const res = await apiRequest('POST', '/api/admin/matches', matchData);
    return res.json();
  },
  update: async (id: number, matchData: Partial<Match>): Promise<Match> => {
    const res = await apiRequest('PATCH', `/api/admin/matches/${id}`, matchData);
    return res.json();
  },
  delete: async (id: number): Promise<boolean> => {
    await apiRequest('DELETE', `/api/admin/matches/${id}`);
    return true;
  }
};

// API client for ticket types
export const ticketTypesApi = {
  getById: async (id: number): Promise<TicketType> => {
    const res = await apiRequest('GET', `/api/ticket-types/${id}`);
    return res.json();
  },
  create: async (ticketTypeData: Partial<TicketType>): Promise<TicketType> => {
    const res = await apiRequest('POST', '/api/admin/ticket-types', ticketTypeData);
    return res.json();
  },
  update: async (id: number, ticketTypeData: Partial<TicketType>): Promise<TicketType> => {
    const res = await apiRequest('PATCH', `/api/admin/ticket-types/${id}`, ticketTypeData);
    return res.json();
  },
  delete: async (id: number): Promise<boolean> => {
    await apiRequest('DELETE', `/api/admin/ticket-types/${id}`);
    return true;
  }
};

// API client for bookings
export const bookingsApi = {
  create: async (bookingData: Partial<Booking>): Promise<Booking> => {
    const res = await apiRequest('POST', '/api/bookings', bookingData);
    return res.json();
  },
  updatePayment: async (bookingId: string, paymentData: any): Promise<Booking> => {
    const res = await apiRequest('PATCH', `/api/bookings/${bookingId}/payment`, paymentData);
    return res.json();
  },
  getByEmail: async (email: string): Promise<Booking[]> => {
    const res = await apiRequest('GET', `/api/bookings?email=${encodeURIComponent(email)}`);
    return res.json();
  },
  getByBookingId: async (bookingId: string): Promise<Booking> => {
    const res = await apiRequest('GET', `/api/bookings/${bookingId}`);
    return res.json();
  },
  getAll: async (): Promise<Booking[]> => {
    const res = await apiRequest('GET', '/api/admin/bookings');
    return res.json();
  },
  updateStatus: async (bookingId: string, status: string): Promise<Booking> => {
    const res = await apiRequest('PATCH', `/api/admin/bookings/${bookingId}/status`, { status });
    return res.json();
  }
};

// API client for UPI details
export const upiDetailsApi = {
  getActive: async (): Promise<UPIDetails> => {
    const res = await apiRequest('GET', '/api/upi-details');
    return res.json();
  },
  create: async (upiDetailData: Partial<UPIDetails>): Promise<UPIDetails> => {
    const res = await apiRequest('POST', '/api/admin/upi-details', upiDetailData);
    return res.json();
  },
  update: async (id: number, upiDetailData: Partial<UPIDetails>): Promise<UPIDetails> => {
    const res = await apiRequest('PATCH', `/api/admin/upi-details/${id}`, upiDetailData);
    return res.json();
  }
};

// API client for admin authentication
export const authApi = {
  login: async (credentials: { username: string, password: string }): Promise<Admin> => {
    const res = await apiRequest('POST', '/api/admin/login', credentials);
    return res.json();
  }
};

// Export direct fetch functions for compatibility
export async function fetchMatches(): Promise<MatchType[]> {
  const response = await fetch('/api/matches');
  if (!response.ok) throw new Error('Failed to fetch matches');
  return response.json();
}

export async function fetchMatchById(id: number): Promise<MatchType> {
  const response = await fetch(`/api/matches/${id}`);
  if (!response.ok) throw new Error('Failed to fetch match');
  return response.json();
}

export async function fetchBookingByBookingId(id: string): Promise<BookingType> {
  const response = await fetch(`/api/bookings/${id}`);
  if (!response.ok) throw new Error('Failed to fetch booking');
  return response.json();
}

export async function fetchTicketTypeById(id: number): Promise<TicketTypeType> {
  const response = await fetch(`/api/ticket-types/${id}`);
  if (!response.ok) throw new Error('Failed to fetch ticket type');
  return response.json();
}

export async function fetchUPIDetails(): Promise<UPIDetail[]> {
  const response = await fetch('/api/upi-details');
  if (!response.ok) throw new Error('Failed to fetch UPI details');
  return response.json();
}