import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
app.use(cors());
app.use(express.json());

const TARGET = process.env.TARGET || 'https://depbackend-fullstack.onrender.com';
const SERVICE_ID = process.env.SERVICE_ID || 'srv-d4h4goumcj7s73bq6uog';

// Proxy any /api/* to the target backend
app.use('/api', createProxyMiddleware({
  target: TARGET,
  changeOrigin: true,
  pathRewrite: { '^/api': '/api' },
  onProxyReq: (proxyReq, req, res) => {
    // Add optional headers that your backend may expect
    proxyReq.setHeader('x-service-id', SERVICE_ID);
    // If you want to forward an Authorization token from the client, ensure
    // the frontend sets it and uncomment the following lines:
    // const auth = req.headers['authorization'];
    // if (auth) proxyReq.setHeader('authorization', auth);
  },
  logLevel: 'info'
}));

app.get('/', (req, res) => {
  res.send(`DEP proxy running — forwarding /api to ${TARGET}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy listening on http://localhost:${PORT} -> ${TARGET}`));
