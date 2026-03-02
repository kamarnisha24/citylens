// ─────────────────────────────────────────────
//  CityLens — Mock Data (MVP)
// ─────────────────────────────────────────────

const CITIES = [
  { id: "bengaluru", name: "Bengaluru", state: "Karnataka", population: "1.2 Cr", area: "741 km²", score: 72, lat: 12.9716, lng: 77.5946, known: "Silicon Valley of India", issues: 234 },
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", population: "2.1 Cr", area: "603 km²", score: 68, lat: 19.0760, lng: 72.8777, known: "City of Dreams", issues: 312 },
  { id: "delhi", name: "Delhi", state: "Delhi", population: "3.2 Cr", area: "1484 km²", score: 61, lat: 28.6139, lng: 77.2090, known: "Capital of India", issues: 445 },
  { id: "chennai", name: "Chennai", state: "Tamil Nadu", population: "87 Lakh", area: "426 km²", score: 74, lat: 13.0827, lng: 80.2707, known: "Detroit of Asia", issues: 198 },
  { id: "hyderabad", name: "Hyderabad", state: "Telangana", population: "1 Cr", area: "650 km²", score: 70, lat: 17.3850, lng: 78.4867, known: "City of Pearls", issues: 267 },
  { id: "pune", name: "Pune", state: "Maharashtra", population: "63 Lakh", area: "331 km²", score: 76, lat: 18.5204, lng: 73.8567, known: "Oxford of the East", issues: 176 },
  { id: "jaipur", name: "Jaipur", state: "Rajasthan", population: "38 Lakh", area: "485 km²", score: 65, lat: 26.9124, lng: 75.7873, known: "Pink City", issues: 221 },
  { id: "kolkata", name: "Kolkata", state: "West Bengal", population: "1.5 Cr", area: "185 km²", score: 59, lat: 22.5726, lng: 88.3639, known: "City of Joy", issues: 389 },
  { id: "ahmedabad", name: "Ahmedabad", state: "Gujarat", population: "80 Lakh", area: "476 km²", score: 71, lat: 23.0225, lng: 72.5714, known: "Manchester of India", issues: 203 },
  { id: "surat", name: "Surat", state: "Gujarat", population: "70 Lakh", area: "326 km²", score: 78, lat: 21.1702, lng: 72.8311, known: "Diamond City", issues: 154 },
  { id: "lucknow", name: "Lucknow", state: "Uttar Pradesh", population: "36 Lakh", area: "350 km²", score: 63, lat: 26.8467, lng: 80.9462, known: "City of Nawabs", issues: 278 },
  { id: "patna", name: "Patna", state: "Bihar", population: "25 Lakh", area: "136 km²", score: 52, lat: 25.5941, lng: 85.1376, known: "Magadh Empire Capital", issues: 341 },
  { id: "bhopal", name: "Bhopal", state: "Madhya Pradesh", population: "23 Lakh", area: "285 km²", score: 66, lat: 23.2599, lng: 77.4126, known: "City of Lakes", issues: 189 },
  { id: "kochi", name: "Kochi", state: "Kerala", population: "22 Lakh", area: "94 km²", score: 79, lat: 9.9312, lng: 76.2673, known: "Queen of Arabian Sea", issues: 132 },
  { id: "indore", name: "Indore", state: "Madhya Pradesh", population: "34 Lakh", area: "362 km²", score: 80, lat: 22.7196, lng: 75.8577, known: "Mini Mumbai", issues: 118 },
];

const LANDMARKS = {
  bengaluru: [
    { id: "cb1", name: "Cubbon Park", category: "Parks & Green Spaces", status: "green", lat: 12.9763, lng: 77.5929, icon: "🌳", reports: 3, lastUpdated: "28 Feb 2026", authority: "BBMP", description: "A landmark, century-old park in the heart of Bengaluru." },
    { id: "vr1", name: "Vidhana Soudha", category: "Government Offices", status: "green", lat: 12.9795, lng: 77.5906, icon: "🏛️", reports: 1, lastUpdated: "1 Mar 2026", authority: "Government of Karnataka", description: "The seat of the Karnataka state legislature." },
    { id: "ln1", name: "Lal Nagar Bridge", category: "Bridges", status: "red", lat: 12.9640, lng: 77.5990, icon: "🌉", reports: 47, lastUpdated: "15 Jan 2026", authority: "BBMP", description: "Major bridge connecting Lal Nagar to Ring Road." },
    { id: "an1", name: "Anna Nagar Road, Sector 7", category: "Roads & Highways", status: "yellow", lat: 12.9900, lng: 77.5800, icon: "🛣️", reports: 23, lastUpdated: "20 Feb 2026", authority: "BBMP Roads Division", description: "Key arterial road through Anna Nagar residential zone." },
    { id: "ah1", name: "Bowring Hospital", category: "Hospitals", status: "green", lat: 12.9739, lng: 77.6051, icon: "🏥", reports: 5, lastUpdated: "27 Feb 2026", authority: "BBMP Health", description: "Government district hospital serving East Bengaluru." },
    { id: "ks1", name: "Kendriya Vidyalaya, MG Road", category: "Schools & Colleges", status: "yellow", lat: 12.9757, lng: 77.6065, icon: "🏫", reports: 9, lastUpdated: "22 Feb 2026", authority: "KVS Board", description: "Central government school with infrastructure concerns." },
    { id: "pt1", name: "Majestic Bus Stand", category: "Public Amenities", status: "yellow", lat: 12.9769, lng: 77.5713, icon: "🚻", reports: 18, lastUpdated: "25 Feb 2026", authority: "BMTC", description: "Bengaluru's largest public bus terminal." },
    { id: "mk1", name: "KR Market", category: "Markets & Commerce", status: "green", lat: 12.9625, lng: 77.5796, icon: "🏪", reports: 7, lastUpdated: "1 Mar 2026", authority: "BBMP Markets", description: "Iconic wholesale flower and vegetable market." },
  ],
  mumbai: [
    { id: "gw1", name: "Gateway of India", category: "Government Offices", status: "green", lat: 18.9220, lng: 72.8347, icon: "🏛️", reports: 2, lastUpdated: "28 Feb 2026", authority: "ASI", description: "Iconic arch monument on the waterfront." },
    { id: "ma1", name: "Marine Drive", category: "Roads & Highways", status: "yellow", lat: 18.9438, lng: 72.8231, icon: "🛣️", reports: 14, lastUpdated: "20 Feb 2026", authority: "MCGM", description: "3.6 km-long promenade along the Arabian Sea coast." },
    { id: "df1", name: "Dharavi Flyover", category: "Bridges", status: "red", lat: 19.0413, lng: 72.8544, icon: "🌉", reports: 38, lastUpdated: "10 Jan 2026", authority: "MMRDA", description: "Flyover connecting Dharavi to Sion, showing structural wear." },
    { id: "jh1", name: "JJ Hospital", category: "Hospitals", status: "green", lat: 18.9640, lng: 72.8355, icon: "🏥", reports: 4, lastUpdated: "27 Feb 2026", authority: "GoM Health", description: "Largest government hospital in Mumbai." },
    { id: "sp1", name: "Sanjay Gandhi National Park", category: "Parks & Green Spaces", status: "green", lat: 19.2142, lng: 72.9063, icon: "🌳", reports: 6, lastUpdated: "1 Mar 2026", authority: "Forest Dept", description: "A major national park within Mumbai city limits." },
  ],
  delhi: [
    { id: "ip1", name: "India Gate", category: "Government Offices", status: "green", lat: 28.6129, lng: 77.2295, icon: "🏛️", reports: 1, lastUpdated: "1 Mar 2026", authority: "NDMC", description: "War memorial and national monument." },
    { id: "yf1", name: "Yamuna Flyover", category: "Bridges", status: "red", lat: 28.6562, lng: 77.2410, icon: "🌉", reports: 52, lastUpdated: "5 Jan 2026", authority: "PWD Delhi", description: "Critical bridge showing foundation deterioration." },
    { id: "aiims", name: "AIIMS Delhi", category: "Hospitals", status: "green", lat: 28.5672, lng: 77.2100, icon: "🏥", reports: 3, lastUpdated: "28 Feb 2026", authority: "MoH India", description: "India's premier medical institution." },
    { id: "lp1", name: "Lodhi Garden", category: "Parks & Green Spaces", status: "green", lat: 28.5931, lng: 77.2236, icon: "🌳", reports: 5, lastUpdated: "26 Feb 2026", authority: "ASI", description: "Historic park with medieval monuments." },
    { id: "cr1", name: "Chandni Chowk Road", category: "Roads & Highways", status: "yellow", lat: 28.6507, lng: 77.2334, icon: "🛣️", reports: 27, lastUpdated: "18 Feb 2026", authority: "MCD", description: "Oldest and busiest road in Old Delhi." },
  ],
};

const COMPLAINTS = [
  { id: "c1", landmark: "Lal Nagar Bridge", category: "Infrastructure", severity: "critical", text: "Structural crack has widened significantly. Dangerous for vehicles!", votes: 47, time: "2 hrs ago", status: "open", color: "red" },
  { id: "c2", landmark: "Anna Nagar Road, Sector 7", category: "Roads", severity: "high", text: "Potholes causing accidents. At least 3 incidents this week.", votes: 23, time: "5 hrs ago", status: "open", color: "yellow" },
  { id: "c3", landmark: "Majestic Bus Stand", category: "Sanitation", severity: "medium", text: "Public toilets non-functional. No water supply for 3 days.", votes: 18, time: "1 day ago", status: "in-review", color: "yellow" },
  { id: "c4", landmark: "Kendriya Vidyalaya, MG Road", category: "Infrastructure", severity: "medium", text: "Boundary wall collapsed. School building leaking in rains.", votes: 9, time: "2 days ago", status: "in-review", color: "yellow" },
  { id: "c5", landmark: "Bowring Hospital", category: "Services", severity: "low", text: "Parking area flooded. Ambulance access blocked.", votes: 5, time: "3 days ago", status: "open", color: "green" },
];

const SUGGESTIONS = [
  { id: "s1", landmark: "Cubbon Park", category: "Environment", text: "Install solar-powered lights along the jogging path. Safe for evening runners!", votes: 32, time: "1 day ago" },
  { id: "s2", landmark: "Majestic Bus Stand", category: "Infrastructure", text: "Add covered seating for 200+ daily commuters. Current benches are broken.", votes: 28, time: "2 days ago" },
  { id: "s3", landmark: "Anna Nagar Road, Sector 7", category: "Roads", text: "Install speed bumps near school zones to reduce accidents.", votes: 19, time: "3 days ago" },
  { id: "s4", landmark: "KR Market", category: "Sanitation", text: "Build a proper waste segregation station near the market entrance.", votes: 14, time: "4 days ago" },
];

const TREND_DATA = {
  labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
  bengaluru: [63, 65, 64, 67, 68, 66, 70, 71, 69, 70, 71, 72],
  mumbai: [60, 62, 61, 65, 66, 64, 66, 67, 65, 66, 67, 68],
  delhi: [55, 57, 58, 60, 61, 59, 62, 63, 61, 60, 61, 61],
  chennai: [68, 70, 71, 72, 73, 72, 73, 74, 73, 74, 74, 74],
  hyderabad: [64, 66, 65, 68, 69, 67, 69, 70, 69, 70, 70, 70],
  pune: [70, 72, 73, 74, 75, 74, 75, 76, 75, 76, 76, 76],
};

const IMPROVEMENT_HISTORY = {
  "ln1": [
    { date: "Jan 15, 2026", event: "Complaint filed by citizen with photos", type: "complaint" },
    { date: "Feb 3, 2026", event: "Authority (BBMP) acknowledged the report", type: "authority" },
    { date: "Feb 18, 2026", event: "Structural engineer assigned for inspection", type: "authority" },
    { date: "Mar 2, 2026", event: "Repair work scheduled for March 15", type: "info" },
  ],
  "an1": [
    { date: "Feb 10, 2026", event: "First pothole complaint received", type: "complaint" },
    { date: "Feb 20, 2026", event: "BBMP Roads Division acknowledged", type: "authority" },
    { date: "Mar 1, 2026", event: "Repair materials procured", type: "info" },
  ],
};

// ─────────────────────────────────────────────
//  Photo Reports — linked to landmark IDs
// ─────────────────────────────────────────────
const PHOTO_REPORTS = [
  {
    id: "ph1", landmarkId: "ln1",
    lat: 12.9642, lng: 77.5992,
    severity: "red",
    emoji: "🌉",
    title: "Structural Crack — Lal Nagar Bridge",
    caption: "Large crack visible on the central support pillar. Widening since Jan 2026.",
    uploaded: "Jan 15, 2026", uploadedBy: "Ravi K.",
    type: "before",
    thumbBg: "linear-gradient(135deg,#E74C3C,#c0392b)",
    comments: [
      { author: "Priya M.", text: "I drive over this daily — very scary!", votes: 34, time: "2 days ago" },
      { author: "BBMP Desk", text: "Acknowledged. Engineer inspection scheduled.", votes: 12, time: "1 day ago" },
      { author: "Suresh B.", text: "The crack is now almost 5 cm wide. Urgent!", votes: 28, time: "5 hrs ago" },
    ]
  },
  {
    id: "ph2", landmarkId: "ln1",
    lat: 12.9641, lng: 77.5988,
    severity: "red",
    emoji: "🌉",
    title: "Rusted Railing — Lal Nagar Bridge",
    caption: "Side railing completely rusted — poses safety risk for pedestrians crossing the bridge.",
    uploaded: "Feb 3, 2026", uploadedBy: "Anjali T.",
    type: "before",
    thumbBg: "linear-gradient(135deg,#c0392b,#7b241c)",
    comments: [
      { author: "Divya S.", text: "We avoid this side at night completely.", votes: 19, time: "3 days ago" },
    ]
  },
  {
    id: "ph3", landmarkId: "an1",
    lat: 12.9902, lng: 77.5802,
    severity: "yellow",
    emoji: "🛣️",
    title: "Deep Pothole — Anna Nagar Sector 7",
    caption: "Pothole is nearly 30cm deep. Three accidents reported near this spot this month.",
    uploaded: "Feb 10, 2026", uploadedBy: "Mohan L.",
    type: "before",
    thumbBg: "linear-gradient(135deg,#FFC107,#e67e22)",
    comments: [
      { author: "Karan R.", text: "My bike tyre burst here. Terrible!", votes: 45, time: "4 days ago" },
      { author: "Lakshmi V.", text: "BBMP please fix this before the rains!", votes: 31, time: "2 days ago" },
    ]
  },
  {
    id: "ph4", landmarkId: "an1",
    lat: 12.9898, lng: 77.5798,
    severity: "yellow",
    emoji: "🛣️",
    title: "Road Waterlogging — Anna Nagar",
    caption: "Entire stretch floods within minutes of rain due to blocked drainage.",
    uploaded: "Feb 20, 2026", uploadedBy: "Nithya P.",
    type: "before",
    thumbBg: "linear-gradient(135deg,#e67e22,#d35400)",
    comments: [
      { author: "Arjun G.", text: "Drainage was blocked since last monsoon!", votes: 22, time: "1 day ago" },
    ]
  },
  {
    id: "ph5", landmarkId: "pt1",
    lat: 12.9771, lng: 77.5715,
    severity: "yellow",
    emoji: "🚻",
    title: "Broken Toilet Door — Majestic Bus Stand",
    caption: "Main door of public restroom is broken and unhygienic. No water supply for 3 days.",
    uploaded: "Feb 25, 2026", uploadedBy: "Rekha C.",
    type: "before",
    thumbBg: "linear-gradient(135deg,#9b59b6,#6c3483)",
    comments: [
      { author: "Meera D.", text: "Women are unable to use the facilities here!", votes: 57, time: "3 days ago" },
      { author: "BMTC Help", text: "Complaint registered. Maintenance team alerted.", votes: 8, time: "2 days ago" },
    ]
  },
  {
    id: "ph6", landmarkId: "cb1",
    lat: 12.9761, lng: 77.5931,
    severity: "green",
    emoji: "🌳",
    title: "New Solar Lights — Cubbon Park",
    caption: "Solar-powered pathway lights installed along jogging trail. Park now safe at night.",
    uploaded: "Feb 28, 2026", uploadedBy: "Park Admin",
    type: "after",
    thumbBg: "linear-gradient(135deg,#28A745,#1e8449)",
    comments: [
      { author: "Swathi N.", text: "Finally! The park feels safe now in evenings.", votes: 89, time: "5 hrs ago" },
      { author: "Rajiv M.", text: "Great initiative by BBMP!", votes: 42, time: "3 hrs ago" },
    ]
  },
  {
    id: "ph7", landmarkId: "cb1",
    lat: 12.9765, lng: 77.5927,
    severity: "green",
    emoji: "🌳",
    title: "Broken Pathway — Cubbon Park (Before)",
    caption: "Pathway lights were broken and path was unsafe for joggers in the evening.",
    uploaded: "Jan 20, 2026", uploadedBy: "Jogger's Club",
    type: "before",
    thumbBg: "linear-gradient(135deg,#27ae60,#145a32)",
    comments: [
      { author: "Anand S.", text: "We reported this 3 months ago. Good it got fixed!", votes: 33, time: "1 day ago" },
    ]
  },
  {
    id: "ph8", landmarkId: "mk1",
    lat: 12.9627, lng: 77.5798,
    severity: "green",
    emoji: "🏪",
    title: "Clean Market Initiative — KR Market",
    caption: "New waste segregation bins installed at the market entrance. Clean-up drive successful.",
    uploaded: "Mar 1, 2026", uploadedBy: "BBMP Markets",
    type: "general",
    thumbBg: "linear-gradient(135deg,#1abc9c,#148f77)",
    comments: [
      { author: "Vendor A.", text: "Market looks much cleaner than before.", votes: 21, time: "2 hrs ago" },
    ]
  },
];
