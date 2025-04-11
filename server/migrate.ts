import { db } from './db';
import { adminUsers, matches, ticketTypes, bookings, upiDetails } from '@shared/schema';
import { sql } from 'drizzle-orm';
import { supabase } from './supabase';

// Delay function to wait for schema cache to update
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function migrate() {
  console.log('Starting database migration...');

  try {
    // Drop existing tables if they exist (for clean migration)
    console.log('Dropping existing tables if they exist...');
    
    try {
      await supabase.rpc('execute_sql', { query: 'DROP TABLE IF EXISTS bookings CASCADE' });
      await supabase.rpc('execute_sql', { query: 'DROP TABLE IF EXISTS ticket_types CASCADE' });
      await supabase.rpc('execute_sql', { query: 'DROP TABLE IF EXISTS matches CASCADE' });
      await supabase.rpc('execute_sql', { query: 'DROP TABLE IF EXISTS admin_users CASCADE' });
      await supabase.rpc('execute_sql', { query: 'DROP TABLE IF EXISTS upi_details CASCADE' });
    } catch (error) {
      console.error('Error dropping tables:', error);
    }
    
    await delay(1000); // Wait for Supabase to process the drops
    
    // Create admin_users table
    console.log('Creating admin_users table...');
    await supabase.rpc('execute_sql', { 
      query: `
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `});

    await delay(1000); // Wait for Supabase to update schema cache

    // Create matches table
    console.log('Creating matches table...');
    await supabase.rpc('execute_sql', { 
      query: `
      CREATE TABLE IF NOT EXISTS matches (
        id SERIAL PRIMARY KEY,
        team1 TEXT NOT NULL,
        team2 TEXT NOT NULL,
        team1_logo TEXT,
        team2_logo TEXT,
        venue TEXT NOT NULL,
        stadium TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `});

    await delay(1000); // Wait for Supabase to update schema cache

    // Create ticket_types table
    console.log('Creating ticket_types table...');
    await supabase.rpc('execute_sql', { 
      query: `
      CREATE TABLE IF NOT EXISTS ticket_types (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        match_id INTEGER NOT NULL REFERENCES matches(id),
        description TEXT,
        price INTEGER NOT NULL,
        total_seats INTEGER NOT NULL,
        available_seats INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `});

    await delay(1000); // Wait for Supabase to update schema cache

    // Create bookings table
    console.log('Creating bookings table...');
    await supabase.rpc('execute_sql', { 
      query: `
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        booking_id TEXT NOT NULL,
        match_id INTEGER NOT NULL REFERENCES matches(id),
        ticket_type_id INTEGER NOT NULL REFERENCES ticket_types(id),
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        base_amount INTEGER NOT NULL,
        gst INTEGER NOT NULL,
        service_fee INTEGER NOT NULL,
        total_amount INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        payment_method TEXT,
        utr_number TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `});

    await delay(1000); // Wait for Supabase to update schema cache

    // Create upi_details table
    console.log('Creating upi_details table...');
    await supabase.rpc('execute_sql', { 
      query: `
      CREATE TABLE IF NOT EXISTS upi_details (
        id SERIAL PRIMARY KEY,
        upi_id TEXT NOT NULL,
        qr_code TEXT,
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `});

    await delay(2000); // Wait for Supabase to update schema cache

    console.log('Database migration completed.');
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

export { migrate, delay };