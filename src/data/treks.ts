export type Difficulty = 'Easy' | 'Moderate' | 'Tough';

export interface Trek {
  id: string;
  slug: string;
  name: string;
  location: string;
  region: string;
  difficulty: Difficulty;
  duration: string;
  price: number;
  groupSize: string;
  image: string;
  includes: string[];
  carry: string[];
  about: string;
  heritage: string;
  whyTrek: string;
  photos: [string, string];
  meetingPoint: string;
  nextDate: string;
  isMonsoonPick: boolean;
  operatorName: string;
  operatorInstagram: string; // without @
}

export const WHATSAPP_NUMBER = '919689486540'; // Replace with your number

export const TREKS: Trek[] = [
  {
    id: '1',
    slug: 'lohagad-fort',
    name: 'Lohagad Fort',
    location: 'Lonavala',
    region: 'Pune Sahyadri',
    difficulty: 'Easy',
    duration: '1 Day',
    price: 799,
    groupSize: '15–25',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
    includes: ['Bus from Swargate', 'Certified guide', 'Safety briefing', 'Trek permit'],
    carry: ['Water (2L min)', 'Waterproof shoes', 'Rain cover', 'Light snacks'],
    about: 'Lohagad Fort sits at 1033m near Lonavala. One of the best monsoon treks — lush greenery, misty valleys, and 400 years of Maratha history.',
    heritage: 'Built 1564 · Secured by Shivaji after the Treaty of Purandar',
    whyTrek: 'The Vinchu Kata ridge juts into monsoon clouds — best aerial viewpoint in the Sahyadris',
    photos: [
      'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80',
    ],
    meetingPoint: 'Swargate Bus Stop, Pune',
    nextDate: 'Every Saturday',
    isMonsoonPick: true,
    operatorName: 'Adventure Geek',
    operatorInstagram: 'adventuregeekpune',
  },
  {
    id: '2',
    slug: 'harihar-fort',
    name: 'Harihar Fort',
    location: 'Nashik',
    region: 'Nashik Sahyadri',
    difficulty: 'Tough',
    duration: '1 Day',
    price: 1299,
    groupSize: '10–15',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80',
    includes: ['Bus from Swargate', 'Expert guide', 'Safety kit', 'Trek permit'],
    carry: ['Water (3L min)', 'Trekking shoes', 'Gloves', 'Headlamp', 'Rain jacket'],
    about: "Harihar Fort's near-vertical rock-cut stairs are legendary. Rated tough — high endurance required. Rewarded with 360° views across the Sahyadri ranges.",
    heritage: '13th-century Yadava fort · Captured by Shivaji Maharaj in 1636',
    whyTrek: '80° near-vertical rock-cut steps — the most dramatic climb in Maharashtra',
    photos: [
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=400&q=80',
    ],
    meetingPoint: 'Swargate Bus Stop, Pune',
    nextDate: 'Every Sunday',
    isMonsoonPick: false,
    operatorName: 'TrekFit Adventures',
    operatorInstagram: 'trekfitadventures',
  },
  {
    id: '3',
    slug: 'kalsubai-peak',
    name: 'Kalsubai Peak',
    location: 'Igatpuri',
    region: 'Nashik Sahyadri',
    difficulty: 'Moderate',
    duration: '1 Day',
    price: 999,
    groupSize: '15–25',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    includes: ['Bus from Deccan', 'Certified guide', 'Safety briefing', 'Breakfast'],
    carry: ['Water (2L)', 'Trekking shoes', 'Light jacket', 'Sunscreen'],
    about: "Maharashtra's highest peak at 1646m. On a clear monsoon day the Sahyadri ranges stretch endlessly below you. A classic bucket list trek.",
    heritage: 'Sacred Kalsubai goddess shrine at summit · Highest peak in Maharashtra at 1,646m',
    whyTrek: 'Summit at dawn — the Sahyadri spine stretches 100 km in every direction',
    photos: [
      'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?auto=format&fit=crop&w=400&q=80',
    ],
    meetingPoint: 'Deccan Gymkhana, Pune',
    nextDate: 'Every Saturday & Sunday',
    isMonsoonPick: true,
    operatorName: 'Sahyadri Rangers',
    operatorInstagram: 'sahyadrirangers',
  },
  {
    id: '4',
    slug: 'rajgad-fort',
    name: 'Rajgad Fort',
    location: 'Rajgad, Pune',
    region: 'Pune Sahyadri',
    difficulty: 'Moderate',
    duration: '2 Days',
    price: 1799,
    groupSize: '12–20',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80',
    includes: ['Bus from Swargate', 'Expert guide', 'Night camping', 'Dinner + Breakfast', 'Trek permit'],
    carry: ['Water (3L)', 'Sleeping bag', 'Trekking shoes', 'Warm layer', 'Torch'],
    about: "Shivaji Maharaj's capital for 26 years. Rajgad is a history lesson on foot. Camp overnight inside a Maratha fort under a sky full of stars.",
    heritage: "Shivaji's capital for 26 years · Padmavati palace complex still intact on the plateau",
    whyTrek: 'Sleep inside a Maratha fort — torch-lit ramparts, silence, and 1,000m of vertical below',
    photos: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&w=400&q=80',
    ],
    meetingPoint: 'Swargate Bus Stop, Pune',
    nextDate: '1st & 3rd weekend monthly',
    isMonsoonPick: false,
    operatorName: 'Fort Trails Pune',
    operatorInstagram: 'forttrailspune',
  },
  {
    id: '5',
    slug: 'sandhan-valley',
    name: 'Sandhan Valley',
    location: 'Ahmednagar',
    region: 'Ahmednagar Sahyadri',
    difficulty: 'Tough',
    duration: '2 Days',
    price: 2499,
    groupSize: '8–12',
    image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80',
    includes: ['Bus from Swargate', 'Expert guides (2)', 'Rappelling gear', 'Night camping', 'All meals'],
    carry: ['Water (4L)', 'Dry bag', 'Sturdy footwear', 'Extra clothing', 'First aid'],
    about: 'Known as the Valley of Shadows. Swim through icy mountain pools, rappel down waterfalls, camp in a slot canyon. Unique to Maharashtra — unlike anything else.',
    heritage: 'Ancient Sahyadri slot canyon carved by the Samrad river · Untouched for centuries',
    whyTrek: 'Swim through shadow pools at the bottom of a 200m gorge — unlike anything else in India',
    photos: [
      'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=400&q=80',
    ],
    meetingPoint: 'Swargate Bus Stop, Pune',
    nextDate: '2nd & 4th weekend monthly',
    isMonsoonPick: true,
    operatorName: 'Wild Sahyadri',
    operatorInstagram: 'wildsahyadri',
  },
  {
    id: '6',
    slug: 'rajmachi-trek',
    name: 'Rajmachi Trek',
    location: 'Lonavala',
    region: 'Pune Sahyadri',
    difficulty: 'Easy',
    duration: '1 Day',
    price: 849,
    groupSize: '15–25',
    image: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=800&q=80',
    includes: ['Bus from Swargate', 'Certified guide', 'Safety briefing'],
    carry: ['Water (2L)', 'Comfortable shoes', 'Rain cover', 'Snacks'],
    about: 'Twin forts, a living village, and the most lush trail in the Sahyadris. Perfect first trek for beginners. Green, scenic, and easy on the knees.',
    heritage: 'Twin forts Shrivardhan & Manaranjan · Guard the ancient Bor Ghat trade route',
    whyTrek: 'A living wadi village halfway up — chai, local food, and the greenest trail in the Sahyadris',
    photos: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=400&q=80',
    ],
    meetingPoint: 'Swargate Bus Stop, Pune',
    nextDate: 'Every Saturday & Sunday',
    isMonsoonPick: true,
    operatorName: 'Adventure Geek',
    operatorInstagram: 'adventuregeekpune',
  },
];
