import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';
import { Product } from '../../types';
import Button from '../common/Button';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isWishlisted = isInWishlist(product.id);

  // Handle wishlist toggle
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  // Format price with appropriate currency symbol and commas
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Calculate sale price (20% off) - only for items over $100
  const showSale = product.price > 100;
  const salePrice = showSale ? product.price * 0.8 : null;

  return (
    <div className="card group overflow-hidden">
      <Link to={`/products/${product.id}`} className="block relative">
        {/* Product Image */}
        <div className="relative w-full h-64 overflow-hidden bg-gray-100">
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse w-12 h-12 rounded-full bg-gray-200" />
            </div>
          )}
          <img
            src={product.image}
            alt={product.title}
            className={`w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsImageLoaded(true)}
          />
          
          {/* Sale Badge */}
          {showSale && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
              20% OFF
            </div>
          )}
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-all"
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={20}
              className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}
            />
          </button>
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          <div className="text-xs text-gray-500 uppercase mb-1">{product.category}</div>
          <h3 className="text-base font-medium mb-1 line-clamp-1">{product.title}</h3>
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              {showSale ? (
                <>
                  <span className="text-lg font-semibold text-red-500">
                    {formatPrice(salePrice!)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-semibold">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <div className="flex items-center">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(product.rating.rate)
                        ? 'text-accent-400 fill-accent-400'
                        : 'text-gray-300 fill-gray-300'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">({product.rating.count})</span>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <Button
            variant="primary"
            fullWidth
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            leftIcon={<ShoppingCart size={16} />}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;