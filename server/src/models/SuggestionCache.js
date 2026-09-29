import mongoose from 'mongoose';

const suggestionCacheSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  payload: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 },
});

export default mongoose.model('SuggestionCache', suggestionCacheSchema);
