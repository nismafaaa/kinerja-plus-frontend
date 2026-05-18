import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    root: '.',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: env.API_URL || 'http://0.0.0.0:8080',
          changeOrigin: true,
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              const username = env.API_USERNAME;
              const password = env.API_PASSWORD;
              const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');
              proxyReq.setHeader('Authorization', authHeader);
            });
          }
        }
      }
    },
  };
});
