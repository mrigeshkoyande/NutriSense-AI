import { useState, useMemo } from 'react';
import {
  Search, Filter, Download, Calendar, ChevronDown, ChevronUp,
  CheckCircle, XCircle, Clock, Eye, ArrowUpDown
} from 'lucide-react';
import { generateVisitors, getTrustColor } from '../data/mockData';
import './Logs.css';

export default function Logs() {
  const [visitors] = useState(() => generateVisitors(50));
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [sortField, setSortField] = useState('entryTime');
  const [sortDir, setSortDir] = useState('desc');
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    let result = [...visitors];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(v =>
        v.name.toLowerCase().includes(q) ||
        v.id.toLowerCase().includes(q) ||
        v.purpose.toLowerCase().includes(q) ||
        v.unit.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(v => v.status === statusFilter);
    }

    if (riskFilter !== 'all') {
      result = result.filter(v => v.trustLevel === riskFilter);
    }

    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const dir = sortDir === 'asc' ? 1 : -1;
      if (typeof aVal === 'number') return (aVal - bVal) * dir;
      return String(aVal).localeCompare(String(bVal)) * dir;
    });

    return result;
  }, [visitors, searchQuery, statusFilter, riskFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const exportLogs = () => {
    const csv = [
      ['ID', 'Name', 'Purpose', 'Unit', 'Status', 'Trust Score', 'Entry Time', 'Exit Time', 'Verification'].join(','),
      ...filtered.map(v => [
        v.id, v.name, v.purpose, v.unit, v.status, v.trustScore,
        new Date(v.entryTime).toLocaleString(),
        v.exitTime ? new Date(v.exitTime).toLocaleString() : 'N/A',
        v.verificationMethod
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sentraai_logs.csv';
    a.click();
  };

  return (
    <div className="logs-page">
      {/* Toolbar */}
      <div className="logs-toolbar">
        <div className="logs-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by name, ID, purpose, unit..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            id="logs-search-input"
          />
        </div>

        <div className="logs-filters">
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="logs-select"
            id="status-filter"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="denied">Denied</option>
          </select>

          <select
            value={riskFilter}
            onChange={e => { setRiskFilter(e.target.value); setCurrentPage(1); }}
            className="logs-select"
            id="risk-filter"
          >
            <option value="all">All Risk</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>

          <button className="logs-export-btn" onClick={exportLogs} id="export-logs-btn">
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Results info */}
      <div className="logs-info">
        <span>{filtered.length} records found</span>
        <span>Page {currentPage} of {totalPages}</span>
      </div>

      {/* Table */}
      <div className="logs-table-wrapper">
        <table className="logs-table">
          <thead>
            <tr>
              <th>Visitor</th>
              <th className="sortable" onClick={() => toggleSort('purpose')}>
                Purpose <ArrowUpDown size={12} />
              </th>
              <th className="sortable" onClick={() => toggleSort('unit')}>
                Unit <ArrowUpDown size={12} />
              </th>
              <th className="sortable" onClick={() => toggleSort('trustScore')}>
                Trust <ArrowUpDown size={12} />
              </th>
              <th className="sortable" onClick={() => toggleSort('status')}>
                Status <ArrowUpDown size={12} />
              </th>
              <th className="sortable" onClick={() => toggleSort('entryTime')}>
                Entry Time <ArrowUpDown size={12} />
              </th>
              <th>Verification</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paged.map((v, i) => {
              const trust = getTrustColor(v.trustLevel);
              const isExpanded = expandedRow === v.id;
              return (
                <>
                  <tr
                    key={v.id}
                    className={`log-row ${isExpanded ? 'expanded' : ''}`}
                    style={{ animationDelay: `${i * 0.04}s` }}
                  >
                    <td>
                      <div className="log-visitor">
                        <img src={v.photo} alt={v.name} />
                        <div>
                          <span className="log-name">{v.name}</span>
                          <span className="log-id">{v.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>{v.purpose}</td>
                    <td><span className="unit-tag">{v.unit}</span></td>
                    <td>
                      <span className="trust-score" style={{ color: trust.color, background: trust.bg }}>
                        {v.trustScore}
                      </span>
                    </td>
                    <td>
                      <span className={`log-status ${v.status}`}>
                        {v.status === 'approved' && <CheckCircle size={12} />}
                        {v.status === 'pending' && <Clock size={12} />}
                        {v.status === 'denied' && <XCircle size={12} />}
                        {v.status}
                      </span>
                    </td>
                    <td className="time-cell">{new Date(v.entryTime).toLocaleString([], {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}</td>
                    <td><span className="verification-tag">{v.verificationMethod}</span></td>
                    <td>
                      <button
                        className="expand-btn"
                        onClick={() => setExpandedRow(isExpanded ? null : v.id)}
                        id={`expand-${v.id}`}
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${v.id}-detail`} className="detail-row">
                      <td colSpan={8}>
                        <div className="log-detail-panel">
                          <div className="log-detail-item">
                            <span>Phone:</span> <strong>{v.phone}</strong>
                          </div>
                          <div className="log-detail-item">
                            <span>Face Match:</span> <strong>{v.faceMatch}%</strong>
                          </div>
                          <div className="log-detail-item">
                            <span>Exit Time:</span>
                            <strong>{v.exitTime ? new Date(v.exitTime).toLocaleString() : 'Still on premises'}</strong>
                          </div>
                          <div className="log-detail-item">
                            <span>Duration:</span>
                            <strong>{v.exitTime
                              ? `${Math.round((new Date(v.exitTime) - new Date(v.entryTime)) / 60000)} min`
                              : 'Ongoing'}
                            </strong>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="logs-pagination">
        <button
          className="page-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
          id="prev-page"
        >
          Previous
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
          if (pageNum > totalPages) return null;
          return (
            <button
              key={pageNum}
              className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          className="page-btn"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
          id="next-page"
        >
          Next
        </button>
      </div>
    </div>
  );
}
