import { Bell, Menu, Search, Shield } from 'lucide-react';
import { useState } from 'react';
import './Header.css';

export default function Header({ onMenuClick, title, subtitle }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="header-menu-btn" onClick={onMenuClick} id="mobile-menu-btn">
          <Menu size={20} />
        </button>
        <div className="header-title-group">
          <h1 className="header-title">{title || 'Dashboard'}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="header-right">
        <div className={`header-search ${searchOpen ? 'open' : ''}`}>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search visitors, alerts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            id="global-search"
          />
        </div>

        <button
          className="header-icon-btn"
          onClick={() => setSearchOpen(!searchOpen)}
          id="search-toggle"
          title="Search"
        >
          <Search size={18} />
        </button>

        <button className="header-icon-btn notification-btn" id="notification-btn" title="Notifications">
          <Bell size={18} />
          <span className="notification-dot" />
        </button>

        <div className="header-divider" />

        <div className="header-status">
          <Shield size={14} />
          <span>System Active</span>
          <span className="status-pulse" />
        </div>
      </div>
    </header>
  );
}
