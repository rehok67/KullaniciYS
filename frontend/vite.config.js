import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const normalizeProxyTarget = (value) => {
  const fallback = 'http://localhost:5000';

  if (!value) {
    return fallback;
  }

  try {
    const url = new URL(value);

    if (['127.0.0.1', '0.0.0.0', '::1'].includes(url.hostname)) {
      url.hostname = 'localhost';
    }

    if (url.pathname.endsWith('/api')) {
      url.pathname = url.pathname.replace(/\/api$/, '');
    }

    return url.toString().replace(/\/+$/, '');
  } catch {
    return fallback;
  }
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: normalizeProxyTarget(env.VITE_API_BASE_URL),
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
