import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Camera, Shield, ScrollText, Bell,
  Settings, ChevronLeft, ChevronRight, LogOut, Zap, Menu
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/visitors', label: 'Visitor Entry', icon: Camera },
  { path: '/approval', label: 'Approvals', icon: Shield },
  { path: '/logs', label: 'Visitor Logs', icon: ScrollText },
  { path: '/alerts', label: 'Alerts', icon: Bell, badge: 5 },
  { path: '/admin', label: 'Admin Panel', icon: Settings },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <Zap size={collapsed ? 20 : 24} />
          </div>
          {!collapsed && (
            <div className="logo-text">
              <span className="logo-name">SentraAI</span>
              <span className="logo-tagline">Security System</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">{!collapsed && 'MAIN MENU'}</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.label : undefined}
            >
              <div className="nav-icon-wrapper">
                <item.icon size={20} />
              </div>
              {!collapsed && <span className="nav-label">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="nav-badge">{item.badge}</span>
              )}
              {collapsed && item.badge && (
                <span className="nav-badge-dot" />
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle */}
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* User section */}
        <div className="sidebar-user">
          <div className="user-avatar">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Admin" />
            <span className="user-status-dot" />
          </div>
          {!collapsed && (
            <div className="user-info">
              <span className="user-name">Admin User</span>
              <span className="user-role">Administrator</span>
            </div>
          )}
          {!collapsed && (
            <button className="user-logout" title="Logout">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
