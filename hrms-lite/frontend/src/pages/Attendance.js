import React, { useEffect, useState, useCallback } from 'react';
import { getEmployees, getAttendance, markAttendance } from '../services/api';

const today = new Date().toISOString().split('T')[0];

export default function Attendance() {
  const [employees, setEmployees]     = useState([]);
  const [records, setRecords]         = useState([]);
  const [totalPresent, setTotalPresent] = useState(null);
  const [loadingEmp, setLoadingEmp]   = useState(true);
  const [loadingRec, setLoadingRec]   = useState(false);
  const [submitting, setSubmitting]   = useState(false);
  const [alert, setAlert]             = useState(null);
  const [form, setForm]               = useState({ employeeId: '', date: today, status: 'Present' });
  const [formErrors, setFormErrors]   = useState({});
  const [filterEmp, setFilterEmp]     = useState('');
  const [filterDate, setFilterDate]   = useState('');

  useEffect(() => {
    getEmployees()
      .then((res) => setEmployees(res.data.data))
      .catch(() => showAlert('error', 'Failed to load employees.'))
      .finally(() => setLoadingEmp(false));
  }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const fetchRecords = useCallback((empId = filterEmp, date = filterDate) => {
    setLoadingRec(true);
    const params = {};
    if (empId) params.employeeId = empId;
    if (date)  params.date = date;
    getAttendance(params)
      .then((res) => { setRecords(res.data.data); setTotalPresent(res.data.totalPresent); })
      .catch(() => showAlert('error', 'Failed to load attendance records.'))
      .finally(() => setLoadingRec(false));
  }, []); // eslint-disable-line

  useEffect(() => { fetchRecords('', ''); }, []); // eslint-disable-line

  const validate = () => {
    const errs = {};
    if (!form.employeeId) errs.employeeId = 'Select an employee';
    if (!form.date)       errs.date       = 'Date is required';
    return errs;
  };

  const handleMark = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setFormErrors({});
    setSubmitting(true);
    try {
      await markAttendance({ employeeId: form.employeeId, date: form.date, status: form.status });
      showAlert('success', `Attendance marked as ${form.status} successfully.`);
      fetchRecords(filterEmp, filterDate);
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Failed to mark attendance.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFilterApply = (e) => {
    e.preventDefault();
    fetchRecords(filterEmp, filterDate);
  };

  const handleFilterReset = () => {
    setFilterEmp(''); setFilterDate('');
    fetchRecords('', '');
    setTotalPresent(null);
  };

  return (
    <div>
      <div className="page-heading">
        <h1>Attendance</h1>
        <p>Mark and review daily attendance records</p>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type === 'error' ? 'error' : 'success'}`}>
          <span>{alert.type === 'error' ? '✖' : '✔'}</span>
          {alert.message}
          <button onClick={() => setAlert(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'inherit', lineHeight: 1 }}>×</button>
        </div>
      )}

      {/* Mark Attendance */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div>
            <div className="card-title">Mark Attendance</div>
            <div className="card-subtitle">Re-marking on the same date will update the existing record</div>
          </div>
        </div>
        <form onSubmit={handleMark} noValidate>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Employee *</label>
              {loadingEmp ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="spinner" style={{ width: 14, height: 14 }} /> Loading…
                </div>
              ) : (
                <select className="form-select" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
                  <option value="">Select an employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>{emp.employeeId} — {emp.fullName}</option>
                  ))}
                </select>
              )}
              {formErrors.employeeId && <span className="form-error">↑ {formErrors.employeeId}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Date *</label>
              <input type="date" className="form-input" value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })} />
              {formErrors.date && <span className="form-error">↑ {formErrors.date}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Status *</label>
              <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="Present">✔ Present</option>
                <option value="Absent">✖ Absent</option>
              </select>
            </div>
          </div>

          <div className="form-actions" style={{ marginTop: 20 }}>
            <button className="btn btn-primary" type="submit" disabled={submitting || loadingEmp}>
              {submitting
                ? <span className="spinner" style={{ width: 14, height: 14, borderTopColor: 'white' }} />
                : <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 15, height: 15 }}><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              }
              {submitting ? 'Saving…' : 'Mark Attendance'}
            </button>
          </div>
        </form>
      </div>

      {/* Records */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Attendance Records</div>
            <div className="card-subtitle">
              {records.length} record{records.length !== 1 ? 's' : ''} found
              {totalPresent !== null && (
                <span style={{ marginLeft: 10, color: 'var(--success)', fontWeight: 700 }}>
                  · {totalPresent} present day{totalPresent !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <form onSubmit={handleFilterApply} className="filter-row">
          <div className="form-group">
            <label className="form-label">Filter by Employee</label>
            <select className="form-select" value={filterEmp} onChange={(e) => setFilterEmp(e.target.value)}>
              <option value="">All employees</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>{emp.employeeId} — {emp.fullName}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Filter by Date</label>
            <input type="date" className="form-input" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
            <button type="submit" className="btn btn-primary btn-sm">Apply</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={handleFilterReset}>Reset</button>
          </div>
        </form>

        {loadingRec ? (
          <div className="loading-center"><span className="spinner" />Loading records…</div>
        ) : records.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">📅</span>
            <div className="empty-state-title">No records found</div>
            <div className="empty-state-text">
              {filterEmp || filterDate ? 'Try adjusting the filters above.' : 'Mark attendance using the form above to see records here.'}
            </div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec._id}>
                    <td><span className="badge badge-blue">{rec.employee?.employeeId}</span></td>
                    <td style={{ fontWeight: 600 }}>{rec.employee?.fullName}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      <span className="badge badge-gray">{rec.employee?.department}</span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {new Date(rec.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <span className={`badge badge-${rec.status === 'Present' ? 'present' : 'absent'}`}>
                        {rec.status === 'Present' ? '✔' : '✖'} {rec.status}
                      </span>
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
