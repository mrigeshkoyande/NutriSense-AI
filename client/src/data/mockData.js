// ===== SentraAI Mock Data =====

export const VISITOR_PHOTOS = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/65.jpg',
  'https://randomuser.me/api/portraits/women/28.jpg',
  'https://randomuser.me/api/portraits/men/75.jpg',
  'https://randomuser.me/api/portraits/women/63.jpg',
  'https://randomuser.me/api/portraits/men/41.jpg',
  'https://randomuser.me/api/portraits/women/17.jpg',
  'https://randomuser.me/api/portraits/men/22.jpg',
  'https://randomuser.me/api/portraits/women/55.jpg',
];

export const VISITOR_NAMES = [
  'Arjun Mehta', 'Priya Sharma', 'Ravi Kumar', 'Neha Patel',
  'Vikram Singh', 'Ananya Gupta', 'Rohan Joshi', 'Kavya Nair',
  'Amit Deshmukh', 'Sanya Reddy', 'Karan Malhotra', 'Divya Iyer'
];

export const PURPOSES = [
  'Package Delivery', 'Meeting', 'Maintenance', 'Guest Visit',
  'Food Delivery', 'Service Request', 'Interview', 'Plumbing Repair',
  'Courier', 'House Help', 'Medical Visit', 'Construction Work'
];

export const UNITS = [
  'A-101', 'A-202', 'B-303', 'A-404', 'C-105',
  'B-206', 'C-307', 'A-508', 'B-109', 'C-410'
];

export function generateTrustScore() {
  const rand = Math.random();
  if (rand > 0.7) return { score: Math.floor(Math.random() * 30) + 10, level: 'High' };
  if (rand > 0.3) return { score: Math.floor(Math.random() * 30) + 40, level: 'Medium' };
  return { score: Math.floor(Math.random() * 25) + 75, level: 'Low' };
}

export function getTrustColor(level) {
  switch (level) {
    case 'Low': return { color: '#34d399', bg: 'rgba(52, 211, 153, 0.1)', label: 'Low Risk' };
    case 'Medium': return { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)', label: 'Medium Risk' };
    case 'High': return { color: '#f87171', bg: 'rgba(248, 113, 113, 0.1)', label: 'High Risk' };
    default: return { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', label: 'Unknown' };
  }
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysBack = 30) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  d.setHours(Math.floor(Math.random() * 14) + 6);
  d.setMinutes(Math.floor(Math.random() * 60));
  return d;
}

function generateVisitorId() {
  return 'VIS-' + Math.random().toString(36).substr(2, 8).toUpperCase();
}

export function generateVisitors(count = 50) {
  const visitors = [];
  for (let i = 0; i < count; i++) {
    const trust = generateTrustScore();
    const entryDate = randomDate();
    const exitDate = new Date(entryDate.getTime() + Math.floor(Math.random() * 180 + 10) * 60000);
    const statuses = ['approved', 'approved', 'approved', 'pending', 'denied', 'approved'];
    const status = randomFrom(statuses);
    visitors.push({
      id: generateVisitorId(),
      name: randomFrom(VISITOR_NAMES),
      photo: VISITOR_PHOTOS[i % VISITOR_PHOTOS.length],
      purpose: randomFrom(PURPOSES),
      unit: randomFrom(UNITS),
      trustScore: trust.score,
      trustLevel: trust.level,
      status,
      entryTime: entryDate.toISOString(),
      exitTime: status === 'approved' ? exitDate.toISOString() : null,
      faceMatch: Math.floor(Math.random() * 20) + 80,
      verificationMethod: randomFrom(['Face ID', 'OTP', 'QR Code', 'Face ID + OTP']),
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    });
  }
  return visitors.sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime));
}

export function generateAlerts(count = 20) {
  const types = [
    { type: 'face_mismatch', title: 'Face Mismatch Detected', severity: 'high', icon: '⚠️' },
    { type: 'blacklisted', title: 'Blacklisted Visitor Attempt', severity: 'critical', icon: '🚫' },
    { type: 'suspicious_pattern', title: 'Suspicious Visit Pattern', severity: 'medium', icon: '🔍' },
    { type: 'unauthorized_zone', title: 'Unauthorized Zone Access', severity: 'high', icon: '🚨' },
    { type: 'repeated_visit', title: 'Repeated Visit Anomaly', severity: 'low', icon: '🔄' },
    { type: 'fake_id', title: 'Potential Fake Identity', severity: 'critical', icon: '🎭' },
    { type: 'tailgating', title: 'Tailgating Detected', severity: 'high', icon: '👥' },
    { type: 'overstay', title: 'Visitor Overstay Alert', severity: 'medium', icon: '⏰' },
  ];

  const alerts = [];
  for (let i = 0; i < count; i++) {
    const template = randomFrom(types);
    const date = randomDate(7);
    alerts.push({
      id: 'ALT-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      ...template,
      visitor: randomFrom(VISITOR_NAMES),
      location: randomFrom(['Gate A', 'Gate B', 'Lobby', 'Parking', 'Building C Entry']),
      timestamp: date.toISOString(),
      read: Math.random() > 0.4,
      resolved: Math.random() > 0.5,
    });
  }
  return alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export function generateDashboardStats() {
  return {
    totalVisitors: 1247,
    todayVisitors: 38,
    activeAlerts: 5,
    pendingApprovals: 3,
    avgTrustScore: 72,
    deniedEntries: 12,
    weeklyChange: '+12.5%',
    monthlyVisitors: [
      { day: 'Mon', count: 45 },
      { day: 'Tue', count: 62 },
      { day: 'Wed', count: 38 },
      { day: 'Thu', count: 71 },
      { day: 'Fri', count: 55 },
      { day: 'Sat', count: 28 },
      { day: 'Sun', count: 15 },
    ],
    riskDistribution: { low: 68, medium: 22, high: 10 },
    recentActivity: [
      { time: '2 min ago', event: 'Visitor approved via Face ID', type: 'success' },
      { time: '5 min ago', event: 'OTP sent to Unit A-202', type: 'info' },
      { time: '12 min ago', event: 'Suspicious pattern flagged', type: 'warning' },
      { time: '18 min ago', event: 'Blacklisted visitor blocked', type: 'danger' },
      { time: '25 min ago', event: 'New visitor registered', type: 'success' },
      { time: '33 min ago', event: 'Emergency alert triggered', type: 'danger' },
    ],
    hourlyTraffic: [
      { hour: '6AM', count: 3 }, { hour: '7AM', count: 8 }, { hour: '8AM', count: 15 },
      { hour: '9AM', count: 22 }, { hour: '10AM', count: 28 }, { hour: '11AM', count: 18 },
      { hour: '12PM', count: 12 }, { hour: '1PM', count: 14 }, { hour: '2PM', count: 20 },
      { hour: '3PM', count: 24 }, { hour: '4PM', count: 16 }, { hour: '5PM', count: 10 },
      { hour: '6PM', count: 6 }, { hour: '7PM', count: 4 }, { hour: '8PM', count: 2 },
    ],
  };
}

export function generateBlacklist() {
  return [
    { id: 'BL-001', name: 'Suresh Yadav', reason: 'Identity Fraud', addedOn: '2026-03-10', photo: VISITOR_PHOTOS[3], attempts: 4 },
    { id: 'BL-002', name: 'Unknown Person', reason: 'Tailgating + Fake ID', addedOn: '2026-03-15', photo: VISITOR_PHOTOS[6], attempts: 2 },
    { id: 'BL-003', name: 'Rahul Verma', reason: 'Theft Report', addedOn: '2026-02-28', photo: VISITOR_PHOTOS[8], attempts: 7 },
    { id: 'BL-004', name: 'Meena Das', reason: 'Repeated Unauthorized Access', addedOn: '2026-03-20', photo: VISITOR_PHOTOS[1], attempts: 3 },
  ];
}

export function generateUsers() {
  return [
    { id: 'USR-001', name: 'Admin User', email: 'admin@sentraai.com', role: 'admin', status: 'active', avatar: VISITOR_PHOTOS[0] },
    { id: 'USR-002', name: 'Rajesh Guard', email: 'guard1@sentraai.com', role: 'guard', status: 'active', avatar: VISITOR_PHOTOS[2] },
    { id: 'USR-003', name: 'Priya Resident', email: 'resident1@sentraai.com', role: 'resident', status: 'active', avatar: VISITOR_PHOTOS[1] },
    { id: 'USR-004', name: 'Vikram Guard', email: 'guard2@sentraai.com', role: 'guard', status: 'inactive', avatar: VISITOR_PHOTOS[4] },
    { id: 'USR-005', name: 'Neha Resident', email: 'resident2@sentraai.com', role: 'resident', status: 'active', avatar: VISITOR_PHOTOS[3] },
  ];
}

export const HEATMAP_DATA = Array.from({ length: 7 }, (_, dayIndex) =>
  Array.from({ length: 24 }, (_, hourIndex) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][dayIndex],
    hour: hourIndex,
    value: Math.floor(Math.random() * 10),
  }))
).flat();
