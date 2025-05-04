import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Sliders } from 'lucide-react';
import Button from '../common/Button';
import { useSearchParams } from 'react-router-dom';
import { FilterOptions } from '../../types';

interface ProductFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  categories: string[];
  isMobile?: boolean;
  onCloseMobile?: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  onFilterChange,
  categories,
  isMobile = false,
  onCloseMobile,
}) => {
  const [searchParams] = useSearchParams();
  const [price, setPrice] = useState<[number, number]>([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: true,
    price: true,
    rating: true,
  });

  useEffect(() => {
    // Initialize filters from URL
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }

    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice && maxPrice) {
      setPrice([Number(minPrice), Number(maxPrice)]);
    }
  }, [searchParams]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (category: string) => {
    let newSelectedCategories;
    
    if (selectedCategories.includes(category)) {
      newSelectedCategories = selectedCategories.filter((cat) => cat !== category);
    } else {
      newSelectedCategories = [...selectedCategories, category];
    }
    
    setSelectedCategories(newSelectedCategories);
    
    onFilterChange({
      categories: newSelectedCategories,
      priceRange: price,
    });
  };

  const handlePriceChange = (index: number, value: number) => {
    const newPrice = [...price] as [number, number];
    newPrice[index] = value;
    
    // Ensure min <= max
    if (index === 0 && value > newPrice[1]) {
      newPrice[1] = value;
    } else if (index === 1 && value < newPrice[0]) {
      newPrice[0] = value;
    }
    
    setPrice(newPrice);
    
    onFilterChange({
      categories: selectedCategories,
      priceRange: newPrice,
    });
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPrice([0, 1000]);
    
    onFilterChange({
      categories: [],
      priceRange: [0, 1000],
    });
  };

  return (
    <div className={`bg-white ${isMobile ? 'p-4' : 'p-0'}`}>
      {isMobile && (
        <div className="flex items-center justify-between mb-4 border-b pb-4">
          <div className="flex items-center">
            <Sliders size={20} className="mr-2" />
            <h2 className="text-lg font-medium">Filters</h2>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-full hover:bg-gray-100"
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        </div>
      )}
      
      <div className="space-y-6">
        {/* Categories Section */}
        <div className="pb-4 border-b border-gray-200">
          <button
            className="w-full flex items-center justify-between mb-3"
            onClick={() => toggleSection('category')}
          >
            <h3 className="text-base font-medium">Categories</h3>
            {openSections.category ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
          
          {openSections.category && (
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <label
                    htmlFor={`category-${category}`}
                    className="ml-2 text-sm text-gray-700 capitalize"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Price Range Section */}
        <div className="pb-4 border-b border-gray-200">
          <button
            className="w-full flex items-center justify-between mb-3"
            onClick={() => toggleSection('price')}
          >
            <h3 className="text-base font-medium">Price Range</h3>
            {openSections.price ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>
          
          {openSections.price && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  ${price[0].toFixed(0)}
                </span>
                <span className="text-sm text-gray-500">
                  ${price[1].toFixed(0)}
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={price[0]}
                  onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={price[1]}
                  onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-1/2">
                  <label htmlFor="min-price" className="block text-xs text-gray-500 mb-1">
                    Min
                  </label>
                  <input
                    type="number"
                    id="min-price"
                    min="0"
                    max={price[1]}
                    value={price[0]}
                    onChange={(e) => handlePriceChange(0, Number(e.target.value))}
                    className="w-full p-2 text-sm border border-gray-300 rounded"
                  />
                </div>
                <div className="w-1/2">
                  <label htmlFor="max-price" className="block text-xs text-gray-500 mb-1">
                    Max
                  </label>
                  <input
                    type="number"
                    id="max-price"
                    min={price[0]}
                    max="1000"
                    value={price[1]}
                    onChange={(e) => handlePriceChange(1, Number(e.target.value))}
                    className="w-full p-2 text-sm border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Reset Filters Button */}
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={resetFilters}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default ProductFilters;