import { Hono } from "https://deno.land/x/hono@v4.3.11/mod.ts";
import { serveStatic, cors } from "https://deno.land/x/hono@v4.3.11/middleware.ts";

import registration from './api/registration.ts';
import uploadFile from './api/uploadFile.ts';

const app = new Hono();

// Enable CORS globally
app.use('*', cors({
  origin: '*',
}));

// API routes
const apiRoutes = new Hono();
apiRoutes.route('/uploadFile', uploadFile);
apiRoutes.route('/registration', registration);

// Mount API under /api
app.route('/api', apiRoutes);

// Serve static files
app.use('/*', serveStatic({
  root: './frontend/dist',
  // Optional: you can set `index: 'index.html'` to automatically serve index.html
}));

app.get('/*', async (c) => {
  const filePath = new URL('./frontend/dist/index.html', import.meta.url).pathname;
  const data = await Deno.readFile(filePath);
  return c.body(data.buffer, 200, {
    'content-type': 'text/html'
  });
});


// Start server
Deno.serve({ port: 8000 }, app.fetch);

console.log('Server is running on http://localhost:8000');
