import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';

const GridIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="nav-icon">
    <path d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm7 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM3 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zm7 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/>
  </svg>
);
const PeopleIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="nav-icon">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
  </svg>
);
const CalIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="nav-icon">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
  </svg>
);
const LogoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
  </svg>
);

const NAV = [
  { to: '/',          label: 'Dashboard', Icon: GridIcon },
  { to: '/employees', label: 'Employees', Icon: PeopleIcon },
  { to: '/attendance',label: 'Attendance', Icon: CalIcon },
];

const PAGE_TITLES = {
  '/':           'Dashboard',
  '/employees':  'Employees',
  '/attendance': 'Attendance',
};

function Topbar() {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'HRMS Lite';
  const date = new Date().toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });
  return (
    <div className="topbar">
      <span className="topbar-title">{title}</span>
      <span className="topbar-date">{date}</span>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-mark"><LogoIcon /></div>
            <div className="sidebar-logo-text">HRMS Lite</div>
            <div className="sidebar-logo-sub">Admin Panel</div>
          </div>

          <nav className="sidebar-nav">
            <div className="sidebar-section-label">Navigation</div>
            {NAV.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
              >
                <Icon />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-footer-text">
              <span className="sidebar-footer-dot" />
              System Online
            </div>
          </div>
        </aside>

        <div className="main-content">
          <Topbar />
          <main className="page-content">
            <Routes>
              <Route path="/"           element={<Dashboard />} />
              <Route path="/employees"  element={<Employees />} />
              <Route path="/attendance" element={<Attendance />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
