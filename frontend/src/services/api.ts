import axios from 'axios';

// In production on Render, VITE_API_URL is set to the full backend URL.
// In local dev, it falls back to /api/v1 (proxied by Vite dev server).
const BASE = (import.meta as any).env?.VITE_API_URL ?? '/api/v1';

export const api = axios.create({ baseURL: BASE, timeout: 15000 });

api.interceptors.request.use(c => {
  const t = localStorage.getItem('accessToken');
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (t: string) => void; reject: (e: unknown) => void }> = [];
const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach(p => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
};

api.interceptors.response.use(r => r, async e => {
  if (e.response?.status === 401 && !e.config._retry) {
    e.config._retry = true;
    const rt = localStorage.getItem('refreshToken');
    if (!rt) { localStorage.clear(); window.location.href = '/login'; return Promise.reject(e); }
    if (isRefreshing) {
      return new Promise((resolve, reject) => { failedQueue.push({ resolve, reject }); })
        .then(token => { e.config.headers.Authorization = `Bearer ${token}`; return api(e.config); });
    }
    isRefreshing = true;
    try {
      const { data } = await axios.post(`${BASE}/auth/refresh?token=${rt}`);
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      processQueue(null, data.data.accessToken);
      e.config.headers.Authorization = `Bearer ${data.data.accessToken}`;
      return api(e.config);
    } catch (err) { processQueue(err, null); localStorage.clear(); window.location.href = '/login'; return Promise.reject(err); }
    finally { isRefreshing = false; }
  }
  return Promise.reject(e);
});

export const authApi    = { register: (d: object) => api.post('/auth/register', d), login: (d: object) => api.post('/auth/login', d), logout: () => api.post('/auth/logout') };
export const jobsApi    = { getAll: (p?: object) => api.get('/jobs', { params: p }), getById: (id: string) => api.get(`/jobs/${id}`), getMy: () => api.get('/jobs/my'), create: (d: object) => api.post('/jobs', d), accept: (id: string) => api.patch(`/jobs/${id}/accept`), submitProof: (id: string, p: object) => api.patch(`/jobs/${id}/submit-proof`, null, { params: p }), approve: (id: string) => api.patch(`/jobs/${id}/approve`), cancel: (id: string) => api.patch(`/jobs/${id}/cancel`) };
export const usersApi   = { getMe: () => api.get('/users/me'), updateMe: (d: object) => api.put('/users/me', d), searchWorkers: (s?: string) => api.get('/users/workers', { params: { search: s } }) };
export const walletApi  = { get: () => api.get('/wallet') };
export const ratingsApi = { submit: (d: object) => api.post('/ratings', d), getLeaderboard: () => api.get('/leaderboard') };
export const aiApi      = { chat: (msg: string) => api.post('/ai/chat', { message: msg }), getHistory: () => api.get('/ai/history'), clearHistory: () => api.delete('/ai/history') };
