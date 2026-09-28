import User from '../models/User.js';

export async function requireAdmin(req, res, next) {
  try {
    const user = await User.findById(req.userId).select('role');

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (err) {
    next(err);
  }
}