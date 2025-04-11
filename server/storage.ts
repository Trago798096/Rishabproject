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

// Define storage interface
export interface IStorage {
  // Admin Users
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  validateAdminLogin(credentials: LoginCredentials): Promise<AdminUser | null>;

  // Matches
  getMatches(active?: boolean): Promise<Match[]>;
  getMatchById(id: number): Promise<Match | undefined>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatch(id: number, match: Partial<InsertMatch>): Promise<Match | undefined>;
  deleteMatch(id: number): Promise<boolean>;

  // Ticket Types
  getTicketTypesByMatchId(matchId: number): Promise<TicketType[]>;
  getTicketTypeById(id: number): Promise<TicketType | undefined>;
  createTicketType(ticketType: InsertTicketType): Promise<TicketType>;
  updateTicketType(id: number, ticketType: Partial<InsertTicketType>): Promise<TicketType | undefined>;
  updateTicketTypeAvailability(id: number, quantity: number): Promise<TicketType | undefined>;
  deleteTicketType(id: number): Promise<boolean>;

  // Bookings
  getBookings(): Promise<Booking[]>;
  getBookingByBookingId(bookingId: string): Promise<Booking | undefined>;
  getBookingsByEmail(email: string): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(bookingId: string, status: string): Promise<Booking | undefined>;
  updateBookingPayment(bookingId: string, paymentMethod: string, utrNumber: string): Promise<Booking | undefined>;

  // UPI Details
  getActiveUpiDetail(): Promise<UpiDetail | undefined>;
  createUpiDetail(upiDetail: InsertUpiDetail): Promise<UpiDetail>;
  updateUpiDetail(id: number, upiDetail: Partial<InsertUpiDetail>): Promise<UpiDetail | undefined>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private adminUsers: Map<number, AdminUser>;
  private matches: Map<number, Match>;
  private ticketTypes: Map<number, TicketType>;
  private bookings: Map<number, Booking>;
  private upiDetails: Map<number, UpiDetail>;
  private adminUserId: number;
  private matchId: number;
  private ticketTypeId: number;
  private bookingId: number;
  private upiDetailId: number;

  constructor() {
    this.adminUsers = new Map();
    this.matches = new Map();
    this.ticketTypes = new Map();
    this.bookings = new Map();
    this.upiDetails = new Map();
    this.adminUserId = 1;
    this.matchId = 1;
    this.ticketTypeId = 1;
    this.bookingId = 1;
    this.upiDetailId = 1;

    // Add sample admin user
    this.createAdminUser({
      username: "admin",
      password: "admin123",
      name: "Admin User"
    });

    // Add sample UPI details
    this.createUpiDetail({
      upiId: "ipltickets@ybl",
      qrCode: "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg",
      isActive: true
    });

    // Add sample matches for IPL 2025
    this.seedMatches();
  }

  // Admin Users
  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    return Array.from(this.adminUsers.values()).find(user => user.username === username);
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const id = this.adminUserId++;
    const newUser: AdminUser = { ...user, id, createdAt: new Date() };
    this.adminUsers.set(id, newUser);
    return newUser;
  }

  async validateAdminLogin(credentials: LoginCredentials): Promise<AdminUser | null> {
    const user = await this.getAdminUserByUsername(credentials.username);
    if (user && user.password === credentials.password) {
      return user;
    }
    return null;
  }

  // Matches
  async getMatches(active?: boolean): Promise<Match[]> {
    const matches = Array.from(this.matches.values());
    if (active !== undefined) {
      return matches.filter(match => match.isActive === active);
    }
    return matches;
  }

  async getMatchById(id: number): Promise<Match | undefined> {
    return this.matches.get(id);
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const id = this.matchId++;
    const newMatch: Match = { ...match, id, createdAt: new Date() };
    this.matches.set(id, newMatch);
    return newMatch;
  }

  async updateMatch(id: number, match: Partial<InsertMatch>): Promise<Match | undefined> {
    const existingMatch = this.matches.get(id);
    if (!existingMatch) return undefined;

    const updatedMatch: Match = { ...existingMatch, ...match };
    this.matches.set(id, updatedMatch);
    return updatedMatch;
  }

  async deleteMatch(id: number): Promise<boolean> {
    return this.matches.delete(id);
  }

  // Ticket Types
  async getTicketTypesByMatchId(matchId: number): Promise<TicketType[]> {
    return Array.from(this.ticketTypes.values()).filter(
      ticketType => ticketType.matchId === matchId
    );
  }

  async getTicketTypeById(id: number): Promise<TicketType | undefined> {
    return this.ticketTypes.get(id);
  }

  async createTicketType(ticketType: InsertTicketType): Promise<TicketType> {
    const id = this.ticketTypeId++;
    const newTicketType: TicketType = { ...ticketType, id, createdAt: new Date() };
    this.ticketTypes.set(id, newTicketType);
    return newTicketType;
  }

  async updateTicketType(id: number, ticketType: Partial<InsertTicketType>): Promise<TicketType | undefined> {
    const existingTicketType = this.ticketTypes.get(id);
    if (!existingTicketType) return undefined;

    const updatedTicketType: TicketType = { ...existingTicketType, ...ticketType };
    this.ticketTypes.set(id, updatedTicketType);
    return updatedTicketType;
  }

  async updateTicketTypeAvailability(id: number, quantity: number): Promise<TicketType | undefined> {
    const ticketType = this.ticketTypes.get(id);
    if (!ticketType) return undefined;
    
    if (ticketType.availableSeats < quantity) {
      throw new Error("Not enough seats available");
    }

    const updatedTicketType: TicketType = { 
      ...ticketType, 
      availableSeats: ticketType.availableSeats - quantity 
    };
    this.ticketTypes.set(id, updatedTicketType);
    return updatedTicketType;
  }

  async deleteTicketType(id: number): Promise<boolean> {
    return this.ticketTypes.delete(id);
  }

  // Bookings
  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBookingByBookingId(bookingId: string): Promise<Booking | undefined> {
    return Array.from(this.bookings.values()).find(
      booking => booking.bookingId === bookingId
    );
  }

  async getBookingsByEmail(email: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      booking => booking.email === email
    );
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.bookingId++;
    const newBooking: Booking = { ...booking, id, createdAt: new Date() };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  async updateBookingStatus(bookingId: string, status: string): Promise<Booking | undefined> {
    const booking = await this.getBookingByBookingId(bookingId);
    if (!booking) return undefined;

    const updatedBooking: Booking = { ...booking, status };
    this.bookings.set(booking.id, updatedBooking);
    return updatedBooking;
  }

  async updateBookingPayment(bookingId: string, paymentMethod: string, utrNumber: string): Promise<Booking | undefined> {
    const booking = await this.getBookingByBookingId(bookingId);
    if (!booking) return undefined;

    const updatedBooking: Booking = { ...booking, paymentMethod, utrNumber };
    this.bookings.set(booking.id, updatedBooking);
    return updatedBooking;
  }

  // UPI Details
  async getActiveUpiDetail(): Promise<UpiDetail | undefined> {
    return Array.from(this.upiDetails.values()).find(
      upiDetail => upiDetail.isActive
    );
  }

  async createUpiDetail(upiDetail: InsertUpiDetail): Promise<UpiDetail> {
    const id = this.upiDetailId++;
    const newUpiDetail: UpiDetail = { ...upiDetail, id, createdAt: new Date() };
    this.upiDetails.set(id, newUpiDetail);
    return newUpiDetail;
  }

  async updateUpiDetail(id: number, upiDetail: Partial<InsertUpiDetail>): Promise<UpiDetail | undefined> {
    const existingUpiDetail = this.upiDetails.get(id);
    if (!existingUpiDetail) return undefined;

    const updatedUpiDetail: UpiDetail = { ...existingUpiDetail, ...upiDetail };
    this.upiDetails.set(id, updatedUpiDetail);
    return updatedUpiDetail;
  }

  // Seed initial IPL match data
  private async seedMatches() {
    // Match 1: RCB vs DC
    const match1 = await this.createMatch({
      team1: "Royal Challengers Bengaluru",
      team2: "Delhi Capitals",
      team1Logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/RCB/Logos/Roundbig/RCBroundbig.png",
      team2Logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/DC/Logos/Roundbig/DCroundbig.png",
      venue: "M. Chinnaswamy Stadium, Bengaluru, Karnataka",
      stadium: "M. Chinnaswamy Stadium",
      date: "10 April 2025",
      time: "7:30 PM IST",
      isActive: true
    });

    // Match 2: CSK vs KKR
    const match2 = await this.createMatch({
      team1: "Chennai Super Kings",
      team2: "Kolkata Knight Riders",
      team1Logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/CSK/logos/Roundbig/CSKroundbig.png",
      team2Logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/KKR/Logos/Roundbig/KKRroundbig.png",
      venue: "M.A. Chidambaram Stadium, Chennai, Tamil Nadu",
      stadium: "M.A. Chidambaram Stadium",
      date: "11 April 2025",
      time: "7:30 PM IST",
      isActive: true
    });

    // Match 3: LSG vs GT
    const match3 = await this.createMatch({
      team1: "Lucknow Super Giants",
      team2: "Gujarat Titans",
      team1Logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/LSG/Logos/Roundbig/LSGroundbig.png",
      team2Logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/GT/Logos/Roundbig/GTroundbig.png",
      venue: "BRSABV Ekana Cricket Stadium, Lucknow",
      stadium: "BRSABV Ekana Cricket Stadium",
      date: "12 April 2025",
      time: "3:30 PM IST",
      isActive: true
    });

    // Match 4: SRH vs PBKS
    const match4 = await this.createMatch({
      team1: "Sunrisers Hyderabad",
      team2: "Punjab Kings",
      team1Logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/SRH/Logos/Roundbig/SRHroundbig.png",
      team2Logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/PBKS/Logos/Roundbig/PBKSroundbig.png",
      venue: "Rajiv Gandhi International Cricket Stadium, Hyderabad",
      stadium: "Rajiv Gandhi International Cricket Stadium",
      date: "12 April 2025",
      time: "7:30 PM IST",
      isActive: true
    });

    // Add ticket types for each match
    await Promise.all([
      // Ticket types for Match 1
      this.createTicketType({
        matchId: match1.id,
        name: "General Stand",
        description: "Affordable seating, usually in the upper stands.",
        price: 999,
        totalSeats: 1000,
        availableSeats: 850
      }),
      this.createTicketType({
        matchId: match1.id,
        name: "Premium Stand",
        description: "Better view and closer to the action.",
        price: 1990,
        totalSeats: 500,
        availableSeats: 420
      }),
      this.createTicketType({
        matchId: match1.id,
        name: "Pavilion Stand",
        description: "Premium seating with excellent view.",
        price: 2999,
        totalSeats: 300,
        availableSeats: 250
      }),
      this.createTicketType({
        matchId: match1.id,
        name: "VIP Stand",
        description: "Exclusive seating with food and drinks.",
        price: 5000,
        totalSeats: 100,
        availableSeats: 75
      }),

      // Ticket types for Match 2
      this.createTicketType({
        matchId: match2.id,
        name: "General Stand",
        description: "Affordable seating, usually in the upper stands.",
        price: 999,
        totalSeats: 1000,
        availableSeats: 830
      }),
      this.createTicketType({
        matchId: match2.id,
        name: "Premium Stand",
        description: "Better view and closer to the action.",
        price: 1990,
        totalSeats: 500,
        availableSeats: 450
      }),

      // Ticket types for Match 3
      this.createTicketType({
        matchId: match3.id,
        name: "General Stand",
        description: "Affordable seating, usually in the upper stands.",
        price: 999,
        totalSeats: 1000,
        availableSeats: 900
      }),
      this.createTicketType({
        matchId: match3.id,
        name: "Premium Stand",
        description: "Better view and closer to the action.",
        price: 2000,
        totalSeats: 500,
        availableSeats: 400
      }),

      // Ticket types for Match 4
      this.createTicketType({
        matchId: match4.id,
        name: "General Stand",
        description: "Affordable seating, usually in the upper stands.",
        price: 999,
        totalSeats: 1000,
        availableSeats: 800
      }),
      this.createTicketType({
        matchId: match4.id,
        name: "Premium Stand",
        description: "Better view and closer to the action.",
        price: 1990,
        totalSeats: 500,
        availableSeats: 400
      }),
    ]);
  }
}

// Import the Supabase storage implementation
import { SupabaseStorage } from "./supabase-storage";

// Use Supabase storage implementation
import { db } from "./db";
import { eq, and, desc, SQL } from "drizzle-orm";
import { compare, hash } from "bcryptjs";
import { 
  adminUsers, 
  matches, 
  ticketTypes, 
  bookings, 
  upiDetails 
} from "@shared/schema";

class DatabaseStorage implements IStorage {
  // Admin Users
  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user;
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    // Hash the password before saving
    const hashedPassword = await hash(user.password, 10);
    const [newUser] = await db.insert(adminUsers)
      .values({ ...user, password: hashedPassword })
      .returning();
    return newUser;
  }

  async validateAdminLogin(credentials: LoginCredentials): Promise<AdminUser | null> {
    const user = await this.getAdminUserByUsername(credentials.username);
    if (!user) return null;
    
    const isValidPassword = await compare(credentials.password, user.password);
    return isValidPassword ? user : null;
  }

  // Matches
  async getMatches(active?: boolean): Promise<Match[]> {
    let query = db.select().from(matches);
    
    if (active !== undefined) {
      query = query.where(eq(matches.isActive, active));
    }
    
    return await query.orderBy(desc(matches.date));
  }

  async getMatchById(id: number): Promise<Match | undefined> {
    const [match] = await db.select().from(matches).where(eq(matches.id, id));
    return match;
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const [newMatch] = await db.insert(matches)
      .values(match)
      .returning();
    return newMatch;
  }

  async updateMatch(id: number, match: Partial<InsertMatch>): Promise<Match | undefined> {
    const [updatedMatch] = await db.update(matches)
      .set(match)
      .where(eq(matches.id, id))
      .returning();
    return updatedMatch;
  }

  async deleteMatch(id: number): Promise<boolean> {
    const result = await db.delete(matches).where(eq(matches.id, id));
    return true; // Drizzle doesn't return affected rows count directly
  }

  // Ticket Types
  async getTicketTypesByMatchId(matchId: number): Promise<TicketType[]> {
    return await db.select().from(ticketTypes).where(eq(ticketTypes.matchId, matchId));
  }

  async getTicketTypeById(id: number): Promise<TicketType | undefined> {
    const [ticketType] = await db.select().from(ticketTypes).where(eq(ticketTypes.id, id));
    return ticketType;
  }

  async createTicketType(ticketType: InsertTicketType): Promise<TicketType> {
    const [newTicketType] = await db.insert(ticketTypes)
      .values(ticketType)
      .returning();
    return newTicketType;
  }

  async updateTicketType(id: number, ticketType: Partial<InsertTicketType>): Promise<TicketType | undefined> {
    const [updatedTicketType] = await db.update(ticketTypes)
      .set(ticketType)
      .where(eq(ticketTypes.id, id))
      .returning();
    return updatedTicketType;
  }

  async updateTicketTypeAvailability(id: number, quantity: number): Promise<TicketType | undefined> {
    const ticketType = await this.getTicketTypeById(id);
    if (!ticketType) return undefined;
    
    const newAvailableSeats = Math.max(0, ticketType.availableSeats - quantity);
    
    const [updatedTicketType] = await db.update(ticketTypes)
      .set({ availableSeats: newAvailableSeats })
      .where(eq(ticketTypes.id, id))
      .returning();
    
    return updatedTicketType;
  }

  async deleteTicketType(id: number): Promise<boolean> {
    await db.delete(ticketTypes).where(eq(ticketTypes.id, id));
    return true;
  }

  // Bookings
  async getBookings(): Promise<Booking[]> {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }

  async getBookingByBookingId(bookingId: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.bookingId, bookingId));
    return booking;
  }

  async getBookingsByEmail(email: string): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.email, email));
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db.insert(bookings)
      .values(booking)
      .returning();
    
    // Update ticket availability
    await this.updateTicketTypeAvailability(booking.ticketTypeId, booking.quantity);
    
    return newBooking;
  }

  async updateBookingStatus(bookingId: string, status: string): Promise<Booking | undefined> {
    const [updatedBooking] = await db.update(bookings)
      .set({ status })
      .where(eq(bookings.bookingId, bookingId))
      .returning();
    return updatedBooking;
  }

  async updateBookingPayment(bookingId: string, paymentMethod: string, utrNumber: string): Promise<Booking | undefined> {
    const [updatedBooking] = await db.update(bookings)
      .set({ paymentMethod, utrNumber })
      .where(eq(bookings.bookingId, bookingId))
      .returning();
    return updatedBooking;
  }

  // UPI Details
  async getActiveUpiDetail(): Promise<UpiDetail | undefined> {
    const [upiDetail] = await db.select().from(upiDetails).where(eq(upiDetails.isActive, true));
    return upiDetail;
  }

  async createUpiDetail(upiDetail: InsertUpiDetail): Promise<UpiDetail> {
    // If this is set as active, deactivate all others
    if (upiDetail.isActive) {
      await db.update(upiDetails).set({ isActive: false });
    }
    
    const [newUpiDetail] = await db.insert(upiDetails)
      .values(upiDetail)
      .returning();
    return newUpiDetail;
  }

  async updateUpiDetail(id: number, upiDetail: Partial<InsertUpiDetail>): Promise<UpiDetail | undefined> {
    // If this is set as active, deactivate all others
    if (upiDetail.isActive) {
      await db.update(upiDetails)
        .set({ isActive: false })
        .where(eq(upiDetails.isActive, true));
    }
    
    const [updatedUpiDetail] = await db.update(upiDetails)
      .set(upiDetail)
      .where(eq(upiDetails.id, id))
      .returning();
    return updatedUpiDetail;
  }
}

// Switch to Database Storage
export const storage = new DatabaseStorage();

// Seed initial data
export async function seedInitialData() {
  try {
    console.log('Starting to seed initial data with Drizzle...');
    
    // Create admin user if it doesn't exist
    console.log('Creating admin user...');
    const existingAdmin = await storage.getAdminUserByUsername('sanyamgulathi1@gmail.com');
    
    if (!existingAdmin) {
      await storage.createAdminUser({
        username: 'sanyamgulathi1@gmail.com',
        password: '798096', // This will be hashed by the storage method
        name: 'Sanyam Gulathi'
      });
    }
    
    // Create UPI details if they don't exist
    console.log('Creating UPI details...');
    const existingUpi = await storage.getActiveUpiDetail();
    
    if (!existingUpi) {
      await storage.createUpiDetail({
        upiId: 'ipltickets@ybl',
        qrCode: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg',
        isActive: true
      });
    }
    
    // Create sample matches if they don't exist
    console.log('Creating sample matches...');
    const matches = await storage.getMatches();
    
    if (matches.length === 0) {
      // Match 1: RCB vs DC
      const match1 = await storage.createMatch({
        team1: "Royal Challengers Bengaluru",
        team2: "Delhi Capitals",
        team1Logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/RCB/Logos/Roundbig/RCBroundbig.png",
        team2Logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/DC/Logos/Roundbig/DCroundbig.png",
        venue: "M. Chinnaswamy Stadium, Bengaluru, Karnataka",
        stadium: "M. Chinnaswamy Stadium",
        date: "10 April 2025",
        time: "7:30 PM IST",
        isActive: true
      });
      
      // Match 2: CSK vs KKR
      const match2 = await storage.createMatch({
        team1: "Chennai Super Kings",
        team2: "Kolkata Knight Riders",
        team1Logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/CSK/logos/Roundbig/CSKroundbig.png",
        team2Logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/KKR/Logos/Roundbig/KKRroundbig.png",
        venue: "M.A. Chidambaram Stadium, Chennai, Tamil Nadu",
        stadium: "M.A. Chidambaram Stadium",
        date: "11 April 2025",
        time: "7:30 PM IST",
        isActive: true
      });
      
      // Match 3: LSG vs GT
      const match3 = await storage.createMatch({
        team1: "Lucknow Super Giants",
        team2: "Gujarat Titans",
        team1Logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/LSG/Logos/Roundbig/LSGroundbig.png",
        team2Logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/GT/Logos/Roundbig/GTroundbig.png",
        venue: "BRSABV Ekana Cricket Stadium, Lucknow",
        stadium: "BRSABV Ekana Cricket Stadium",
        date: "12 April 2025",
        time: "3:30 PM IST",
        isActive: true
      });
      
      // Match 4: SRH vs PBKS
      const match4 = await storage.createMatch({
        team1: "Sunrisers Hyderabad",
        team2: "Punjab Kings",
        team1Logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/SRH/Logos/Roundbig/SRHroundbig.png",
        team2Logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/PBKS/Logos/Roundbig/PBKSroundbig.png",
        venue: "Rajiv Gandhi International Cricket Stadium, Hyderabad",
        stadium: "Rajiv Gandhi International Cricket Stadium",
        date: "12 April 2025",
        time: "7:30 PM IST",
        isActive: true
      });
      
      // Create ticket types for Match 1
      console.log('Creating ticket types for matches...');
      await storage.createTicketType({
        matchId: match1.id,
        name: "General Stand",
        description: "Affordable seating, usually in the upper stands.",
        price: 999,
        totalSeats: 1000,
        availableSeats: 850
      });
      
      await storage.createTicketType({
        matchId: match1.id,
        name: "Premium Stand",
        description: "Better view and closer to the action.",
        price: 1990,
        totalSeats: 500,
        availableSeats: 420
      });
      
      await storage.createTicketType({
        matchId: match1.id,
        name: "Pavilion Stand",
        description: "Premium seating with excellent view.",
        price: 2999,
        totalSeats: 300,
        availableSeats: 250
      });
      
      await storage.createTicketType({
        matchId: match1.id,
        name: "VIP Stand",
        description: "Exclusive seating with food and drinks.",
        price: 5000,
        totalSeats: 100,
        availableSeats: 75
      });
      
      // Create ticket types for Match 2
      await storage.createTicketType({
        matchId: match2.id,
        name: "General Stand",
        description: "Affordable seating, usually in the upper stands.",
        price: 999,
        totalSeats: 1000,
        availableSeats: 830
      });
      
      await storage.createTicketType({
        matchId: match2.id,
        name: "Premium Stand",
        description: "Better view and closer to the action.",
        price: 1990,
        totalSeats: 500,
        availableSeats: 450
      });
      
      // Create ticket types for Match 3
      await storage.createTicketType({
        matchId: match3.id,
        name: "General Stand",
        description: "Affordable seating, usually in the upper stands.",
        price: 999,
        totalSeats: 1000,
        availableSeats: 900
      });
      
      await storage.createTicketType({
        matchId: match3.id,
        name: "Premium Stand",
        description: "Better view and closer to the action.",
        price: 2000,
        totalSeats: 500,
        availableSeats: 400
      });
      
      // Create ticket types for Match 4
      await storage.createTicketType({
        matchId: match4.id,
        name: "General Stand",
        description: "Affordable seating, usually in the upper stands.",
        price: 999,
        totalSeats: 1000,
        availableSeats: 800
      });
      
      await storage.createTicketType({
        matchId: match4.id,
        name: "Premium Stand",
        description: "Better view and closer to the action.",
        price: 1990,
        totalSeats: 500,
        availableSeats: 400
      });
    }
    
    console.log('Initial data seeding with Drizzle completed.');
  } catch (error) {
    console.error('Error seeding initial data with Drizzle:', error);
  }
}
