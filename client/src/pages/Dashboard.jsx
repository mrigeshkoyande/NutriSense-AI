import { useState, useEffect, useMemo } from 'react';
import {
  Users, AlertTriangle, ShieldCheck, Clock, TrendingUp, TrendingDown,
  Activity, Eye, Camera, ChevronRight, ArrowUpRight, ArrowDownRight,
  Zap, Shield, AlertCircle, CheckCircle, XCircle, BarChart3
} from 'lucide-react';
import { generateDashboardStats, generateVisitors, generateAlerts, getTrustColor, HEATMAP_DATA } from '../data/mockData';
import './Dashboard.css';

export default function Dashboard() {
  const [stats] = useState(generateDashboardStats);
  const [visitors] = useState(() => generateVisitors(8));
  const [alerts] = useState(() => generateAlerts(6));
  const [animatedStats, setAnimatedStats] = useState({
    totalVisitors: 0, todayVisitors: 0, activeAlerts: 0, pendingApprovals: 0
  });

  // Animate counter on mount
  useEffect(() => {
    const targets = {
      totalVisitors: stats.totalVisitors,
      todayVisitors: stats.todayVisitors,
      activeAlerts: stats.activeAlerts,
      pendingApprovals: stats.pendingApprovals,
    };
    const duration = 1200;
    const steps = 40;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedStats({
        totalVisitors: Math.round(targets.totalVisitors * eased),
        todayVisitors: Math.round(targets.todayVisitors * eased),
        activeAlerts: Math.round(targets.activeAlerts * eased),
        pendingApprovals: Math.round(targets.pendingApprovals * eased),
      });
      if (step >= steps) clearInterval(interval);
    }, duration / steps);
    return () => clearInterval(interval);
  }, [stats]);

  const maxBarValue = Math.max(...stats.monthlyVisitors.map(d => d.count));
  const maxHourValue = Math.max(...stats.hourlyTraffic.map(d => d.count));

  return (
    <div className="dashboard-page">
      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Visitors"
          value={animatedStats.totalVisitors.toLocaleString()}
          change="+12.5%"
          trend="up"
          icon={<Users size={20} />}
          color="purple"
          index={0}
        />
        <StatCard
          title="Today's Visitors"
          value={animatedStats.todayVisitors}
          change="+8 from yesterday"
          trend="up"
          icon={<Eye size={20} />}
          color="blue"
          index={1}
        />
        <StatCard
          title="Active Alerts"
          value={animatedStats.activeAlerts}
          change="2 critical"
          trend="alert"
          icon={<AlertTriangle size={20} />}
          color="red"
          index={2}
        />
        <StatCard
          title="Pending Approvals"
          value={animatedStats.pendingApprovals}
          change="Action needed"
          trend="neutral"
          icon={<Clock size={20} />}
          color="amber"
          index={3}
        />
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Weekly Visitors Chart */}
        <div className="dash-card chart-card animate-fade-in-up stagger-2">
          <div className="card-header">
            <div>
              <h3>Weekly Visitors</h3>
              <p className="card-subtitle">Last 7 days activity</p>
            </div>
            <div className="card-header-badge">
              <BarChart3 size={14} />
              <span>{stats.weeklyChange}</span>
            </div>
          </div>
          <div className="bar-chart">
            {stats.monthlyVisitors.map((d, i) => (
              <div key={d.day} className="bar-group">
                <div className="bar-value">{d.count}</div>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{
                      height: `${(d.count / maxBarValue) * 100}%`,
                      animationDelay: `${i * 0.08}s`
                    }}
                  />
                </div>
                <div className="bar-label">{d.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Score Distribution */}
        <div className="dash-card trust-card animate-fade-in-up stagger-3">
          <div className="card-header">
            <div>
              <h3>Risk Distribution</h3>
              <p className="card-subtitle">AI Trust Score analysis</p>
            </div>
          </div>
          <div className="trust-visual">
            <div className="trust-ring">
              <svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                <circle
                  cx="60" cy="60" r="52" fill="none" stroke="var(--status-safe)" strokeWidth="12"
                  strokeDasharray={`${stats.riskDistribution.low * 3.27} 327`}
                  strokeDashoffset="0" strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  className="ring-segment"
                />
                <circle
                  cx="60" cy="60" r="52" fill="none" stroke="var(--status-warning)" strokeWidth="12"
                  strokeDasharray={`${stats.riskDistribution.medium * 3.27} 327`}
                  strokeDashoffset={`-${stats.riskDistribution.low * 3.27}`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  className="ring-segment"
                />
                <circle
                  cx="60" cy="60" r="52" fill="none" stroke="var(--status-danger)" strokeWidth="12"
                  strokeDasharray={`${stats.riskDistribution.high * 3.27} 327`}
                  strokeDashoffset={`-${(stats.riskDistribution.low + stats.riskDistribution.medium) * 3.27}`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  className="ring-segment"
                />
              </svg>
              <div className="trust-ring-center">
                <span className="trust-ring-value">{stats.avgTrustScore}</span>
                <span className="trust-ring-label">Avg Score</span>
              </div>
            </div>
            <div className="trust-legend">
              <div className="legend-item">
                <span className="legend-dot" style={{ background: 'var(--status-safe)' }} />
                <span className="legend-label">Low Risk</span>
                <span className="legend-value">{stats.riskDistribution.low}%</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: 'var(--status-warning)' }} />
                <span className="legend-label">Medium Risk</span>
                <span className="legend-value">{stats.riskDistribution.medium}%</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: 'var(--status-danger)' }} />
                <span className="legend-label">High Risk</span>
                <span className="legend-value">{stats.riskDistribution.high}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="dash-card activity-card animate-fade-in-up stagger-4">
          <div className="card-header">
            <div>
              <h3>Live Activity</h3>
              <p className="card-subtitle">Real-time event feed</p>
            </div>
            <div className="live-indicator">
              <span className="live-dot" />
              LIVE
            </div>
          </div>
          <div className="activity-list">
            {stats.recentActivity.map((activity, i) => (
              <div key={i} className="activity-item" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={`activity-icon ${activity.type}`}>
                  {activity.type === 'success' && <CheckCircle size={14} />}
                  {activity.type === 'info' && <Zap size={14} />}
                  {activity.type === 'warning' && <AlertTriangle size={14} />}
                  {activity.type === 'danger' && <XCircle size={14} />}
                </div>
                <div className="activity-content">
                  <p>{activity.event}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hourly Traffic */}
        <div className="dash-card hourly-card animate-fade-in-up stagger-5">
          <div className="card-header">
            <div>
              <h3>Hourly Traffic</h3>
              <p className="card-subtitle">Visitor flow today</p>
            </div>
          </div>
          <div className="hourly-chart">
            {stats.hourlyTraffic.map((d, i) => (
              <div key={d.hour} className="hourly-bar-group" title={`${d.hour}: ${d.count} visitors`}>
                <div className="hourly-bar-track">
                  <div
                    className="hourly-bar-fill"
                    style={{
                      height: `${(d.count / maxHourValue) * 100}%`,
                      animationDelay: `${i * 0.05}s`,
                      background: d.count > 20
                        ? 'var(--accent-gradient)'
                        : d.count > 10
                          ? 'var(--neon-blue)'
                          : 'rgba(139, 92, 246, 0.3)'
                    }}
                  />
                </div>
                <span className="hourly-label">{d.hour.replace('AM', '').replace('PM', '')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Suspicious Activity Heatmap */}
        <div className="dash-card heatmap-card animate-fade-in-up stagger-5">
          <div className="card-header">
            <div>
              <h3>Activity Heatmap</h3>
              <p className="card-subtitle">Suspicious activity patterns</p>
            </div>
          </div>
          <div className="heatmap-container">
            <div className="heatmap-y-labels">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className="heatmap-grid">
              {HEATMAP_DATA.map((cell, i) => (
                <div
                  key={i}
                  className="heatmap-cell"
                  style={{
                    opacity: 0.15 + (cell.value / 10) * 0.85,
                    background: cell.value > 7 ? 'var(--neon-red)'
                      : cell.value > 4 ? 'var(--neon-amber)'
                      : 'var(--accent-primary)'
                  }}
                  title={`${cell.day} ${cell.hour}:00 - ${cell.value} incidents`}
                />
              ))}
            </div>
            <div className="heatmap-x-labels">
              {Array.from({ length: 24 }, (_, i) => (
                <span key={i}>{i % 4 === 0 ? `${i}h` : ''}</span>
              ))}
            </div>
          </div>
          <div className="heatmap-legend">
            <span>Low</span>
            <div className="heatmap-scale">
              {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1].map((o, i) => (
                <div key={i} style={{
                  background: i > 5 ? 'var(--neon-red)'
                    : i > 3 ? 'var(--neon-amber)'
                    : 'var(--accent-primary)',
                  opacity: o
                }} />
              ))}
            </div>
            <span>High</span>
          </div>
        </div>

        {/* Recent Visitors */}
        <div className="dash-card visitors-card animate-fade-in-up stagger-6">
          <div className="card-header">
            <div>
              <h3>Recent Visitors</h3>
              <p className="card-subtitle">Latest entries</p>
            </div>
            <button className="card-action-btn" id="view-all-visitors">
              View All <ChevronRight size={14} />
            </button>
          </div>
          <div className="recent-visitors-list">
            {visitors.slice(0, 5).map((v, i) => {
              const trust = getTrustColor(v.trustLevel);
              return (
                <div key={v.id} className="visitor-row" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="visitor-avatar-sm">
                    <img src={v.photo} alt={v.name} />
                  </div>
                  <div className="visitor-info-sm">
                    <span className="visitor-name-sm">{v.name}</span>
                    <span className="visitor-purpose-sm">{v.purpose}</span>
                  </div>
                  <div className="visitor-unit-sm">{v.unit}</div>
                  <div className="visitor-trust-sm" style={{ color: trust.color, background: trust.bg }}>
                    {v.trustScore}
                  </div>
                  <div className={`visitor-status-sm ${v.status}`}>
                    {v.status === 'approved' && <CheckCircle size={12} />}
                    {v.status === 'pending' && <Clock size={12} />}
                    {v.status === 'denied' && <XCircle size={12} />}
                    {v.status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, trend, icon, color, index }) {
  const colorMap = {
    purple: { bg: 'rgba(139, 92, 246, 0.1)', border: 'rgba(139, 92, 246, 0.2)', text: '#a78bfa', icon: 'var(--accent-gradient)' },
    blue: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.2)', text: '#60a5fa', icon: 'linear-gradient(135deg, #3b82f6, #60a5fa)' },
    red: { bg: 'rgba(248, 113, 113, 0.1)', border: 'rgba(248, 113, 113, 0.2)', text: '#f87171', icon: 'linear-gradient(135deg, #ef4444, #f87171)' },
    amber: { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.2)', text: '#fbbf24', icon: 'linear-gradient(135deg, #f59e0b, #fbbf24)' },
  };
  const c = colorMap[color];

  return (
    <div
      className="stat-card animate-fade-in-up"
      style={{ animationDelay: `${index * 0.08}s`, borderColor: c.border }}
    >
      <div className="stat-icon" style={{ background: c.icon }}>
        {icon}
      </div>
      <div className="stat-content">
        <span className="stat-title">{title}</span>
        <span className="stat-value" style={{ color: c.text }}>{value}</span>
        <span className={`stat-change ${trend}`}>
          {trend === 'up' && <ArrowUpRight size={12} />}
          {trend === 'alert' && <AlertCircle size={12} />}
          {change}
        </span>
      </div>
    </div>
  );
}
