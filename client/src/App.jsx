import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VisitorEntry from './pages/VisitorEntry';
import Approval from './pages/Approval';
import Logs from './pages/Logs';
import Alerts from './pages/Alerts';
import Admin from './pages/Admin';
import './App.css';

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Security Overview' },
  '/visitors': { title: 'Visitor Entry', subtitle: 'Register & Verify Visitors' },
  '/approval': { title: 'Approvals', subtitle: 'Manage Visitor Access' },
  '/logs': { title: 'Visitor Logs', subtitle: 'Entry & Exit History' },
  '/alerts': { title: 'Alerts', subtitle: 'Security Notifications' },
  '/admin': { title: 'Admin Panel', subtitle: 'System Management' },
};

function AppLayout({ user, onLogout }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const pageInfo = PAGE_TITLES[location.pathname] || { title: 'SentraAI', subtitle: '' };

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className={`app-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Header
          onMenuClick={() => setMobileOpen(true)}
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
        />
        <main className="app-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/visitors" element={<VisitorEntry />} />
            <Route path="/approval" element={<Approval />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <BrowserRouter>
      {!user ? (
        <Routes>
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        </Routes>
      ) : (
        <AppLayout user={user} onLogout={handleLogout} />
      )}
    </BrowserRouter>
  );
}
