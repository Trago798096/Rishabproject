import { supabase } from './supabase';
import { generateBookingId } from '../shared/utils';
import { delay } from './migrate';

// Helper function to log errors
const logError = (action: string, error: any) => {
  console.error(`Error while ${action}:`, error.message);
  if (error.details) console.error("Details:", error.details);
  if (error.hint) console.error("Hint:", error.hint);
  if (error.code) console.error("Code:", error.code);
};

// Function to seed initial data
export async function seedInitialData() {
  try {
    console.log('Starting to seed initial data...');
    
    // Check if admin user exists
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('id')
      .eq('username', 'admin')
      .single();
    
    // Create admin user if it doesn't exist
    if (!existingAdmin) {
      console.log('Creating admin user...');
      try {
        const { error } = await supabase.from('admin_users').insert({
          username: 'admin',
          password: 'admin123',
          name: 'Admin User'
        });
        if (error) logError('creating admin user', error);
      } catch (err) {
        logError('creating admin user', err);
      }
    }
    
    // Check if UPI details exist
    const { data: existingUpi } = await supabase
      .from('upi_details')
      .select('id')
      .single();
    
    // Create UPI details if they don't exist
    if (!existingUpi) {
      console.log('Creating UPI details...');
      try {
        const { error } = await supabase.from('upi_details').insert({
          upi_id: 'ipltickets@ybl',
          qr_code: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg',
          is_active: true
        });
        if (error) logError('creating UPI details', error);
      } catch (err) {
        logError('creating UPI details', err);
      }
    }
    
    // Check if matches exist
    const { data: existingMatches } = await supabase
      .from('matches')
      .select('id');
    
    // Create sample matches if they don't exist
    if (!existingMatches || existingMatches.length === 0) {
      console.log('Creating sample matches...');
      
      // Match 1: RCB vs DC
      let match1;
      try {
        const { data, error } = await supabase
          .from('matches')
          .insert({
            team1: "Royal Challengers Bengaluru",
            team2: "Delhi Capitals",
            team1_logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/RCB/Logos/Roundbig/RCBroundbig.png",
            team2_logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/DC/Logos/Roundbig/DCroundbig.png",
            venue: "M. Chinnaswamy Stadium, Bengaluru, Karnataka",
            stadium: "M. Chinnaswamy Stadium",
            date: "10 April 2025",
            time: "7:30 PM IST",
            is_active: true
          })
          .select()
          .single();
        
        if (error) {
          logError('creating match 1', error);
        } else {
          match1 = data;
        }
      } catch (err) {
        logError('creating match 1', err);
      }
      
      // Match 2: CSK vs KKR
      const { data: match2 } = await supabase
        .from('matches')
        .insert({
          team1: "Chennai Super Kings",
          team2: "Kolkata Knight Riders",
          team1_logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/CSK/logos/Roundbig/CSKroundbig.png",
          team2_logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/KKR/Logos/Roundbig/KKRroundbig.png",
          venue: "M.A. Chidambaram Stadium, Chennai, Tamil Nadu",
          stadium: "M.A. Chidambaram Stadium",
          date: "11 April 2025",
          time: "7:30 PM IST",
          is_active: true
        })
        .select()
        .single();
      
      // Match 3: LSG vs GT
      const { data: match3 } = await supabase
        .from('matches')
        .insert({
          team1: "Lucknow Super Giants",
          team2: "Gujarat Titans",
          team1_logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/LSG/Logos/Roundbig/LSGroundbig.png",
          team2_logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/GT/Logos/Roundbig/GTroundbig.png",
          venue: "BRSABV Ekana Cricket Stadium, Lucknow",
          stadium: "BRSABV Ekana Cricket Stadium",
          date: "12 April 2025",
          time: "3:30 PM IST",
          is_active: true
        })
        .select()
        .single();
      
      // Match 4: SRH vs PBKS
      const { data: match4 } = await supabase
        .from('matches')
        .insert({
          team1: "Sunrisers Hyderabad",
          team2: "Punjab Kings",
          team1_logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/SRH/Logos/Roundbig/SRHroundbig.png",
          team2_logo: "https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/PBKS/Logos/Roundbig/PBKSroundbig.png",
          venue: "Rajiv Gandhi International Cricket Stadium, Hyderabad",
          stadium: "Rajiv Gandhi International Cricket Stadium",
          date: "12 April 2025",
          time: "7:30 PM IST",
          is_active: true
        })
        .select()
        .single();
      
      // Create ticket types for Match 1
      if (match1) {
        console.log('Creating ticket types for Match 1...');
        await supabase.from('ticket_types').insert([
          {
            match_id: match1.id,
            name: "General Stand",
            description: "Affordable seating, usually in the upper stands.",
            price: 999,
            total_seats: 1000,
            available_seats: 850
          },
          {
            match_id: match1.id,
            name: "Premium Stand",
            description: "Better view and closer to the action.",
            price: 1990,
            total_seats: 500,
            available_seats: 420
          },
          {
            match_id: match1.id,
            name: "Pavilion Stand",
            description: "Premium seating with excellent view.",
            price: 2999,
            total_seats: 300,
            available_seats: 250
          },
          {
            match_id: match1.id,
            name: "VIP Stand",
            description: "Exclusive seating with food and drinks.",
            price: 5000,
            total_seats: 100,
            available_seats: 75
          }
        ]);
      }
      
      // Create ticket types for Match 2
      if (match2) {
        console.log('Creating ticket types for Match 2...');
        await supabase.from('ticket_types').insert([
          {
            matchId: match2.id,
            name: "General Stand",
            description: "Affordable seating, usually in the upper stands.",
            price: 999,
            totalSeats: 1000,
            availableSeats: 830
          },
          {
            matchId: match2.id,
            name: "Premium Stand",
            description: "Better view and closer to the action.",
            price: 1990,
            totalSeats: 500,
            availableSeats: 450
          }
        ]);
      }
      
      // Create ticket types for Match 3
      if (match3) {
        console.log('Creating ticket types for Match 3...');
        await supabase.from('ticket_types').insert([
          {
            matchId: match3.id,
            name: "General Stand",
            description: "Affordable seating, usually in the upper stands.",
            price: 999,
            totalSeats: 1000,
            availableSeats: 900
          },
          {
            matchId: match3.id,
            name: "Premium Stand",
            description: "Better view and closer to the action.",
            price: 2000,
            totalSeats: 500,
            availableSeats: 400
          }
        ]);
      }
      
      // Create ticket types for Match 4
      if (match4) {
        console.log('Creating ticket types for Match 4...');
        await supabase.from('ticket_types').insert([
          {
            matchId: match4.id,
            name: "General Stand",
            description: "Affordable seating, usually in the upper stands.",
            price: 999,
            totalSeats: 1000,
            availableSeats: 800
          },
          {
            matchId: match4.id,
            name: "Premium Stand",
            description: "Better view and closer to the action.",
            price: 1990,
            totalSeats: 500,
            availableSeats: 400
          }
        ]);
      }
    }
    
    console.log('Initial data seeding completed.');
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
}