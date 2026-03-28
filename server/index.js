const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// ===== Mock Data =====
const visitors = [];
const alerts = [];
const users = [
  { id: 'USR-001', name: 'Admin User', email: 'admin@sentraai.com', role: 'admin', status: 'active' },
  { id: 'USR-002', name: 'Rajesh Guard', email: 'guard1@sentraai.com', role: 'guard', status: 'active' },
  { id: 'USR-003', name: 'Priya Resident', email: 'resident1@sentraai.com', role: 'resident', status: 'active' },
];
const blacklist = [];

// ===== Health Check =====
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

// ===== Auth Routes =====
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  // Demo login - accept any credentials
  const user = users.find(u => u.email === email) || {
    id: 'USR-' + Math.random().toString(36).substr(2, 6),
    name: 'Demo User',
    email,
    role: role || 'admin',
    status: 'active',
  };
  res.json({
    success: true,
    user,
    token: 'demo-jwt-token-' + Date.now(),
  });
});

// ===== Visitor Routes =====
app.get('/api/visitors', (req, res) => {
  const { status, risk, search, page = 1, limit = 20 } = req.query;
  let filtered = [...visitors];
  
  if (status) filtered = filtered.filter(v => v.status === status);
  if (risk) filtered = filtered.filter(v => v.trustLevel === risk);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(v =>
      v.name.toLowerCase().includes(q) ||
      v.id.toLowerCase().includes(q) ||
      v.purpose.toLowerCase().includes(q)
    );
  }
  
  const total = filtered.length;
  const offset = (page - 1) * limit;
  const paged = filtered.slice(offset, offset + parseInt(limit));
  
  res.json({
    visitors: paged,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / limit),
  });
});

app.post('/api/visitors', (req, res) => {
  const { name, phone, purpose, unit, photo } = req.body;
  
  // Simulate AI verification
  const trustScore = Math.floor(Math.random() * 60) + 40;
  const trustLevel = trustScore >= 75 ? 'Low' : trustScore >= 45 ? 'Medium' : 'High';
  const faceMatch = Math.floor(Math.random() * 15) + 85;
  
  const visitor = {
    id: 'VIS-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
    name: name || 'Unknown Visitor',
    phone,
    purpose,
    unit,
    photo,
    trustScore,
    trustLevel,
    faceMatch,
    status: trustLevel === 'High' ? 'denied' : 'pending',
    verificationMethod: 'Face ID + OTP',
    entryTime: new Date().toISOString(),
    exitTime: null,
    otp: Math.floor(100000 + Math.random() * 900000),
  };
  
  visitors.unshift(visitor);
  
  // Generate alert for high risk
  if (trustLevel === 'High') {
    alerts.unshift({
      id: 'ALT-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      type: 'face_mismatch',
      title: 'High Risk Visitor Detected',
      severity: 'high',
      icon: '⚠️',
      visitor: visitor.name,
      location: 'Main Gate',
      timestamp: new Date().toISOString(),
      read: false,
      resolved: false,
    });
  }
  
  res.json({
    success: true,
    visitor,
    message: trustLevel === 'High' ? 'Access denied - high risk detected' : 'Verification pending approval',
  });
});

app.put('/api/visitors/:id/approve', (req, res) => {
  const visitor = visitors.find(v => v.id === req.params.id);
  if (visitor) {
    visitor.status = 'approved';
    res.json({ success: true, visitor });
  } else {
    res.status(404).json({ error: 'Visitor not found' });
  }
});

app.put('/api/visitors/:id/deny', (req, res) => {
  const visitor = visitors.find(v => v.id === req.params.id);
  if (visitor) {
    visitor.status = 'denied';
    res.json({ success: true, visitor });
  } else {
    res.status(404).json({ error: 'Visitor not found' });
  }
});

app.put('/api/visitors/:id/exit', (req, res) => {
  const visitor = visitors.find(v => v.id === req.params.id);
  if (visitor) {
    visitor.exitTime = new Date().toISOString();
    res.json({ success: true, visitor });
  } else {
    res.status(404).json({ error: 'Visitor not found' });
  }
});

// ===== OTP Routes =====
app.post('/api/otp/send', (req, res) => {
  const { visitorId, unit } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  res.json({
    success: true,
    message: `OTP ${otp} sent to resident of ${unit}`,
    otp,
  });
});

app.post('/api/otp/verify', (req, res) => {
  const { visitorId, otp } = req.body;
  // Always verify in demo mode
  res.json({ success: true, verified: true, message: 'OTP verified successfully' });
});

// ===== Alerts Routes =====
app.get('/api/alerts', (req, res) => {
  const { severity, resolved } = req.query;
  let filtered = [...alerts];
  if (severity) filtered = filtered.filter(a => a.severity === severity);
  if (resolved !== undefined) filtered = filtered.filter(a => a.resolved === (resolved === 'true'));
  res.json({ alerts: filtered, total: filtered.length });
});

app.put('/api/alerts/:id/resolve', (req, res) => {
  const alert = alerts.find(a => a.id === req.params.id);
  if (alert) {
    alert.resolved = true;
    alert.read = true;
    res.json({ success: true, alert });
  } else {
    res.status(404).json({ error: 'Alert not found' });
  }
});

app.put('/api/alerts/:id/read', (req, res) => {
  const alert = alerts.find(a => a.id === req.params.id);
  if (alert) {
    alert.read = true;
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Alert not found' });
  }
});

app.post('/api/alerts/emergency', (req, res) => {
  const emergency = {
    id: 'ALT-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    type: 'emergency',
    title: 'Emergency Alert Triggered',
    severity: 'critical',
    icon: '🚨',
    visitor: 'System',
    location: 'All Zones',
    timestamp: new Date().toISOString(),
    read: false,
    resolved: false,
  };
  alerts.unshift(emergency);
  res.json({ success: true, alert: emergency, message: 'Emergency alert triggered' });
});

// ===== Admin Routes =====
app.get('/api/admin/dashboard', (req, res) => {
  res.json({
    totalVisitors: visitors.length,
    todayVisitors: visitors.filter(v => {
      const today = new Date().toDateString();
      return new Date(v.entryTime).toDateString() === today;
    }).length,
    activeAlerts: alerts.filter(a => !a.resolved).length,
    pendingApprovals: visitors.filter(v => v.status === 'pending').length,
    avgTrustScore: visitors.length > 0
      ? Math.round(visitors.reduce((sum, v) => sum + v.trustScore, 0) / visitors.length)
      : 0,
    deniedEntries: visitors.filter(v => v.status === 'denied').length,
  });
});

// Users management
app.get('/api/admin/users', (req, res) => {
  res.json({ users });
});

app.post('/api/admin/users', (req, res) => {
  const { name, email, role } = req.body;
  const user = {
    id: 'USR-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
    name, email, role, status: 'active',
  };
  users.push(user);
  res.json({ success: true, user });
});

app.delete('/api/admin/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  if (index >= 0) {
    users.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Blacklist management
app.get('/api/admin/blacklist', (req, res) => {
  res.json({ blacklist });
});

app.post('/api/admin/blacklist', (req, res) => {
  const { name, reason, photo } = req.body;
  const entry = {
    id: 'BL-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
    name, reason, photo,
    addedOn: new Date().toISOString().split('T')[0],
    attempts: 0,
  };
  blacklist.push(entry);
  res.json({ success: true, entry });
});

app.delete('/api/admin/blacklist/:id', (req, res) => {
  const index = blacklist.findIndex(b => b.id === req.params.id);
  if (index >= 0) {
    blacklist.splice(index, 1);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Entry not found' });
  }
});

// ===== AI Simulation Routes =====
app.post('/api/ai/verify-face', (req, res) => {
  // Simulate face verification
  const faceMatch = Math.floor(Math.random() * 15) + 85;
  const isMatch = faceMatch >= 85;
  res.json({
    success: true,
    faceMatch,
    isMatch,
    confidence: faceMatch / 100,
    message: isMatch ? 'Face verified successfully' : 'Face verification failed',
  });
});

app.post('/api/ai/trust-score', (req, res) => {
  // Simulate trust score calculation
  const score = Math.floor(Math.random() * 60) + 40;
  const level = score >= 75 ? 'Low' : score >= 45 ? 'Medium' : 'High';
  const anomalies = [];
  if (level === 'High') anomalies.push('Potential identity mismatch');
  if (score < 50) anomalies.push('Unusual visit pattern');
  
  res.json({
    success: true,
    score,
    level,
    anomalies,
    factors: {
      faceRecognition: Math.floor(Math.random() * 20) + 80,
      visitHistory: Math.floor(Math.random() * 30) + 70,
      behaviorPattern: Math.floor(Math.random() * 40) + 60,
      timeAnalysis: Math.floor(Math.random() * 25) + 75,
    },
  });
});

app.post('/api/ai/anomaly-detect', (req, res) => {
  const anomalies = [];
  if (Math.random() > 0.7) anomalies.push({ type: 'face_mismatch', confidence: 0.85 });
  if (Math.random() > 0.8) anomalies.push({ type: 'suspicious_timing', confidence: 0.72 });
  if (Math.random() > 0.9) anomalies.push({ type: 'blacklisted', confidence: 0.95 });
  
  res.json({
    success: true,
    anomaliesDetected: anomalies.length > 0,
    anomalies,
    overallRisk: anomalies.length > 1 ? 'high' : anomalies.length === 1 ? 'medium' : 'low',
  });
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`\n🛡️  SentraAI Server v1.0.0`);
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📋 API Health: http://localhost:${PORT}/api/health`);
  console.log(`\n📡 Available API Endpoints:`);
  console.log(`   POST /api/auth/login`);
  console.log(`   GET  /api/visitors`);
  console.log(`   POST /api/visitors`);
  console.log(`   PUT  /api/visitors/:id/approve`);
  console.log(`   PUT  /api/visitors/:id/deny`);
  console.log(`   POST /api/otp/send`);
  console.log(`   POST /api/otp/verify`);
  console.log(`   GET  /api/alerts`);
  console.log(`   POST /api/alerts/emergency`);
  console.log(`   GET  /api/admin/dashboard`);
  console.log(`   GET  /api/admin/users`);
  console.log(`   GET  /api/admin/blacklist`);
  console.log(`   POST /api/ai/verify-face`);
  console.log(`   POST /api/ai/trust-score`);
  console.log(`   POST /api/ai/anomaly-detect`);
  console.log(`\n🚀 SentraAI is ready!\n`);
});
