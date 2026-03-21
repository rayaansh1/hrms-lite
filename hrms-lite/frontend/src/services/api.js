import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({ baseURL: BASE_URL });

// ─── Employees ────────────────────────────────────────────────────────────────
export const getEmployees = () => api.get('/employees');
export const createEmployee = (data) => api.post('/employees', data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

// ─── Attendance ───────────────────────────────────────────────────────────────
export const getAttendance = (params) => api.get('/attendance', { params });
export const markAttendance = (data) => api.post('/attendance', data);
export const getSummary = () => api.get('/attendance/summary');
