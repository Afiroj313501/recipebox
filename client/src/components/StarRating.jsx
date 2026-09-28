import { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ value = 0, onChange, readOnly = false, size = 20 }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <div className="flex gap-0.5" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(n)}
          onMouseEnter={() => !readOnly && setHover(n)}
          aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
          className={readOnly ? 'cursor-default' : 'cursor-pointer transition-transform hover:scale-110'}
        >
          <Star
            size={size}
            className={n <= shown ? 'fill-[#F4A261] text-[#F4A261]' : 'text-gray-300'}
          />
        </button>
      ))}
    </div>
  );
}