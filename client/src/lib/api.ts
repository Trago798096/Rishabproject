import { apiRequest } from "./queryClient";
import { 
  Booking, 
  InsertBooking, 
  InsertMatch, 
  InsertTicketType, 
  InsertUpiDetail, 
  LoginCredentials, 
  Match, 
  TicketType, 
  UpiDetail 
} from "@shared/schema";

// Matches
export const fetchMatches = (active?: boolean) => {
  const query = active !== undefined ? `?active=${active}` : '';
  return fetch(`/api/matches${query}`, { credentials: 'include' })
    .then(res => res.json());
};

export const fetchMatchById = (id: number) => {
  return fetch(`/api/matches/${id}`, { credentials: 'include' })
    .then(res => res.json());
};

export const fetchTicketTypesByMatchId = (matchId: number) => {
  return fetch(`/api/matches/${matchId}/tickets`, { credentials: 'include' })
    .then(res => res.json());
};

export const fetchTicketTypeById = (id: number) => {
  return fetch(`/api/ticket-types/${id}`, { credentials: 'include' })
    .then(res => res.json());
};

// Bookings
export const createBooking = (booking: InsertBooking) => {
  return apiRequest('POST', '/api/bookings', booking);
};

export const updateBookingPayment = (bookingId: string, paymentMethod: string, utrNumber: string) => {
  return apiRequest('PATCH', `/api/bookings/${bookingId}/payment`, { paymentMethod, utrNumber });
};

export const fetchBookingsByEmail = (email: string) => {
  return fetch(`/api/bookings?email=${encodeURIComponent(email)}`, { credentials: 'include' })
    .then(res => res.json());
};

export const fetchBookingByBookingId = (bookingId: string) => {
  return fetch(`/api/bookings/${bookingId}`, { credentials: 'include' })
    .then(res => res.json());
};

// UPI Details
export const fetchActiveUpiDetail = () => {
  return fetch('/api/upi-details', { credentials: 'include' })
    .then(res => res.json());
};

// Admin
export const adminLogin = (credentials: LoginCredentials) => {
  return apiRequest('POST', '/api/admin/login', credentials);
};

export const adminCreateMatch = (match: InsertMatch) => {
  return apiRequest('POST', '/api/admin/matches', match);
};

export const adminUpdateMatch = (id: number, match: Partial<InsertMatch>) => {
  return apiRequest('PATCH', `/api/admin/matches/${id}`, match);
};

export const adminDeleteMatch = (id: number) => {
  return apiRequest('DELETE', `/api/admin/matches/${id}`);
};

export const adminCreateTicketType = (ticketType: InsertTicketType) => {
  return apiRequest('POST', '/api/admin/ticket-types', ticketType);
};

export const adminUpdateTicketType = (id: number, ticketType: Partial<InsertTicketType>) => {
  return apiRequest('PATCH', `/api/admin/ticket-types/${id}`, ticketType);
};

export const adminDeleteTicketType = (id: number) => {
  return apiRequest('DELETE', `/api/admin/ticket-types/${id}`);
};

export const adminFetchAllBookings = () => {
  return fetch('/api/admin/bookings', { credentials: 'include' })
    .then(res => res.json());
};

export const adminUpdateBookingStatus = (bookingId: string, status: string) => {
  return apiRequest('PATCH', `/api/admin/bookings/${bookingId}/status`, { status });
};

export const adminCreateUpiDetail = (upiDetail: InsertUpiDetail) => {
  return apiRequest('POST', '/api/admin/upi-details', upiDetail);
};

export const adminUpdateUpiDetail = (id: number, upiDetail: Partial<InsertUpiDetail>) => {
  return apiRequest('PATCH', `/api/admin/upi-details/${id}`, upiDetail);
};
