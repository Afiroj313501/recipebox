import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import healthRoute from './routes/health.route.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/health', healthRoute);

app.get('/', (req, res) => {
  res.send('Recipe Box AI API is running 🍳');
});

export default app;