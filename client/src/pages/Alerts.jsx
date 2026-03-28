import { useState } from 'react';
import {
  Bell, AlertTriangle, Shield, CheckCircle, XCircle, Clock,
  MapPin, User, Filter, BellRing, AlertOctagon, Volume2
} from 'lucide-react';
import { generateAlerts } from '../data/mockData';
import './Alerts.css';

export default function Alerts() {
  const [alerts, setAlerts] = useState(() => generateAlerts(20));
  const [filter, setFilter] = useState('all');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  const severityConfig = {
    critical: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', label: 'CRITICAL', icon: <AlertOctagon size={14} /> },
    high: { color: '#f87171', bg: 'rgba(248, 113, 113, 0.1)', label: 'HIGH', icon: <AlertTriangle size={14} /> },
    medium: { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)', label: 'MEDIUM', icon: <Shield size={14} /> },
    low: { color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.1)', label: 'LOW', icon: <Bell size={14} /> },
  };

  const filtered = filter === 'all' ? alerts :
    filter === 'unread' ? alerts.filter(a => !a.read) :
    filter === 'resolved' ? alerts.filter(a => a.resolved) :
    alerts.filter(a => a.severity === filter);

  const unreadCount = alerts.filter(a => !a.read).length;
  const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.resolved).length;

  const markAsRead = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const resolveAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true, read: true } : a));
    setSelectedAlert(null);
  };

  const markAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  return (
    <div className="alerts-page">
      {/* Top Bar */}
      <div className="alerts-topbar">
        <div className="alerts-title-section">
          <h2>Security Alerts</h2>
          <div className="alert-counters">
            <span className="counter unread">
              <BellRing size={12} /> {unreadCount} unread
            </span>
            {criticalCount > 0 && (
              <span className="counter critical">
                <AlertOctagon size={12} /> {criticalCount} critical
              </span>
            )}
          </div>
        </div>
        <div className="alerts-actions">
          <button className="mark-read-btn" onClick={markAllRead} id="mark-all-read">
            <CheckCircle size={14} />
            Mark All Read
          </button>
          <button
            className="emergency-btn"
            onClick={() => setEmergencyModalOpen(true)}
            id="emergency-alert-btn"
          >
            <Volume2 size={16} />
            Emergency Alert
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="alerts-filters">
        {['all', 'unread', 'critical', 'high', 'medium', 'low', 'resolved'].map(f => (
          <button
            key={f}
            className={`alert-filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
            id={`filter-${f}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'unread' && unreadCount > 0 && <span className="filter-count">{unreadCount}</span>}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="alerts-layout">
        <div className="alerts-list">
          {filtered.length === 0 && (
            <div className="no-alerts">
              <Shield size={40} />
              <h3>All Clear</h3>
              <p>No alerts matching your filter</p>
            </div>
          )}
          {filtered.map((alert, i) => {
            const sev = severityConfig[alert.severity];
            return (
              <div
                key={alert.id}
                className={`alert-card ${!alert.read ? 'unread' : ''} ${alert.resolved ? 'resolved' : ''} ${selectedAlert?.id === alert.id ? 'selected' : ''}`}
                onClick={() => { setSelectedAlert(alert); markAsRead(alert.id); }}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="alert-icon-col" style={{ color: sev.color }}>
                  <div className="alert-icon-bg" style={{ background: sev.bg }}>
                    {alert.icon}
                  </div>
                </div>

                <div className="alert-content-col">
                  <div className="alert-title-row">
                    <span className="alert-title">{alert.title}</span>
                    {!alert.read && <span className="unread-dot" />}
                  </div>
                  <p className="alert-meta">
                    <User size={11} /> {alert.visitor}
                    <span className="meta-sep">•</span>
                    <MapPin size={11} /> {alert.location}
                  </p>
                  <span className="alert-time">
                    <Clock size={11} />
                    {new Date(alert.timestamp).toLocaleString([], {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>

                <div className="alert-severity-col">
                  <span className="severity-badge" style={{ color: sev.color, background: sev.bg }}>
                    {sev.icon}
                    {sev.label}
                  </span>
                  {alert.resolved && (
                    <span className="resolved-badge">
                      <CheckCircle size={10} /> Resolved
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail Panel */}
        {selectedAlert && (
          <div className="alert-detail-panel animate-fade-in">
            <div className="alert-detail-header" style={{
              background: severityConfig[selectedAlert.severity].bg,
              borderLeft: `4px solid ${severityConfig[selectedAlert.severity].color}`
            }}>
              <span className="alert-detail-icon" style={{ fontSize: '28px' }}>{selectedAlert.icon}</span>
              <div>
                <h3>{selectedAlert.title}</h3>
                <span className="severity-badge" style={{
                  color: severityConfig[selectedAlert.severity].color,
                  background: 'rgba(0,0,0,0.2)'
                }}>
                  {severityConfig[selectedAlert.severity].label}
                </span>
              </div>
            </div>

            <div className="alert-detail-body">
              <div className="alert-detail-field">
                <span><User size={13} /> Visitor</span>
                <strong>{selectedAlert.visitor}</strong>
              </div>
              <div className="alert-detail-field">
                <span><MapPin size={13} /> Location</span>
                <strong>{selectedAlert.location}</strong>
              </div>
              <div className="alert-detail-field">
                <span><Clock size={13} /> Time</span>
                <strong>{new Date(selectedAlert.timestamp).toLocaleString()}</strong>
              </div>
              <div className="alert-detail-field">
                <span><Shield size={13} /> Type</span>
                <strong>{selectedAlert.type.replace(/_/g, ' ')}</strong>
              </div>
              <div className="alert-detail-field">
                <span><Bell size={13} /> Status</span>
                <strong>{selectedAlert.resolved ? '✅ Resolved' : '⚠️ Active'}</strong>
              </div>
            </div>

            {!selectedAlert.resolved && (
              <div className="alert-detail-actions">
                <button
                  className="resolve-btn"
                  onClick={() => resolveAlert(selectedAlert.id)}
                  id="resolve-alert-btn"
                >
                  <CheckCircle size={16} />
                  Mark as Resolved
                </button>
                <button className="escalate-btn" id="escalate-alert-btn" onClick={() => alert('Alert escalated to admin!')}>
                  <AlertTriangle size={16} />
                  Escalate
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Emergency Modal */}
      {emergencyModalOpen && (
        <div className="emergency-overlay" onClick={() => setEmergencyModalOpen(false)}>
          <div className="emergency-modal animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="emergency-modal-icon">
              <AlertOctagon size={48} />
            </div>
            <h2>Trigger Emergency Alert</h2>
            <p>This will send an immediate alert to all security personnel and lock down all entry points.</p>
            <div className="emergency-modal-actions">
              <button
                className="emergency-confirm"
                onClick={() => { setEmergencyModalOpen(false); alert('🚨 Emergency alert triggered! All security notified.'); }}
                id="confirm-emergency"
              >
                <Volume2 size={18} />
                Confirm Emergency
              </button>
              <button
                className="emergency-cancel"
                onClick={() => setEmergencyModalOpen(false)}
                id="cancel-emergency"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
