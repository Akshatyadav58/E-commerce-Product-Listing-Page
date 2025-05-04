import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ArrowUpDown } from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import ProductSort from '../components/product/ProductSort';
import Button from '../components/common/Button';
import { Product, FilterOptions } from '../types';
import { fetchProducts, fetchCategories } from '../services/api';

const ProductListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Get search params
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts(),
          fetchCategories()
        ]);
        
        setProducts(productsData);
        setCategories(categoriesData);
        
        // Apply initial filters from URL params
        const initialFilters: FilterOptions = {
          categories: categoryParam ? [categoryParam] : [],
          priceRange: [0, 1000],
          searchQuery
        };
        
        filterAndSortProducts(productsData, initialFilters, sortBy);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [categoryParam, searchQuery]);

  const filterAndSortProducts = (
    productList: Product[],
    filters: FilterOptions,
    sortOption: string
  ) => {
    // Apply filters
    let filtered = [...productList];
    
    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      );
    }
    
    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      filtered = filtered.filter(
        product => product.price >= min && product.price <= max
      );
    }
    
    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        product => 
          product.title.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case 'newest':
        // In a real app, would sort by date
        // For demo, reverse the order to simulate newest
        filtered.reverse();
        break;
      default: // featured
        // Keep original order
        break;
    }
    
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleFilterChange = (filters: FilterOptions) => {
    // Update URL params
    const params = new URLSearchParams(searchParams);
    
    if (filters.categories && filters.categories.length > 0) {
      params.set('category', filters.categories[0]);
    } else {
      params.delete('category');
    }
    
    if (filters.priceRange) {
      params.set('minPrice', filters.priceRange[0].toString());
      params.set('maxPrice', filters.priceRange[1].toString());
    }
    
    setSearchParams(params);
    
    // Apply filters and current sort
    filterAndSortProducts(products, { ...filters, searchQuery }, sortBy);
  };

  const handleSortChange = (option: string) => {
    setSortBy(option);
    filterAndSortProducts(
      products, 
      { 
        categories: categoryParam ? [categoryParam] : [], 
        priceRange: [0, 1000],
        searchQuery
      }, 
      option
    );
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-background">
      {/* Page header */}
      <div className="bg-primary-800 text-white py-16">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-2">
            {categoryParam 
              ? `${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)} Products`
              : searchQuery 
                ? `Search Results: "${searchQuery}"`
                : 'All Products'
            }
          </h1>
          <p className="text-primary-200 mb-0">
            {filteredProducts.length} products found
          </p>
        </div>
      </div>
      
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h2 className="text-lg font-medium mb-4">Filters</h2>
              <ProductFilters
                onFilterChange={handleFilterChange}
                categories={categories}
              />
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-grow">
            {/* Mobile filter button & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Filter size={16} />}
                className="md:hidden"
                onClick={() => setShowMobileFilters(true)}
              >
                Filters
              </Button>
              
              <div className="flex items-center">
                <ArrowUpDown size={16} className="mr-2 text-gray-500" />
                <span className="text-sm text-gray-600 mr-3">Sort by:</span>
                <ProductSort onSortChange={handleSortChange} currentSort={sortBy} />
              </div>
            </div>
            
            {/* Products grid */}
            <ProductGrid 
              products={currentProducts} 
              isLoading={isLoading} 
              error={error} 
            />
            
            {/* Pagination */}
            {!isLoading && filteredProducts.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Filters Dialog */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-xs">
              <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                <ProductFilters
                  onFilterChange={handleFilterChange}
                  categories={categories}
                  isMobile={true}
                  onCloseMobile={() => setShowMobileFilters(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListingPage;