import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import healthRoute from './routes/health.route.js';
import authRoute from './routes/auth.route.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/health', healthRoute);
app.use('/api/auth', authRoute);

app.get('/', (req, res) => {
  res.send('Recipe Box API is running 🍳');
});

export default app;