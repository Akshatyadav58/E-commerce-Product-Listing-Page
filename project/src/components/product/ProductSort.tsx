import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface ProductSortProps {
  onSortChange: (option: string) => void;
  currentSort: string;
}

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Top Rated' },
];

const ProductSort: React.FC<ProductSortProps> = ({ onSortChange, currentSort }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLabel = sortOptions.find(option => option.value === currentSort)?.label || 'Sort by';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center justify-between w-full sm:w-44 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{currentLabel}</span>
        <ChevronDown size={16} className="ml-2" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 w-full sm:w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <ul className="py-1" role="listbox">
            {sortOptions.map((option) => (
              <li
                key={option.value}
                role="option"
                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                  currentSort === option.value ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700'
                }`}
                onClick={() => {
                  onSortChange(option.value);
                  setIsOpen(false);
                }}
                aria-selected={currentSort === option.value}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductSort;