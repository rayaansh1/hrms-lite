import React, { useEffect, useState } from 'react';
import { getEmployees, createEmployee, deleteEmployee } from '../services/api';

const INITIAL_FORM = { employeeId: '', fullName: '', email: '', department: '' };

function DeleteModal({ employee, onConfirm, onCancel, loading }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
        </div>
        <div className="modal-title">Delete Employee</div>
        <div className="modal-text">
          You're about to permanently delete <strong>{employee.fullName}</strong> ({employee.employeeId}).
          All their attendance records will also be removed. This cannot be undone.
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel} disabled={loading}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 14, height: 14 }} /> : null}
            Delete Employee
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Employees() {
  const [employees, setEmployees]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [form, setForm]             = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert]           = useState(null);
  const [toDelete, setToDelete]     = useState(null);
  const [deleting, setDeleting]     = useState(false);

  const fetchEmployees = () => {
    setLoading(true);
    getEmployees()
      .then((res) => setEmployees(res.data.data))
      .catch(() => setAlert({ type: 'error', message: 'Failed to load employees.' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEmployees(); }, []);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const validate = () => {
    const errs = {};
    if (!form.employeeId.trim()) errs.employeeId = 'Employee ID is required';
    if (!form.fullName.trim())   errs.fullName   = 'Full name is required';
    if (!form.email.trim())      errs.email      = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.department.trim()) errs.department = 'Department is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setFormErrors({});
    setSubmitting(true);
    try {
      await createEmployee(form);
      setForm(INITIAL_FORM);
      showAlert('success', 'Employee added successfully.');
      fetchEmployees();
    } catch (err) {
      showAlert('error', err.response?.data?.message || 'Failed to add employee.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteEmployee(toDelete._id);
      showAlert('success', `${toDelete.fullName} has been deleted.`);
      setToDelete(null);
      fetchEmployees();
    } catch {
      showAlert('error', 'Failed to delete employee.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="page-heading">
        <h1>Employees</h1>
        <p>Manage your team's employee records</p>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type === 'error' ? 'error' : 'success'}`}>
          <span>{alert.type === 'error' ? '✖' : '✔'}</span>
          {alert.message}
          <button onClick={() => setAlert(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: 'inherit', lineHeight: 1 }}>×</button>
        </div>
      )}

      {/* Add Form */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-header">
          <div>
            <div className="card-title">Add New Employee</div>
            <div className="card-subtitle">Fill in all fields to register a new team member</div>
          </div>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            {[
              { key: 'employeeId', label: 'Employee ID', placeholder: 'e.g. EMP001', type: 'text' },
              { key: 'fullName',   label: 'Full Name',   placeholder: 'e.g. Rahul Sharma', type: 'text' },
              { key: 'email',      label: 'Email Address', placeholder: 'e.g. rahul@company.com', type: 'email' },
              { key: 'department', label: 'Department',  placeholder: 'e.g. Engineering', type: 'text' },
            ].map(({ key, label, placeholder, type }) => (
              <div className="form-group" key={key}>
                <label className="form-label">{label} *</label>
                <input
                  className="form-input"
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
                {formErrors[key] && <span className="form-error">↑ {formErrors[key]}</span>}
              </div>
            ))}
          </div>
          <div className="form-actions" style={{ marginTop: 20 }}>
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting
                ? <span className="spinner" style={{ width: 14, height: 14, borderTopColor: 'white' }} />
                : <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 15, height: 15 }}><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"/></svg>
              }
              {submitting ? 'Adding…' : 'Add Employee'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => { setForm(INITIAL_FORM); setFormErrors({}); }}>
              Clear
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">All Employees</div>
            <div className="card-subtitle">{employees.length} {employees.length === 1 ? 'employee' : 'employees'} registered</div>
          </div>
        </div>

        {loading ? (
          <div className="loading-center"><span className="spinner" />Loading employees…</div>
        ) : employees.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">👥</span>
            <div className="empty-state-title">No employees yet</div>
            <div className="empty-state-text">Add your first employee using the form above to get started.</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp._id}>
                    <td><span className="badge badge-blue">{emp.employeeId}</span></td>
                    <td style={{ fontWeight: 600 }}>{emp.fullName}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{emp.email}</td>
                    <td>
                      <span className="badge badge-gray">{emp.department}</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {new Date(emp.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => setToDelete(emp)}>
                        <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 13, height: 13 }}>
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
                        </svg>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {toDelete && (
        <DeleteModal employee={toDelete} onConfirm={handleDelete} onCancel={() => setToDelete(null)} loading={deleting} />
      )}
    </div>
  );
}
