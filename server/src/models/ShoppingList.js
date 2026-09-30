import mongoose from 'mongoose';

const shoppingItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, default: 0 },
    unit: { type: String, default: '' },
    checked: { type: Boolean, default: false },
  },
  { _id: true }
);

const shoppingListSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: { type: [shoppingItemSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model('ShoppingList', shoppingListSchema);