import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static';
import postsRoute from './routes/ticket.routes.js';
import registerRoute from './routes/register.routes.js';
import responseRoute from "./routes/response.routes.js";
import otpRoute from "./routes/otp.routes.js";
import { cors } from 'hono/cors';

const app = new Hono()

app.use(cors({
  origin: 'http://localhost:4200',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}));

app.use('/uploads/*', serveStatic({ root: './' }));

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/api/tickets', postsRoute)
app.route('/api/auth', registerRoute);
app.route('/api/responses', responseRoute);
app.route('/api/otp', otpRoute);


serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
