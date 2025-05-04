import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingBag, ChevronLeft, CreditCard } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import Button from '../components/common/Button';

const CartPage = () => {
  const { cartItems, removeFromCart, updateCartItemQuantity, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const navigate = useNavigate();

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 0 ? 10 : 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    
    // Simulate checkout process
    setTimeout(() => {
      clearCart();
      navigate('/checkout-success');
    }, 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-custom">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={28} className="text-gray-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button
              as={Link}
              to="/products"
              variant="primary"
              leftIcon={<ChevronLeft size={16} />}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="font-semibold text-lg">
                    Cart Items ({cartItems.length})
                  </h2>
                </div>
                
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <li key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row">
                      <div className="flex-shrink-0 bg-gray-50 rounded-md w-24 h-24 p-2 flex items-center justify-center mr-4 mb-4 sm:mb-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <Link
                            to={`/products/${item.id}`}
                            className="text-base font-medium hover:text-primary-600 line-clamp-1"
                          >
                            {item.title}
                          </Link>
                          <button
                            className="text-gray-400 hover:text-red-500"
                            onClick={() => removeFromCart(item.id)}
                            aria-label="Remove item"
                          >
                            <X size={18} />
                          </button>
                        </div>
                        
                        <p className="text-sm text-gray-500 capitalize mb-4">
                          {item.category}
                        </p>
                        
                        <div className="flex flex-wrap justify-between items-center">
                          <div className="flex items-center border border-gray-300 rounded-md mb-2 sm:mb-0">
                            <button
                              type="button"
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                              onClick={() => updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              type="button"
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                              onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          
                          <div className="font-semibold">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  leftIcon={<CreditCard size={18} />}
                  isLoading={isCheckingOut}
                  onClick={handleCheckout}
                >
                  {isCheckingOut ? 'Processing...' : 'Checkout'}
                </Button>
                
                <div className="mt-4">
                  <Link
                    to="/products"
                    className="text-primary-600 text-sm inline-flex items-center hover:text-primary-700"
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;