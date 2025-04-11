import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertBookingSchema, insertMatchSchema, insertTicketTypeSchema, insertUpiDetailSchema, loginSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // Get all matches
  app.get("/api/matches", async (req, res) => {
    try {
      const isActive = req.query.active === "true" ? true : 
                       req.query.active === "false" ? false : 
                       undefined;
      const matches = await storage.getMatches(isActive);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });

  // Get a specific match
  app.get("/api/matches/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid match ID" });
      }

      const match = await storage.getMatchById(id);
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }

      res.json(match);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch match" });
    }
  });

  // Get ticket types for a match
  app.get("/api/matches/:id/tickets", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid match ID" });
      }

      const match = await storage.getMatchById(id);
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }

      const ticketTypes = await storage.getTicketTypesByMatchId(id);
      res.json(ticketTypes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ticket types" });
    }
  });
  
  // Get a specific ticket type
  app.get("/api/ticket-types/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ticket type ID" });
      }

      const ticketType = await storage.getTicketTypeById(id);
      if (!ticketType) {
        return res.status(404).json({ message: "Ticket type not found" });
      }

      res.json(ticketType);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ticket type" });
    }
  });

  // Create a booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      
      // Generate unique booking ID
      const bookingId = `IPLBK${Date.now()}${Math.floor(Math.random() * 1000)}`;
      const booking = await storage.createBooking({
        ...bookingData,
        bookingId
      });

      // Update ticket availability
      await storage.updateTicketTypeAvailability(booking.ticketTypeId, booking.quantity);
      
      res.status(201).json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Update booking with payment information
  app.patch("/api/bookings/:bookingId/payment", async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { paymentMethod, utrNumber } = req.body;

      if (!paymentMethod || !utrNumber) {
        return res.status(400).json({ message: "Payment method and UTR number are required" });
      }

      const booking = await storage.updateBookingPayment(bookingId, paymentMethod, utrNumber);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to update booking payment" });
    }
  });

  // Get bookings by email
  app.get("/api/bookings", async (req, res) => {
    try {
      const { email } = req.query;
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: "Email is required" });
      }

      const bookings = await storage.getBookingsByEmail(email);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Get a specific booking
  app.get("/api/bookings/:bookingId", async (req, res) => {
    try {
      const { bookingId } = req.params;
      const booking = await storage.getBookingByBookingId(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  });

  // Get active UPI details
  app.get("/api/upi-details", async (req, res) => {
    try {
      const upiDetail = await storage.getActiveUpiDetail();
      
      if (!upiDetail) {
        return res.status(404).json({ message: "No active UPI details found" });
      }
      
      res.json(upiDetail);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch UPI details" });
    }
  });

  // Admin routes
  
  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const credentials = loginSchema.parse(req.body);
      const user = await storage.validateAdminLogin(credentials);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // For simplicity, we're not implementing real session/JWT auth
      // In a real app, you'd generate a JWT token here
      res.json({ 
        id: user.id,
        username: user.username,
        name: user.name
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid login data", errors: error.errors });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Admin: Create match
  app.post("/api/admin/matches", async (req, res) => {
    try {
      const matchData = insertMatchSchema.parse(req.body);
      const match = await storage.createMatch(matchData);
      res.status(201).json(match);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid match data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create match" });
    }
  });

  // Admin: Update match
  app.patch("/api/admin/matches/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid match ID" });
      }

      const matchData = req.body;
      const match = await storage.updateMatch(id, matchData);
      
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      
      res.json(match);
    } catch (error) {
      res.status(500).json({ message: "Failed to update match" });
    }
  });

  // Admin: Delete match
  app.delete("/api/admin/matches/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid match ID" });
      }

      const success = await storage.deleteMatch(id);
      
      if (!success) {
        return res.status(404).json({ message: "Match not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete match" });
    }
  });

  // Admin: Create ticket type
  app.post("/api/admin/ticket-types", async (req, res) => {
    try {
      const ticketTypeData = insertTicketTypeSchema.parse(req.body);
      const ticketType = await storage.createTicketType(ticketTypeData);
      res.status(201).json(ticketType);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ticket type data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create ticket type" });
    }
  });

  // Admin: Update ticket type
  app.patch("/api/admin/ticket-types/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ticket type ID" });
      }

      const ticketTypeData = req.body;
      const ticketType = await storage.updateTicketType(id, ticketTypeData);
      
      if (!ticketType) {
        return res.status(404).json({ message: "Ticket type not found" });
      }
      
      res.json(ticketType);
    } catch (error) {
      res.status(500).json({ message: "Failed to update ticket type" });
    }
  });

  // Admin: Delete ticket type
  app.delete("/api/admin/ticket-types/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ticket type ID" });
      }

      const success = await storage.deleteTicketType(id);
      
      if (!success) {
        return res.status(404).json({ message: "Ticket type not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete ticket type" });
    }
  });

  // Admin: Get all bookings
  app.get("/api/admin/bookings", async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Admin: Update booking status
  app.patch("/api/admin/bookings/:bookingId/status", async (req, res) => {
    try {
      const { bookingId } = req.params;
      const { status } = req.body;

      if (!status || !["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Valid status is required" });
      }

      const booking = await storage.updateBookingStatus(bookingId, status);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });

  // Admin: Update UPI details
  app.post("/api/admin/upi-details", async (req, res) => {
    try {
      const upiDetailData = insertUpiDetailSchema.parse(req.body);
      
      // Deactivate existing UPI details if this is active
      if (upiDetailData.isActive) {
        const currentActive = await storage.getActiveUpiDetail();
        if (currentActive) {
          await storage.updateUpiDetail(currentActive.id, { isActive: false });
        }
      }
      
      const upiDetail = await storage.createUpiDetail(upiDetailData);
      res.status(201).json(upiDetail);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid UPI details", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create UPI details" });
    }
  });

  // Admin: Update UPI details
  app.patch("/api/admin/upi-details/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid UPI details ID" });
      }

      const upiDetailData = req.body;
      
      // Deactivate existing UPI details if this is being activated
      if (upiDetailData.isActive) {
        const currentActive = await storage.getActiveUpiDetail();
        if (currentActive && currentActive.id !== id) {
          await storage.updateUpiDetail(currentActive.id, { isActive: false });
        }
      }
      
      const upiDetail = await storage.updateUpiDetail(id, upiDetailData);
      
      if (!upiDetail) {
        return res.status(404).json({ message: "UPI details not found" });
      }
      
      res.json(upiDetail);
    } catch (error) {
      res.status(500).json({ message: "Failed to update UPI details" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
