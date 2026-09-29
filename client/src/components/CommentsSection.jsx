import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { getComments, createComment, deleteComment } from '../api/comments';
import { useAuthStore } from '../store/authStore';

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  const units = [
    ['year', 31536000], ['month', 2592000], ['day', 86400],
    ['hour', 3600], ['minute', 60],
  ];
  for (const [label, secs] of units) {
    const n = Math.floor(seconds / secs);
    if (n >= 1) return `${n} ${label}${n > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

export default function CommentsSection({ recipeId }) {
  const [text, setText] = useState('');
  const currentUser = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', recipeId],
    queryFn: () => getComments(recipeId),
  });

  const addMutation = useMutation({
    mutationFn: (commentText) => createComment(recipeId, commentText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', recipeId] });
      setText('');
    },
    onError: (e) => toast.error(e.response?.data?.error || 'Could not post comment'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', recipeId] });
    },
    onError: (e) => toast.error(e.response?.data?.error || 'Could not delete comment'),
  });

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    addMutation.mutate(trimmed);
  }

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-[#1D1D1D] mb-3">
        Comments {comments ? `(${comments.length})` : ''}
      </h2>

      {currentUser && (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            maxLength={1000}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946]"
          />
          <Button type="submit" size="sm" disabled={addMutation.isPending || !text.trim()}>
            Post
          </Button>
        </form>
      )}

      {isLoading && <p className="text-sm text-gray-400">Loading comments...</p>}

      {comments && comments.length === 0 && (
        <p className="text-sm text-gray-400">No comments yet. Be the first to say something.</p>
      )}

      <ul className="space-y-3">
        {comments?.map((comment) => (
          <li key={comment._id} className="bg-white rounded-lg p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#1D1D1D]">{comment.author?.name || 'Unknown'}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
                {currentUser?._id === comment.author?._id && (
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(comment._id)}
                    className="text-xs text-gray-400 hover:text-[#E63946]"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
            <p className="text-gray-700 mt-1">{comment.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
