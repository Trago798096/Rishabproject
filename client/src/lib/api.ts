import { Match, TicketType, Booking, UpiDetails } from "@shared/schema";

const BASE_URL = "/api";

export const fetchMatches = async (activeOnly: boolean = false): Promise<Match[]> => {
  const url = activeOnly ? `${BASE_URL}/matches?active=true` : `${BASE_URL}/matches`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch matches');
  return response.json();
};

class MatchesApi {
  async getMatches(): Promise<Match[]> {
    return fetchMatches();
  }

  async getMatchById(id: number): Promise<Match> {
    const response = await fetch(`${BASE_URL}/matches/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch match with ID ${id}`);
    return response.json();
  }

  async getTicketTypes(matchId: number): Promise<TicketType[]> {
    const response = await fetch(`${BASE_URL}/matches/${matchId}/tickets`);
    if (!response.ok) throw new Error('Failed to fetch ticket types');
    return response.json();
  }

  async createMatch(matchData: Partial<Match>): Promise<Match> {
    const response = await fetch(`${BASE_URL}/admin/matches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(matchData)
    });
    if (!response.ok) throw new Error('Failed to create match');
    return response.json();
  }

  async updateMatch(id: number, matchData: Partial<Match>): Promise<Match> {
    const response = await fetch(`${BASE_URL}/admin/matches/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(matchData)
    });
    if (!response.ok) throw new Error(`Failed to update match with ID ${id}`);
    return response.json();
  }

  async deleteMatch(id: number): Promise<boolean> {
    const response = await fetch(`${BASE_URL}/admin/matches/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Failed to delete match with ID ${id}`);
    return true;
  }
}

class BookingsApi {
  async createBooking(data: Partial<Booking>): Promise<Booking> {
    const response = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create booking');
    return response.json();
  }
  async updatePayment(bookingId: string, paymentData: any): Promise<Booking> {
    const response = await fetch(`${BASE_URL}/bookings/${bookingId}/payment`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    if (!response.ok) throw new Error(`Failed to update payment for booking ${bookingId}`);
    return response.json();
  }
  async getByEmail(email: string): Promise<Booking[]> {
    const response = await fetch(`${BASE_URL}/bookings?email=${encodeURIComponent(email)}`);
    if (!response.ok) throw new Error(`Failed to fetch bookings for email ${email}`);
    return response.json();
  }
  async getByBookingId(bookingId: string): Promise<Booking> {
    const response = await fetch(`${BASE_URL}/bookings/${bookingId}`);
    if (!response.ok) throw new Error(`Failed to fetch booking with ID ${bookingId}`);
    return response.json();
  }
  async getAllBookings(): Promise<Booking[]> {
    const response = await fetch(`${BASE_URL}/admin/bookings`);
    if (!response.ok) throw new Error('Failed to fetch all bookings');
    return response.json();
  }
  async updateStatus(bookingId: string, status: string): Promise<Booking> {
    const response = await fetch(`${BASE_URL}/admin/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error(`Failed to update status for booking ${bookingId}`);
    return response.json();
  }
}

class PaymentsApi {
  async getUpiDetails(): Promise<UpiDetails> {
    const response = await fetch(`${BASE_URL}/payments/upi`);
    if (!response.ok) throw new Error('Failed to fetch UPI details');
    return response.json();
  }
    async createUpiDetails(upiDetailData: Partial<UpiDetails>): Promise<UpiDetails> {
    const response = await fetch(`${BASE_URL}/admin/upi-details`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(upiDetailData)
    });
    if (!response.ok) throw new Error('Failed to create UPI details');
    return response.json();
  }
  async updateUpiDetails(id: number, upiDetailData: Partial<UpiDetails>): Promise<UpiDetails> {
    const response = await fetch(`${BASE_URL}/admin/upi-details/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(upiDetailData)
    });
    if (!response.ok) throw new Error(`Failed to update UPI details with ID ${id}`);
    return response.json();
  }
}

class AuthApi {
  async login(credentials: { username: string; password: string }): Promise<any> {
    const response = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (!response.ok) throw new Error('Failed to login');
    return response.json();
  }
}


export const matchesApi = new MatchesApi();
export const bookingsApi = new BookingsApi();
export const paymentsApi = new PaymentsApi();
export const authApi = new AuthApi();

export const ticketTypesApi = {
  getTicketTypeById: async (id: number): Promise<TicketType> => {
    const response = await fetch(`${BASE_URL}/ticket-types/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch ticket type with ID ${id}`);
    return response.json();
  },
  createTicketType: async (ticketTypeData: Partial<TicketType>): Promise<TicketType> => {
    const response = await fetch(`${BASE_URL}/admin/ticket-types`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketTypeData)
    });
    if (!response.ok) throw new Error('Failed to create ticket type');
    return response.json();
  },
  updateTicketType: async (id: number, ticketTypeData: Partial<TicketType>): Promise<TicketType> => {
    const response = await fetch(`${BASE_URL}/admin/ticket-types/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketTypeData)
    });
    if (!response.ok) throw new Error(`Failed to update ticket type with ID ${id}`);
    return response.json();
  },
  deleteTicketType: async (id: number): Promise<boolean> => {
    const response = await fetch(`${BASE_URL}/admin/ticket-types/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(`Failed to delete ticket type with ID ${id}`);
    return true;
  }
};