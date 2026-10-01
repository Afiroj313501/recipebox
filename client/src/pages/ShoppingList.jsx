import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  getShoppingList,
  updateShoppingItem,
  deleteShoppingItem,
} from '../api/shoppingList';
import ShoppingListItem from '../components/ShoppingListItem';

export default function ShoppingListPage() {
  const queryClient = useQueryClient();
  const [hideChecked, setHideChecked] = useState(false);

  const { data: list, isLoading } = useQuery({
    queryKey: ['shopping-list'],
    queryFn: getShoppingList,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ itemId, checked }) => updateShoppingItem(itemId, checked),
    onSuccess: (updated) => queryClient.setQueryData(['shopping-list'], updated),
    onError: () => toast.error('Could not update item'),
  });

  const deleteMutation = useMutation({
    mutationFn: (itemId) => deleteShoppingItem(itemId),
    onSuccess: (updated) => queryClient.setQueryData(['shopping-list'], updated),
    onError: () => toast.error('Could not remove item'),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
        <p className="text-gray-500">Loading your list...</p>
      </div>
    );
  }

  const items = list?.items || [];
  const visibleItems = hideChecked ? items.filter((i) => !i.checked) : items;
  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <div className="min-h-screen bg-[#FFF8F0] p-8">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-bold text-[#1D1D1D]">Shopping List</h1>
          {items.length > 0 && (
            <button
              type="button"
              onClick={() => setHideChecked((h) => !h)}
              className="text-xs text-gray-500 hover:text-[#E63946] underline"
            >
              {hideChecked ? 'Show checked' : 'Hide checked'}
            </button>
          )}
        </div>

        {items.length > 0 && (
          <p className="text-sm text-gray-400 mb-6">
            {checkedCount} of {items.length} picked up
          </p>
        )}

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🛒</p>
            <p className="text-gray-500 mb-2">Your list is empty.</p>
            <p className="text-sm text-gray-400">
              Add items from any recipe's detail page.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            <AnimatePresence initial={false}>
              {visibleItems.map((item) => (
                <ShoppingListItem
                  key={item._id}
                  item={item}
                  onToggle={(itemId, checked) => toggleMutation.mutate({ itemId, checked })}
                  onDelete={(itemId) => deleteMutation.mutate(itemId)}
                />
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}
