import Comment from '../models/Comment.js';
import Recipe from '../models/Recipe.js';
import { createCommentSchema } from '../validators/comment.validator.js';

async function assertVisible(recipeId, userId) {
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) return null;

  const isOwner = recipe.owner.toString() === userId;
  const isPublicApproved = recipe.visibility === 'public' && recipe.status === 'approved';

  if (!isOwner && !isPublicApproved) return null;
  return recipe;
}

// GET /api/recipes/:id/comments
export async function getComments(req, res) {
  const recipe = await assertVisible(req.params.id, req.userId);
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  const comments = await Comment.find({ recipe: req.params.id })
    .populate('author', 'name avatarUrl')
    .sort({ createdAt: 1 });

  res.json({ comments });
}

// POST /api/recipes/:id/comments
export async function createComment(req, res) {
  const parsed = createCommentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const recipe = await assertVisible(req.params.id, req.userId);
  if (!recipe) {
    return res.status(404).json({ error: 'Recipe not found' });
  }

  let comment = await Comment.create({
    recipe: req.params.id,
    author: req.userId,
    text: parsed.data.text,
  });
  comment = await comment.populate('author', 'name avatarUrl');

  res.status(201).json({ comment });
}

// DELETE /api/comments/:commentId
export async function deleteComment(req, res) {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  if (comment.author.toString() !== req.userId) {
    return res.status(403).json({ error: 'Not authorized to delete this comment' });
  }

  await comment.deleteOne();
  res.json({ success: true });
}
