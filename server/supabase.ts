import { createClient } from '@supabase/supabase-js';
import type { Database } from '../shared/supabase-types';
import * as schema from "../shared/schema";
import bcrypt from 'bcryptjs';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set');
}

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Function to create tables if they don't exist
export async function migrateDatabase() {
  console.log('Starting database migration...');
  
  try {
    // Drop existing tables (optional, remove in production)
    console.log('Dropping existing tables if they exist...');
    try {
      await supabase.from('bookings').delete().neq('id', 0);
      await supabase.from('ticket_types').delete().neq('id', 0);
      await supabase.from('matches').delete().neq('id', 0);
      await supabase.from('upi_details').delete().neq('id', 0);
      await supabase.from('admin_users').delete().neq('id', 0);
    } catch (error) {
      console.log('Error clearing tables (this is normal on first run)');
    }
  } catch (error) {
    // It's okay if this fails, the stored procedure might not exist
    console.log('Could not drop tables (this is normal on first run)');
  }

  // Use Postgres service to execute SQL directly
  const POSTGRES_URL = process.env.DATABASE_URL;
  if (!POSTGRES_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  try {
    // Using the execute_sql_tool to create tables
    // Create admin_users table
    await executeSQL(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create matches table
    await executeSQL(`
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
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create ticket_types table
    await executeSQL(`
      CREATE TABLE IF NOT EXISTS ticket_types (
        id SERIAL PRIMARY KEY,
        match_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        price INTEGER NOT NULL,
        total_seats INTEGER NOT NULL,
        available_seats INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT ticket_type_match_id_name UNIQUE (match_id, name)
      );
    `);

    // Create bookings table
    await executeSQL(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        booking_id TEXT NOT NULL UNIQUE,
        match_id INTEGER NOT NULL,
        ticket_type_id INTEGER NOT NULL,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        base_amount INTEGER NOT NULL,
        service_fee INTEGER NOT NULL,
        gst INTEGER NOT NULL,
        total_amount INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        payment_method TEXT,
        utr_number TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create upi_details table
    await executeSQL(`
      CREATE TABLE IF NOT EXISTS upi_details (
        id SERIAL PRIMARY KEY,
        upi_id TEXT NOT NULL,
        qr_code TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    console.log('Database migration completed.');
  } catch (error: any) {
    console.error('Error during database migration:', error.message);
    throw error;
  }
}

// Helper function to execute SQL
async function executeSQL(query: string) {
  try {
    // Use the db-tools directly
    const { execute_sql_tool } = await import('./db-tools');
    await execute_sql_tool(query);
  } catch (error: any) {
    console.error('SQL execution error:', error.message);
    throw error;
  }
}

// Function to seed initial data
export async function seedInitialData() {
  console.log('Starting to seed initial data...');
  
  try {
    // Create admin user
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const { error: adminError } = await supabase
      .from('admin_users')
      .upsert([
        {
          username: 'admin',
          password: hashedPassword,
          name: 'Admin User'
        }
      ], { onConflict: 'username' });
    
    if (adminError) {
      console.error('Error while creating admin user:', adminError.message);
    }

    // Create UPI details
    console.log('Creating UPI details...');
    const { error: upiError } = await supabase
      .from('upi_details')
      .upsert([
        {
          upi_id: 'ipltickets@ybl',
          qr_code: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg',
          is_active: true
        }
      ], { onConflict: 'upi_id' });
    
    if (upiError) {
      console.error('Error while creating UPI details:', upiError.message);
    }

    // Create sample matches
    console.log('Creating sample matches...');
    
    const { error: matchesError } = await supabase
      .from('matches')
      .upsert([
        {
          team1: 'Royal Challengers Bengaluru',
          team2: 'Delhi Capitals',
          team1_logo: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/RCB/Logos/Roundbig/RCBroundbig.png',
          team2_logo: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/DC/Logos/Roundbig/DCroundbig.png',
          venue: 'M. Chinnaswamy Stadium, Bengaluru, Karnataka',
          stadium: 'M. Chinnaswamy Stadium',
          date: '10 April 2025',
          time: '7:30 PM IST',
          is_active: true
        },
        {
          team1: 'Chennai Super Kings',
          team2: 'Kolkata Knight Riders',
          team1_logo: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/CSK/logos/Roundbig/CSKroundbig.png',
          team2_logo: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/KKR/Logos/Roundbig/KKRroundbig.png',
          venue: 'M.A. Chidambaram Stadium, Chennai, Tamil Nadu',
          stadium: 'M.A. Chidambaram Stadium',
          date: '11 April 2025',
          time: '7:30 PM IST',
          is_active: true
        },
        {
          team1: 'Lucknow Super Giants',
          team2: 'Gujarat Titans',
          team1_logo: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/LSG/Logos/Roundbig/LSGroundbig.png',
          team2_logo: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/GT/Logos/Roundbig/GTroundbig.png',
          venue: 'BRSABV Ekana Cricket Stadium, Lucknow',
          stadium: 'BRSABV Ekana Cricket Stadium',
          date: '12 April 2025',
          time: '3:30 PM IST',
          is_active: true
        }
      ], { onConflict: 'id' });
    
    if (matchesError) {
      console.error('Error while creating matches:', matchesError.message);
    } else {
      // Get the created matches to create ticket types
      console.log('Creating ticket types...');
      const { data: matches, error: matchesQueryError } = await supabase
        .from('matches')
        .select('id');
      
      if (matchesQueryError) {
        console.error('Error fetching matches:', matchesQueryError.message);
        return;
      }
      
      if (matches && matches.length > 0) {
        // Create ticket types for each match
        for (const match of matches) {
          const { error: ticketTypesError } = await supabase
            .from('ticket_types')
            .upsert([
              {
                match_id: match.id,
                name: 'General Stand',
                description: 'Affordable seating, usually in the upper stands.',
                price: 999,
                total_seats: 1000,
                available_seats: 850
              },
              {
                match_id: match.id,
                name: 'Premium Stand',
                description: 'Better view and closer to the action.',
                price: 1990,
                total_seats: 500,
                available_seats: 420
              },
              {
                match_id: match.id,
                name: 'VIP Stand',
                description: 'Exclusive seating with food and drinks.',
                price: 5000,
                total_seats: 100,
                available_seats: 75
              }
            ], { onConflict: 'id' });
          
          if (ticketTypesError) {
            console.error('Error while creating ticket types:', ticketTypesError.message);
          }
        }
      }
    }

    console.log('Initial data seeding completed.');
  } catch (error: any) {
    console.error('Error during data seeding:', error.message);
  }
}