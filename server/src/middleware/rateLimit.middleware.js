import rateLimit from 'express-rate-limit';

export const suggestLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.userId || req.ip,
  message: { error: 'Too many suggestion requests. Please wait a minute and try again.' },
});
