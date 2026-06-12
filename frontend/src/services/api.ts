import axios from 'axios';

// IMPORTANT: BASE must be a relative path (/api/v1), NOT an absolute URL.
// Absolute URL  → browser makes a cross-origin request → CORS error.
// Relative path → browser sends to gigconnectsa.onrender.com/api/v1/* (same origin)
//              → nginx container proxies it to gigconnect-api.onrender.com → no CORS.
const BASE = '/api/v1';

// Render free tier spins down after 15 min inactivity.
// First request after cold start can take 50–60s. Set timeout accordingly.
export const api = axios.create({ baseURL: BASE, timeout: 90000 });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }
      try {
        const { data } = await axios.post(`${BASE}/auth/refresh?token=${refreshToken}`);
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        error.config.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(error.config);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (d: object) => api.post('/auth/register', d),
  login:    (d: object) => api.post('/auth/login', d),
  logout:   ()          => api.post('/auth/logout'),
};

export const jobsApi = {
  getAll:      (p?: object)             => api.get('/jobs', { params: p }),
  getById:     (id: string)             => api.get(`/jobs/${id}`),
  getMy:       ()                       => api.get('/jobs/my'),
  create:      (d: object)              => api.post('/jobs', d),
  accept:      (id: string)             => api.patch(`/jobs/${id}/accept`),
  submitProof: (id: string, p: object)  => api.patch(`/jobs/${id}/submit-proof`, null, { params: p }),
  approve:     (id: string)             => api.patch(`/jobs/${id}/approve`),
  cancel:      (id: string)             => api.patch(`/jobs/${id}/cancel`),
};

export const usersApi = {
  getMe:         ()             => api.get('/users/me'),
  updateMe:      (d: object)    => api.put('/users/me', d),
  searchWorkers: (s?: string)   => api.get('/users/workers', { params: { search: s } }),
};

export const walletApi  = { get: () => api.get('/wallet') };

export const ratingsApi = {
  submit:       (d: object) => api.post('/ratings', d),
  getLeaderboard: ()        => api.get('/leaderboard'),
};

export const aiApi = {
  chat:         (msg: string) => api.post('/ai/chat', { message: msg }),
  getHistory:   ()            => api.get('/ai/history'),
  clearHistory: ()            => api.delete('/ai/history'),
};
