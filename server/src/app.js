import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import healthRoute from './routes/health.route.js';
import authRoute from './routes/auth.route.js';
import recipeRoute from './routes/recipe.route.js';
import uploadRoute from './routes/upload.route.js';
import adminRoute from './routes/admin.route.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/health', healthRoute);
app.use('/api/auth', authRoute);
app.use('/api/recipes', recipeRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/admin', adminRoute);

app.get('/', (req, res) => {
  res.send('Recipe Box API is running 🍳');
});

// Global error handler — MUST be last, after all routes
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong on the server',
  });
});

export default app;