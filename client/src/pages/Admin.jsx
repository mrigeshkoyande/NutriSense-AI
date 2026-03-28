import { useState } from 'react';
import {
  Users, Shield, UserPlus, Trash2, Edit2, Search, Ban, 
  CheckCircle, XCircle, Settings, BarChart3, AlertTriangle,
  Eye, EyeOff, Save, X
} from 'lucide-react';
import { generateUsers, generateBlacklist, generateDashboardStats, VISITOR_PHOTOS, getTrustColor } from '../data/mockData';
import './Admin.css';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState(generateUsers);
  const [blacklist, setBlacklist] = useState(generateBlacklist);
  const [stats] = useState(generateDashboardStats);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddBlacklist, setShowAddBlacklist] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'resident' });
  const [newBlacklist, setNewBlacklist] = useState({ name: '', reason: '' });

  const addUser = () => {
    if (!newUser.name || !newUser.email) return;
    setUsers(prev => [...prev, {
      id: 'USR-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
      ...newUser,
      status: 'active',
      avatar: VISITOR_PHOTOS[Math.floor(Math.random() * VISITOR_PHOTOS.length)]
    }]);
    setNewUser({ name: '', email: '', role: 'resident' });
    setShowAddUser(false);
  };

  const removeUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const toggleUserStatus = (id) => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ));
  };

  const addToBlacklist = () => {
    if (!newBlacklist.name || !newBlacklist.reason) return;
    setBlacklist(prev => [...prev, {
      id: 'BL-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
      ...newBlacklist,
      addedOn: new Date().toISOString().split('T')[0],
      photo: VISITOR_PHOTOS[Math.floor(Math.random() * VISITOR_PHOTOS.length)],
      attempts: 0
    }]);
    setNewBlacklist({ name: '', reason: '' });
    setShowAddBlacklist(false);
  };

  const removeFromBlacklist = (id) => {
    setBlacklist(prev => prev.filter(b => b.id !== id));
  };

  const roleColors = {
    admin: { color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.1)' },
    guard: { color: '#22d3ee', bg: 'rgba(34, 211, 238, 0.1)' },
    resident: { color: '#34d399', bg: 'rgba(52, 211, 153, 0.1)' },
  };

  return (
    <div className="admin-page">
      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
          id="tab-users"
        >
          <Users size={16} />
          User Management
        </button>
        <button
          className={`admin-tab ${activeTab === 'blacklist' ? 'active' : ''}`}
          onClick={() => setActiveTab('blacklist')}
          id="tab-blacklist"
        >
          <Ban size={16} />
          Blacklist / Watchlist
        </button>
        <button
          className={`admin-tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
          id="tab-analytics"
        >
          <BarChart3 size={16} />
          Analytics
        </button>
        <button
          className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
          id="tab-settings"
        >
          <Settings size={16} />
          Settings
        </button>
      </div>

      <div className="admin-content">
        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="admin-section animate-fade-in">
            <div className="section-header">
              <div>
                <h2>User Management</h2>
                <p>Manage admins, guards, and residents</p>
              </div>
              <button className="add-btn" onClick={() => setShowAddUser(true)} id="add-user-btn">
                <UserPlus size={16} />
                Add User
              </button>
            </div>

            {showAddUser && (
              <div className="add-form animate-fade-in-up">
                <div className="add-form-header">
                  <h3>Add New User</h3>
                  <button className="close-form-btn" onClick={() => setShowAddUser(false)}>
                    <X size={16} />
                  </button>
                </div>
                <div className="add-form-fields">
                  <input
                    placeholder="Full Name"
                    value={newUser.name}
                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                    id="new-user-name"
                  />
                  <input
                    placeholder="Email Address"
                    value={newUser.email}
                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                    id="new-user-email"
                  />
                  <select
                    value={newUser.role}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                    id="new-user-role"
                  >
                    <option value="admin">Admin</option>
                    <option value="guard">Guard</option>
                    <option value="resident">Resident</option>
                  </select>
                  <button className="save-btn" onClick={addUser} id="save-user-btn">
                    <Save size={14} />
                    Save User
                  </button>
                </div>
              </div>
            )}

            <div className="users-grid">
              {users.map((user, i) => (
                <div key={user.id} className="user-card" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="user-card-top">
                    <img src={user.avatar} alt={user.name} className="user-card-avatar" />
                    <div className="user-card-info">
                      <span className="user-card-name">{user.name}</span>
                      <span className="user-card-email">{user.email}</span>
                    </div>
                  </div>
                  <div className="user-card-meta">
                    <span className="role-badge" style={{
                      color: roleColors[user.role]?.color,
                      background: roleColors[user.role]?.bg
                    }}>
                      {user.role}
                    </span>
                    <span className={`user-status ${user.status}`}>
                      {user.status === 'active' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                      {user.status}
                    </span>
                  </div>
                  <div className="user-card-actions">
                    <button
                      className="user-action-btn toggle"
                      onClick={() => toggleUserStatus(user.id)}
                      title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      {user.status === 'active' ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      className="user-action-btn delete"
                      onClick={() => removeUser(user.id)}
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blacklist Tab */}
        {activeTab === 'blacklist' && (
          <div className="admin-section animate-fade-in">
            <div className="section-header">
              <div>
                <h2>Blacklist / Watchlist</h2>
                <p>Manage flagged and banned visitors</p>
              </div>
              <button className="add-btn danger" onClick={() => setShowAddBlacklist(true)} id="add-blacklist-btn">
                <Ban size={16} />
                Add to Blacklist
              </button>
            </div>

            {showAddBlacklist && (
              <div className="add-form animate-fade-in-up">
                <div className="add-form-header">
                  <h3>Add to Blacklist</h3>
                  <button className="close-form-btn" onClick={() => setShowAddBlacklist(false)}>
                    <X size={16} />
                  </button>
                </div>
                <div className="add-form-fields">
                  <input
                    placeholder="Person Name"
                    value={newBlacklist.name}
                    onChange={e => setNewBlacklist({ ...newBlacklist, name: e.target.value })}
                    id="blacklist-name"
                  />
                  <input
                    placeholder="Reason for blacklisting"
                    value={newBlacklist.reason}
                    onChange={e => setNewBlacklist({ ...newBlacklist, reason: e.target.value })}
                    id="blacklist-reason"
                  />
                  <button className="save-btn danger" onClick={addToBlacklist} id="save-blacklist-btn">
                    <Ban size={14} />
                    Add to Blacklist
                  </button>
                </div>
              </div>
            )}

            <div className="blacklist-grid">
              {blacklist.map((person, i) => (
                <div key={person.id} className="blacklist-card" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="blacklist-card-header">
                    <img src={person.photo} alt={person.name} />
                    <div>
                      <span className="blacklist-name">{person.name}</span>
                      <span className="blacklist-id">{person.id}</span>
                    </div>
                    <button
                      className="remove-blacklist-btn"
                      onClick={() => removeFromBlacklist(person.id)}
                      title="Remove from blacklist"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="blacklist-card-body">
                    <div className="blacklist-field">
                      <span>Reason</span>
                      <strong>{person.reason}</strong>
                    </div>
                    <div className="blacklist-field">
                      <span>Added On</span>
                      <strong>{person.addedOn}</strong>
                    </div>
                    <div className="blacklist-field">
                      <span>Entry Attempts</span>
                      <strong className="attempts">{person.attempts}</strong>
                    </div>
                  </div>
                  <div className="blacklist-card-footer">
                    <AlertTriangle size={12} />
                    Auto-deny enabled
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="admin-section animate-fade-in">
            <div className="section-header">
              <div>
                <h2>Security Analytics</h2>
                <p>System performance and insights</p>
              </div>
            </div>

            <div className="analytics-cards">
              <div className="analytics-card">
                <div className="analytics-label">Total Entries (Month)</div>
                <div className="analytics-value">{stats.totalVisitors.toLocaleString()}</div>
                <div className="analytics-trend up">↑ 12.5% vs last month</div>
              </div>
              <div className="analytics-card">
                <div className="analytics-label">Avg Trust Score</div>
                <div className="analytics-value">{stats.avgTrustScore}</div>
                <div className="analytics-trend up">↑ 3 points improvement</div>
              </div>
              <div className="analytics-card">
                <div className="analytics-label">Denied Entries</div>
                <div className="analytics-value">{stats.deniedEntries}</div>
                <div className="analytics-trend down">↓ 5% fewer denials</div>
              </div>
              <div className="analytics-card">
                <div className="analytics-label">Blacklisted Blocked</div>
                <div className="analytics-value">{blacklist.reduce((sum, b) => sum + b.attempts, 0)}</div>
                <div className="analytics-trend neutral">System protected</div>
              </div>
            </div>

            <div className="analytics-chart-card">
              <h3>Weekly Visitor Distribution</h3>
              <div className="analytics-bar-chart">
                {stats.monthlyVisitors.map((d, i) => (
                  <div key={d.day} className="analytics-bar-group">
                    <div className="analytics-bar-value">{d.count}</div>
                    <div className="analytics-bar-track">
                      <div
                        className="analytics-bar-fill"
                        style={{
                          height: `${(d.count / Math.max(...stats.monthlyVisitors.map(x => x.count))) * 100}%`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    </div>
                    <div className="analytics-bar-label">{d.day}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="admin-section animate-fade-in">
            <div className="section-header">
              <div>
                <h2>System Settings</h2>
                <p>Configure security parameters</p>
              </div>
            </div>

            <div className="settings-grid">
              <div className="setting-card">
                <div className="setting-info">
                  <h4>AI Face Recognition</h4>
                  <p>Enable AI-powered face matching for visitor verification</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked id="toggle-face-rec" />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="setting-card">
                <div className="setting-info">
                  <h4>Anomaly Detection</h4>
                  <p>AI monitors for suspicious patterns and behaviors</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked id="toggle-anomaly" />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="setting-card">
                <div className="setting-info">
                  <h4>Auto-Deny Blacklisted</h4>
                  <p>Automatically deny entry to blacklisted visitors</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked id="toggle-auto-deny" />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="setting-card">
                <div className="setting-info">
                  <h4>OTP Verification</h4>
                  <p>Require OTP from residents for visitor approval</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked id="toggle-otp" />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="setting-card">
                <div className="setting-info">
                  <h4>Real-time Notifications</h4>
                  <p>Push notifications for alerts and visitor entries</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked id="toggle-notifications" />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div className="setting-card">
                <div className="setting-info">
                  <h4>Trust Score Threshold</h4>
                  <p>Minimum trust score for auto-approval (current: 70)</p>
                </div>
                <div className="setting-range">
                  <input type="range" min="0" max="100" defaultValue="70" id="trust-threshold" />
                  <span>70</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
