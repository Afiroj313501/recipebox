import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, lowercase: true, trim: true },
    qty: { type: Number },
    unit: { type: String },
    raw: { type: String }, // original text as typed, e.g. "2 large eggs"
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    imageUrl: { type: String, default: '' },

    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      required: true,
    },

    cuisine: { type: String, default: '' },
    tags: { type: [String], default: [] },

    servings: { type: Number, default: 1 },
    prepMinutes: { type: Number, default: 0 },
    cookMinutes: { type: Number, default: 0 },

    ingredients: { type: [ingredientSchema], default: [] },
    steps: { type: [String], default: [] },

    isAISuggestion: { type: Boolean, default: false },

    // Community features
    visibility: {
      type: String,
      enum: ['private', 'public'],
      default: 'private',
    },
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected'],
      default: 'draft',
    },

    rating: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text search across title + ingredient names
recipeSchema.index({ title: 'text', 'ingredients.name': 'text' });
recipeSchema.index({ mealType: 1 });
recipeSchema.index({ tags: 1 });
recipeSchema.index({ visibility: 1, status: 1 }); // for the public feed query

// Automatically set status when visibility changes
recipeSchema.pre('save', function (next) {
  if (this.isModified('visibility')) {
    if (this.visibility === 'public' && this.status === 'draft') {
      this.status = 'pending';
    }
    if (this.visibility === 'private') {
      this.status = 'draft';
    }
  }
  next();
});

export default mongoose.model('Recipe', recipeSchema);