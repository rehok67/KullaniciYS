import axios from 'axios';

const DEFAULT_BASE_URL = 'http://localhost:5000/api';

const normalizeBaseUrl = (value) => {
  const candidate = value ?? DEFAULT_BASE_URL;

  try {
    const url = new URL(candidate);

    if (['127.0.0.1', '0.0.0.0', '::1'].includes(url.hostname)) {
      url.hostname = 'localhost';
    }

    return url.toString().replace(/\/+$/, '');
  } catch {
    return DEFAULT_BASE_URL;
  }
};

const resolveBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);
  }

  if (import.meta.env.DEV) {
    return '/api';
  }

  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    const host = hostname || 'localhost';
    const portSegment = port ? `:${port}` : '';
    return `${protocol}//${host}${portSegment}/api`;
  }

  return DEFAULT_BASE_URL;
};

const apiClient = axios.create({
  baseURL: resolveBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
