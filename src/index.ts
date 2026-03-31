import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import postsRoute from './routes/ticket.routes.js';
import registerRoute from './routes/register.routes.js';
import { cors } from 'hono/cors';

const app = new Hono()

app.use(cors({
  origin: 'http://localhost:4200',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}));

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api/tickets', postsRoute)
app.route('/api/auth', registerRoute);

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
