import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, ChevronRight, Star, Loader } from 'lucide-react';
import { fetchProductById, fetchProducts } from '../services/api';
import { Product } from '../types';
import Button from '../components/common/Button';
import ProductCard from '../components/product/ProductCard';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'reviews'>('description');
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const productData = await fetchProductById(Number(id));
        setProduct(productData);
        
        // Fetch related products from same category
        const allProducts = await fetchProducts();
        const filtered = allProducts
          .filter(p => p.category === productData.category && p.id !== productData.id)
          .slice(0, 4);
        
        setRelatedProducts(filtered);
      } catch (err) {
        setError('Failed to load product details. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProductData();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        ...product,
        quantity
      });
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="container-custom py-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader size={48} className="animate-spin mb-4 mx-auto text-primary-600" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-custom py-16 min-h-screen flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <svg
            className="w-16 h-16 text-error mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The requested product could not be found.'}</p>
          <Button as={Link} to="/products" variant="primary">
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="container-custom py-8">
        {/* Breadcrumbs */}
        <nav className="flex py-3 text-gray-600 text-sm">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <ChevronRight size={16} className="mx-2" />
          <Link to="/products" className="hover:text-primary-600">Products</Link>
          <ChevronRight size={16} className="mx-2" />
          <Link 
            to={`/products?category=${product.category}`} 
            className="hover:text-primary-600 capitalize"
          >
            {product.category}
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-gray-400 truncate">{product.title}</span>
        </nav>
        
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
          {/* Product Image */}
          <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center">
            <img 
              src={product.image} 
              alt={product.title} 
              className="max-h-96 max-w-full object-contain"
            />
          </div>
          
          {/* Product Info */}
          <div>
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full uppercase tracking-wider mb-3">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className={`${
                        star <= Math.round(product.rating.rate)
                          ? 'text-accent-400 fill-accent-400'
                          : 'text-gray-300 fill-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">
                  {product.rating.rate} ({product.rating.count} reviews)
                </span>
              </div>
              
              <p className="text-3xl font-bold text-gray-900 mb-6">
                {formatPrice(product.price)}
              </p>
              
              <p className="text-gray-600 mb-6 line-clamp-3">
                {product.description}
              </p>
            </div>
            
            {/* Add to Cart */}
            <div className="mb-6">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    type="button"
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 border-0 text-center focus:ring-0"
                  />
                  <button
                    type="button"
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.rating.count > 10 ? 'In Stock' : 'Low Stock'}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  leftIcon={<ShoppingCart size={20} />}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  leftIcon={<Heart size={20} className={isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""} />}
                  onClick={handleWishlistToggle}
                  aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                >
                  {isInWishlist(product.id) ? 'Saved' : 'Save'}
                </Button>
                
                <Button
                  variant="ghost"
                  size="lg"
                  leftIcon={<Share2 size={20} />}
                  aria-label="Share product"
                >
                  Share
                </Button>
              </div>
            </div>
            
            {/* Product Metadata */}
            <div className="border-t border-gray-200 pt-4">
              <dl className="divide-y divide-gray-200">
                <div className="py-2 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">SKU</dt>
                  <dd className="text-sm text-gray-900">SKU-{product.id.toString().padStart(5, '0')}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="text-sm text-gray-900 capitalize">{product.category}</dd>
                </div>
                <div className="py-2 flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Tags</dt>
                  <dd className="text-sm text-gray-900">fashion, {product.category}, trending</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
        
        {/* Product Tabs */}
        <div className="my-12 border-t border-gray-200">
          <div className="flex border-b">
            <button
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'description'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'details'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('details')}
            >
              Additional Information
            </button>
            <button
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'reviews'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.rating.count})
            </button>
          </div>
          
          <div className="py-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="mb-4">{product.description}</p>
                <p>
                  Our {product.category} products are designed with quality and comfort in mind.
                  This particular item features premium materials that ensure durability and
                  long-lasting performance.
                </p>
              </div>
            )}
            
            {activeTab === 'details' && (
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium mb-4">Product Specifications</h3>
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-500 w-1/3">Material</td>
                      <td className="py-3 text-sm text-gray-900">Premium Quality</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-500">Dimensions</td>
                      <td className="py-3 text-sm text-gray-900">Varies by size</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-500">Weight</td>
                      <td className="py-3 text-sm text-gray-900">Light weight</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-500">Color</td>
                      <td className="py-3 text-sm text-gray-900">As shown</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-500">Manufacturer</td>
                      <td className="py-3 text-sm text-gray-900">Fashion Store Inc.</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-sm font-medium text-gray-500">Country of Origin</td>
                      <td className="py-3 text-sm text-gray-900">United States</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium">Customer Reviews</h3>
                  <Button variant="outline" size="sm">Write a Review</Button>
                </div>
                
                {/* Sample Reviews */}
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border-b border-gray-200 pb-6">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">John Doe</h4>
                        <span className="text-sm text-gray-500">
                          {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, star) => (
                          <Star
                            key={star}
                            size={16}
                            className={`${
                              star < 5 - i
                                ? 'text-accent-400 fill-accent-400'
                                : 'text-gray-300 fill-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600">
                        {i === 0
                          ? "Absolutely love this product! Great quality and exactly as described."
                          : i === 1
                          ? "Good product overall. Shipping was fast and the quality is nice."
                          : "Decent product for the price. Would recommend to others looking for something similar."}
                      </p>
                    </div>
                  ))}
                </div>
                
                <Button variant="ghost" size="sm" className="mt-4">
                  Load More Reviews
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="my-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Related Products</h2>
              <Link
                to={`/products?category=${product.category}`}
                className="text-primary-600 hover:text-primary-700 flex items-center"
              >
                View All <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;