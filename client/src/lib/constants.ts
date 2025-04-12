export const TICKET_TYPES = [
  { id: 'general', name: 'General Stand', description: 'Affordable seating, usually in the upper stands.' },
  { id: 'premium', name: 'Premium Stand', description: 'Better view and closer to the action.' },
  { id: 'pavilion', name: 'Pavilion Stand', description: 'Premium seating with excellent view.' },
  { id: 'vip', name: 'VIP Stand', description: 'Exclusive seating with food and drinks.' },
  { id: 'corporate', name: 'Corporate Box', description: 'Private box for corporate groups with premium services.' },
  { id: 'hospitality', name: 'Hospitality Box', description: 'All-inclusive hospitality experience with top-tier service.' },
  { id: 'skybox', name: 'Skybox Lounge', description: 'Elevated experience with panoramic views of the stadium.' }
];

export const PAYMENT_METHODS = [
  { id: 'upi', name: 'UPI/QR', icon: 'qrcode' },
  { id: 'card', name: 'Cards', icon: 'credit-card' },
  { id: 'wallet', name: 'Wallet', icon: 'wallet' },
  { id: 'netbanking', name: 'Net Banking', icon: 'landmark' }
];

export const SPONSORS = [
  { name: 'Star Sports', role: 'Official Broadcaster', logo: 'https://www.iplt20.com/assets/images/sponsors-logo/star.png' },
  { name: 'TATA', role: 'Title Sponsor', logo: 'https://www.iplt20.com/assets/images/sponsors-logo/tata.png' },
  { name: 'Jio', role: 'Official Digital Streaming Partner', logo: 'https://www.iplt20.com/assets/images/sponsors-logo/jiocricket.png' },
  { name: 'RuPay', role: 'Official Partner', logo: 'https://www.iplt20.com/assets/images/sponsors-logo/rupay.png' }
];

export const STADIUM_SECTIONS = [
  { id: 'north', name: 'North Pavilion', color: 'bg-yellow-400' },
  { id: 'premium', name: 'Premium Blocks', color: 'bg-pink-400' },
  { id: 'club', name: 'Club House', color: 'bg-blue-400' }
];

export const TEAM_LOGOS = {
  'Royal Challengers Bengaluru': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/RCB/Logos/Roundbig/RCBroundbig.png',
  'Delhi Capitals': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/DC/Logos/Roundbig/DCroundbig.png',
  'Chennai Super Kings': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/CSK/logos/Roundbig/CSKroundbig.png',
  'Kolkata Knight Riders': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/KKR/Logos/Roundbig/KKRroundbig.png',
  'Mumbai Indians': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/MI/Logos/Roundbig/MIroundbig.png',
  'Sunrisers Hyderabad': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/SRH/Logos/Roundbig/SRHroundbig.png',
  'Punjab Kings': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/PBKS/Logos/Roundbig/PBKSroundbig.png',
  'Rajasthan Royals': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/RR/Logos/Roundbig/RRroundbig.png',
  'Gujarat Titans': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/GT/Logos/Roundbig/GTroundbig.png',
  'Lucknow Super Giants': 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/LSG/Logos/Roundbig/LSGroundbig.png'
};

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
export const IS_PROD = import.meta.env.PROD;