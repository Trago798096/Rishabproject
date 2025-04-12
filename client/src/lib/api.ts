import { apiRequest } from './queryClient';
import type { Match, TicketType, Booking, UPIDetails, Admin, UPIDetail } from "@shared/schema";

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return '';
  }
  return 'http://localhost:5000';
};

// API clients
export const matchesApi = {
  getAll: async (active?: boolean): Promise<Match[]> => {
    const url = active !== undefined 
      ? `/api/matches?active=${active}`
      : '/api/matches';
    return await fetchMatches();
  },
  getById: async (id: number): Promise<Match> => {
    return await fetchMatchById(id);
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
    return await fetchTicketTypeById(id);
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
    return await createBooking(bookingData);
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
    return await fetchBookingByBookingId(bookingId);
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
    return await fetchUPIDetails();
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
    return await adminLogin(credentials.username, credentials.password);
  }
};

// Direct fetch functions (moved to top)
export async function fetchMatches(): Promise<Match[]> {
  const response = await fetch('/api/matches');
  if (!response.ok) throw new Error('Failed to fetch matches');
  return response.json();
}

export async function fetchMatchById(id: number): Promise<Match> {
  const response = await fetch(`/api/matches/${id}`);
  if (!response.ok) throw new Error('Failed to fetch match');
  return response.json();
}

export async function fetchBookingByBookingId(id: string): Promise<Booking> {
  const response = await fetch(`/api/bookings/${id}`);
  if (!response.ok) throw new Error('Failed to fetch booking');
  return response.json();
}

export async function fetchTicketTypeById(id: number): Promise<TicketType> {
  const response = await fetch(`/api/ticket-types/${id}`);
  if (!response.ok) throw new Error('Failed to fetch ticket type');
  return response.json();
}

export async function fetchUPIDetails(): Promise<UPIDetail[]> {
  const response = await fetch('/api/upi-details');
  if (!response.ok) throw new Error('Failed to fetch UPI details');
  return response.json();
}

export async function createBooking(data: Partial<Booking>): Promise<Booking> {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to create booking');
  return response.json();
}

export async function adminLogin(username: string, password: string): Promise<Admin> {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) throw new Error('Failed to login');
  return response.json();
}