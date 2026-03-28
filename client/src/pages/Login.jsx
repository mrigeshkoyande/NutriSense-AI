import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, Shield, Lock, Mail, ArrowRight, Fingerprint } from 'lucide-react';
import './Login.css';

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    // Simulate login
    await new Promise(r => setTimeout(r, 1500));
    onLogin({ email, role, name: 'Admin User' });
    navigate('/dashboard');
  };

  const handleDemoLogin = async (demoRole) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const names = { admin: 'Admin User', guard: 'Security Guard', resident: 'Resident User' };
    onLogin({ email: `${demoRole}@sentraai.com`, role: demoRole, name: names[demoRole] });
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-grid" />
        <div className="login-orb orb-1" />
        <div className="login-orb orb-2" />
        <div className="login-orb orb-3" />
      </div>

      <div className="login-container">
        {/* Left panel - Branding */}
        <div className="login-branding">
          <div className="branding-content">
            <div className="brand-logo">
              <div className="brand-icon">
                <Zap size={32} />
              </div>
              <h1>SentraAI</h1>
            </div>
            <p className="brand-tagline">
              AI-Powered Visitor Security System
            </p>
            <div className="brand-features">
              <div className="brand-feature">
                <Fingerprint size={20} />
                <span>Face Recognition Entry</span>
              </div>
              <div className="brand-feature">
                <Shield size={20} />
                <span>AI Anomaly Detection</span>
              </div>
              <div className="brand-feature">
                <Lock size={20} />
                <span>Real-time Security Alerts</span>
              </div>
            </div>
            <div className="brand-stats">
              <div className="brand-stat">
                <span className="stat-number">99.7%</span>
                <span className="stat-label">Face Match</span>
              </div>
              <div className="brand-stat">
                <span className="stat-number">{'< 2s'}</span>
                <span className="stat-label">Auth Time</span>
              </div>
              <div className="brand-stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Monitoring</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - Login Form */}
        <div className="login-form-panel">
          <div className="login-form-container">
            <div className="form-header">
              <h2>Welcome Back</h2>
              <p>Sign in to your security dashboard</p>
            </div>

            {error && (
              <div className="login-error">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="login-email">Email Address</label>
                <div className="input-wrapper">
                  <Mail size={16} />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="admin@sentraai.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <div className="input-wrapper">
                  <Lock size={16} />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    id="toggle-password-btn"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="login-role">Login As</label>
                <div className="role-selector">
                  {['admin', 'guard', 'resident'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      className={`role-btn ${role === r ? 'active' : ''}`}
                      onClick={() => setRole(r)}
                      id={`role-${r}`}
                    >
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className={`login-submit-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
                id="login-submit"
              >
                {loading ? (
                  <div className="btn-spinner" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="login-divider">
              <span>Quick Demo Access</span>
            </div>

            <div className="demo-buttons">
              <button
                className="demo-btn admin"
                onClick={() => handleDemoLogin('admin')}
                disabled={loading}
                id="demo-admin"
              >
                <Shield size={16} />
                Admin Demo
              </button>
              <button
                className="demo-btn guard"
                onClick={() => handleDemoLogin('guard')}
                disabled={loading}
                id="demo-guard"
              >
                <Fingerprint size={16} />
                Guard Demo
              </button>
              <button
                className="demo-btn resident"
                onClick={() => handleDemoLogin('resident')}
                disabled={loading}
                id="demo-resident"
              >
                <Lock size={16} />
                Resident Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
