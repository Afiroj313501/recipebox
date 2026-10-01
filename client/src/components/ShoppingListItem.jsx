import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

export default function ShoppingListItem({ item, onToggle, onDelete }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm"
    >
      <button
        type="button"
        onClick={() => onToggle(item._id, !item.checked)}
        aria-label={item.checked ? 'Mark as not bought' : 'Mark as bought'}
        className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
          item.checked ? 'bg-[#2A9D8F] border-[#2A9D8F]' : 'border-gray-300'
        }`}
      >
        {item.checked && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            viewBox="0 0 12 12"
            className="w-3 h-3"
          >
            <path d="M2 6l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" />
          </motion.svg>
        )}
      </button>

      <div className="flex-1 relative">
        <span className={`text-sm ${item.checked ? 'text-gray-400' : 'text-gray-800'}`}>
          {item.name}
          {item.qty > 0 && (
            <span className="text-gray-400">
              {' '}
              — {item.qty}
              {item.unit ? ` ${item.unit}` : ''}
            </span>
          )}
        </span>
        <motion.span
          initial={false}
          animate={{ scaleX: item.checked ? 1 : 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute left-0 top-1/2 h-[1.5px] bg-gray-400 origin-left"
          style={{ width: '100%' }}
        />
      </div>

      <button
        type="button"
        onClick={() => onDelete(item._id)}
        aria-label={`Remove ${item.name}`}
        className="text-gray-300 hover:text-[#E63946] shrink-0"
      >
        <Trash2 size={16} />
      </button>
    </motion.li>
  );
}
