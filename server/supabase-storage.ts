import { 
  AdminUser, 
  Booking, 
  InsertAdminUser, 
  InsertBooking, 
  InsertMatch, 
  InsertTicketType, 
  InsertUpiDetail, 
  Match, 
  TicketType, 
  UpiDetail, 
  LoginCredentials 
} from "@shared/schema";
import { supabase } from "./supabase";
import { IStorage } from "./storage";
import bcrypt from "bcryptjs";

export class SupabaseStorage implements IStorage {
  // Admin Users
  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error || !data) return undefined;
    
    return {
      id: data.id,
      username: data.username,
      password: data.password,
      createdAt: new Date(data.created_at)
    };
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    // Hash the password
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    const { data, error } = await supabase
      .from('admin_users')
      .insert([{
        username: user.username,
        password: hashedPassword
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      username: data.username,
      password: data.password,
      createdAt: new Date(data.created_at)
    };
  }

  async validateAdminLogin(credentials: LoginCredentials): Promise<AdminUser | null> {
    const user = await this.getAdminUserByUsername(credentials.username);
    
    if (!user) return null;
    
    // For already hashed passwords in the database
    if (user.password.startsWith('$2')) {
      const isValid = await bcrypt.compare(credentials.password, user.password);
      return isValid ? user : null;
    }
    
    // For plain text passwords (only for development)
    return user.password === credentials.password ? user : null;
  }

  // Matches
  async getMatches(active?: boolean): Promise<Match[]> {
    let query = supabase.from('matches').select('*');
    
    if (active !== undefined) {
      query = query.eq('is_active', active);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data || []).map(match => ({
      id: match.id,
      team1: match.team1,
      team2: match.team2,
      date: match.date,
      venue: match.venue,
      isActive: match.is_active,
      createdAt: new Date(match.created_at)
    }));
  }

  async getMatchById(id: number): Promise<Match | undefined> {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    
    return {
      id: data.id,
      team1: data.team1,
      team2: data.team2,
      date: data.date,
      venue: data.venue,
      isActive: data.is_active,
      createdAt: new Date(data.created_at)
    };
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const { data, error } = await supabase
      .from('matches')
      .insert([{
        team1: match.team1,
        team2: match.team2,
        date: match.date,
        venue: match.venue,
        is_active: match.isActive ?? true
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      team1: data.team1,
      team2: data.team2,
      date: data.date,
      venue: data.venue,
      isActive: data.is_active,
      createdAt: new Date(data.created_at)
    };
  }

  async updateMatch(id: number, match: Partial<InsertMatch>): Promise<Match | undefined> {
    const updateData: any = {};
    
    if (match.team1 !== undefined) updateData.team1 = match.team1;
    if (match.team2 !== undefined) updateData.team2 = match.team2;
    if (match.date !== undefined) updateData.date = match.date;
    if (match.venue !== undefined) updateData.venue = match.venue;
    if (match.isActive !== undefined) updateData.is_active = match.isActive;
    
    const { data, error } = await supabase
      .from('matches')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) return undefined;
    
    return {
      id: data.id,
      team1: data.team1,
      team2: data.team2,
      date: data.date,
      venue: data.venue,
      isActive: data.is_active,
      createdAt: new Date(data.created_at)
    };
  }

  async deleteMatch(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', id);
    
    return !error;
  }

  // Ticket Types
  async getTicketTypesByMatchId(matchId: number): Promise<TicketType[]> {
    const { data, error } = await supabase
      .from('ticket_types')
      .select('*')
      .eq('match_id', matchId);
    
    if (error) throw error;
    
    return (data || []).map(ticketType => ({
      id: ticketType.id,
      matchId: ticketType.match_id,
      name: ticketType.name,
      price: ticketType.price,
      availableQuantity: ticketType.available_quantity,
      createdAt: new Date(ticketType.created_at)
    }));
  }

  async getTicketTypeById(id: number): Promise<TicketType | undefined> {
    const { data, error } = await supabase
      .from('ticket_types')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    
    return {
      id: data.id,
      matchId: data.match_id,
      name: data.name,
      price: data.price,
      availableQuantity: data.available_quantity,
      createdAt: new Date(data.created_at)
    };
  }

  async createTicketType(ticketType: InsertTicketType): Promise<TicketType> {
    const { data, error } = await supabase
      .from('ticket_types')
      .insert([{
        match_id: ticketType.matchId,
        name: ticketType.name,
        price: ticketType.price,
        available_quantity: ticketType.availableQuantity
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      matchId: data.match_id,
      name: data.name,
      price: data.price,
      availableQuantity: data.available_quantity,
      createdAt: new Date(data.created_at)
    };
  }

  async updateTicketType(id: number, ticketType: Partial<InsertTicketType>): Promise<TicketType | undefined> {
    const updateData: any = {};
    
    if (ticketType.matchId !== undefined) updateData.match_id = ticketType.matchId;
    if (ticketType.name !== undefined) updateData.name = ticketType.name;
    if (ticketType.price !== undefined) updateData.price = ticketType.price;
    if (ticketType.availableQuantity !== undefined) updateData.available_quantity = ticketType.availableQuantity;
    
    const { data, error } = await supabase
      .from('ticket_types')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) return undefined;
    
    return {
      id: data.id,
      matchId: data.match_id,
      name: data.name,
      price: data.price,
      availableQuantity: data.available_quantity,
      createdAt: new Date(data.created_at)
    };
  }

  async updateTicketTypeAvailability(id: number, quantity: number): Promise<TicketType | undefined> {
    // First get the current ticket type
    const { data: ticketType, error: getError } = await supabase
      .from('ticket_types')
      .select('*')
      .eq('id', id)
      .single();
    
    if (getError || !ticketType) return undefined;
    
    // Check if enough tickets are available
    if (ticketType.available_quantity < quantity) {
      throw new Error("Not enough tickets available");
    }
    
    // Update the availability
    const newAvailability = ticketType.available_quantity - quantity;
    
    const { data, error } = await supabase
      .from('ticket_types')
      .update({ available_quantity: newAvailability })
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) return undefined;
    
    return {
      id: data.id,
      matchId: data.match_id,
      name: data.name,
      price: data.price,
      availableQuantity: data.available_quantity,
      createdAt: new Date(data.created_at)
    };
  }

  async deleteTicketType(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('ticket_types')
      .delete()
      .eq('id', id);
    
    return !error;
  }

  // Bookings
  async getBookings(): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*');
    
    if (error) throw error;
    
    return (data || []).map(booking => ({
      id: booking.id,
      bookingId: booking.booking_id,
      matchId: booking.match_id,
      ticketTypeId: booking.ticket_type_id,
      customerName: booking.customer_name,
      customerEmail: booking.customer_email,
      customerPhone: booking.customer_phone,
      quantity: booking.quantity,
      baseAmount: booking.base_amount,
      serviceFee: booking.service_fee,
      gst: booking.gst,
      totalAmount: booking.total_amount,
      status: booking.status,
      paymentMethod: booking.payment_method,
      utrNumber: booking.utr_number,
      createdAt: new Date(booking.created_at)
    }));
  }

  async getBookingByBookingId(bookingId: string): Promise<Booking | undefined> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('booking_id', bookingId)
      .single();
    
    if (error || !data) return undefined;
    
    return {
      id: data.id,
      bookingId: data.booking_id,
      matchId: data.match_id,
      ticketTypeId: data.ticket_type_id,
      customerName: data.customer_name,
      customerEmail: data.customer_email,
      customerPhone: data.customer_phone,
      quantity: data.quantity,
      baseAmount: data.base_amount,
      serviceFee: data.service_fee,
      gst: data.gst,
      totalAmount: data.total_amount,
      status: data.status,
      paymentMethod: data.payment_method,
      utrNumber: data.utr_number,
      createdAt: new Date(data.created_at)
    };
  }

  async getBookingsByEmail(email: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('customer_email', email);
    
    if (error) throw error;
    
    return (data || []).map(booking => ({
      id: booking.id,
      bookingId: booking.booking_id,
      matchId: booking.match_id,
      ticketTypeId: booking.ticket_type_id,
      customerName: booking.customer_name,
      customerEmail: booking.customer_email,
      customerPhone: booking.customer_phone,
      quantity: booking.quantity,
      baseAmount: booking.base_amount,
      serviceFee: booking.service_fee,
      gst: booking.gst,
      totalAmount: booking.total_amount,
      status: booking.status,
      paymentMethod: booking.payment_method,
      utrNumber: booking.utr_number,
      createdAt: new Date(booking.created_at)
    }));
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        booking_id: booking.bookingId,
        match_id: booking.matchId,
        ticket_type_id: booking.ticketTypeId,
        customer_name: booking.customerName,
        customer_email: booking.customerEmail,
        customer_phone: booking.customerPhone,
        quantity: booking.quantity,
        base_amount: booking.baseAmount,
        service_fee: booking.serviceFee,
        gst: booking.gst,
        total_amount: booking.totalAmount,
        status: booking.status || 'pending',
        payment_method: booking.paymentMethod,
        utr_number: booking.utrNumber
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    // Update ticket availability
    await this.updateTicketTypeAvailability(booking.ticketTypeId, booking.quantity);
    
    return {
      id: data.id,
      bookingId: data.booking_id,
      matchId: data.match_id,
      ticketTypeId: data.ticket_type_id,
      customerName: data.customer_name,
      customerEmail: data.customer_email,
      customerPhone: data.customer_phone,
      quantity: data.quantity,
      baseAmount: data.base_amount,
      serviceFee: data.service_fee,
      gst: data.gst,
      totalAmount: data.total_amount,
      status: data.status,
      paymentMethod: data.payment_method,
      utrNumber: data.utr_number,
      createdAt: new Date(data.created_at)
    };
  }

  async updateBookingStatus(bookingId: string, status: string): Promise<Booking | undefined> {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('booking_id', bookingId)
      .select()
      .single();
    
    if (error || !data) return undefined;
    
    return {
      id: data.id,
      bookingId: data.booking_id,
      matchId: data.match_id,
      ticketTypeId: data.ticket_type_id,
      customerName: data.customer_name,
      customerEmail: data.customer_email,
      customerPhone: data.customer_phone,
      quantity: data.quantity,
      baseAmount: data.base_amount,
      serviceFee: data.service_fee,
      gst: data.gst,
      totalAmount: data.total_amount,
      status: data.status,
      paymentMethod: data.payment_method,
      utrNumber: data.utr_number,
      createdAt: new Date(data.created_at)
    };
  }

  async updateBookingPayment(bookingId: string, paymentMethod: string, utrNumber: string): Promise<Booking | undefined> {
    const { data, error } = await supabase
      .from('bookings')
      .update({ 
        payment_method: paymentMethod, 
        utr_number: utrNumber,
        status: 'payment_pending' // Update status to payment_pending
      })
      .eq('booking_id', bookingId)
      .select()
      .single();
    
    if (error || !data) return undefined;
    
    return {
      id: data.id,
      bookingId: data.booking_id,
      matchId: data.match_id,
      ticketTypeId: data.ticket_type_id,
      customerName: data.customer_name,
      customerEmail: data.customer_email,
      customerPhone: data.customer_phone,
      quantity: data.quantity,
      baseAmount: data.base_amount,
      serviceFee: data.service_fee,
      gst: data.gst,
      totalAmount: data.total_amount,
      status: data.status,
      paymentMethod: data.payment_method,
      utrNumber: data.utr_number,
      createdAt: new Date(data.created_at)
    };
  }

  // UPI Details
  async getActiveUpiDetail(): Promise<UpiDetail | undefined> {
    const { data, error } = await supabase
      .from('upi_details')
      .select('*')
      .eq('is_active', true)
      .single();
    
    if (error || !data) return undefined;
    
    return {
      id: data.id,
      upiId: data.upi_id,
      displayName: data.display_name,
      isActive: data.is_active,
      createdAt: new Date(data.created_at)
    };
  }

  async createUpiDetail(upiDetail: InsertUpiDetail): Promise<UpiDetail> {
    const { data, error } = await supabase
      .from('upi_details')
      .insert([{
        upi_id: upiDetail.upiId,
        display_name: upiDetail.displayName,
        is_active: upiDetail.isActive ?? true
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      upiId: data.upi_id,
      displayName: data.display_name,
      isActive: data.is_active,
      createdAt: new Date(data.created_at)
    };
  }

  async updateUpiDetail(id: number, upiDetail: Partial<InsertUpiDetail>): Promise<UpiDetail | undefined> {
    const updateData: any = {};
    
    if (upiDetail.upiId !== undefined) updateData.upi_id = upiDetail.upiId;
    if (upiDetail.displayName !== undefined) updateData.display_name = upiDetail.displayName;
    if (upiDetail.isActive !== undefined) updateData.is_active = upiDetail.isActive;
    
    const { data, error } = await supabase
      .from('upi_details')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error || !data) return undefined;
    
    return {
      id: data.id,
      upiId: data.upi_id,
      displayName: data.display_name,
      isActive: data.is_active,
      createdAt: new Date(data.created_at)
    };
  }
}