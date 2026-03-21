import React, { useEffect, useState } from 'react';
import { getSummary } from '../services/api';
import { Link } from 'react-router-dom';

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const ArrowRightIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 14, height: 14 }}>
    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
  </svg>
);

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    getSummary()
      .then((res) => setSummary(res.data.data))
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="loading-center"><span className="spinner" />Loading dashboard…</div>
  );
  if (error) return <div className="alert alert-error">{error}</div>;

  const notMarked = summary.totalEmployees - summary.presentToday - summary.absentToday;

  const STATS = [
    { label: 'Total Employees', value: summary.totalEmployees, Icon: UsersIcon, cls: 'c1' },
    { label: 'Present Today',   value: summary.presentToday,   Icon: CheckIcon, cls: 'c2' },
    { label: 'Absent Today',    value: summary.absentToday,    Icon: XIcon,     cls: 'c3' },
    { label: 'Not Marked',      value: notMarked,              Icon: ClockIcon, cls: 'c4' },
  ];

  return (
    <div>
      <div className="page-heading">
        <h1>Welcome back 👋</h1>
        <p>Here's what's happening with your team today.</p>
      </div>

      <div className="stats-grid">
        {STATS.map(({ label, value, Icon, cls }) => (
          <div className={`stat-card ${cls}`} key={label}>
            <div className="stat-card-top">
              <div>
                <div className="stat-label">{label}</div>
                <div className="stat-value">{value}</div>
              </div>
              <div className="stat-icon"><Icon /></div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Attendance Summary</div>
            <div className="card-subtitle">Total present days per employee (all time)</div>
          </div>
          <Link to="/attendance" className="btn btn-ghost btn-sm" style={{ gap: 6 }}>
            View All <ArrowRightIcon />
          </Link>
        </div>

        {summary.perEmployee.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">📋</span>
            <div className="empty-state-title">No attendance data yet</div>
            <div className="empty-state-text">Start marking attendance to see the summary appear here.</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Present Days</th>
                </tr>
              </thead>
              <tbody>
                {summary.perEmployee.map((emp) => (
                  <tr key={emp.employeeId}>
                    <td><span className="badge badge-blue">{emp.employeeId}</span></td>
                    <td style={{ fontWeight: 600 }}>{emp.fullName}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{emp.department}</td>
                    <td>
                      <span className="badge badge-present">✔ {emp.totalPresent} days</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
