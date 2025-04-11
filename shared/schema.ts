import { pgTable, text, serial, integer, boolean, timestamp, json, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Admin Users
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

// Matches
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  team1: text("team1").notNull(),
  team2: text("team2").notNull(),
  team1Logo: text("team1_logo"),
  team2Logo: text("team2_logo"),
  venue: text("venue").notNull(),
  stadium: text("stadium").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
});

// Ticket Types for Matches
export const ticketTypes = pgTable("ticket_types", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  totalSeats: integer("total_seats").notNull(),
  availableSeats: integer("available_seats").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    matchIdIdx: unique("ticket_type_match_id_name").on(table.matchId, table.name),
  };
});

export const insertTicketTypeSchema = createInsertSchema(ticketTypes).omit({
  id: true,
  createdAt: true,
});

// Bookings
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  bookingId: text("booking_id").notNull().unique(),
  matchId: integer("match_id").notNull(),
  ticketTypeId: integer("ticket_type_id").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  quantity: integer("quantity").notNull(),
  baseAmount: integer("base_amount").notNull(),
  gst: integer("gst").notNull(),
  serviceFee: integer("service_fee").notNull(),
  totalAmount: integer("total_amount").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  paymentMethod: text("payment_method"),
  utrNumber: text("utr_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

// UPI Details
export const upiDetails = pgTable("upi_details", {
  id: serial("id").primaryKey(),
  upiId: text("upi_id").notNull(),
  qrCode: text("qr_code"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUpiDetailSchema = createInsertSchema(upiDetails).omit({
  id: true,
  createdAt: true,
});

// Define types
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;

export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;

export type TicketType = typeof ticketTypes.$inferSelect;
export type InsertTicketType = z.infer<typeof insertTicketTypeSchema>;

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export type UpiDetail = typeof upiDetails.$inferSelect;
export type InsertUpiDetail = z.infer<typeof insertUpiDetailSchema>;

// Login Schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginCredentials = z.infer<typeof loginSchema>;
