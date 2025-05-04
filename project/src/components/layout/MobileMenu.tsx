import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface MobileMenuProps {
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onClose }) => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="fixed inset-0 z-50 bg-white p-4 animate-fade-in lg:hidden">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold">Menu</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>

      <nav className="space-y-6">
        <Link 
          to="/" 
          className="block py-2 text-lg font-medium border-b border-gray-100"
          onClick={onClose}
        >
          Home
        </Link>
        <Link 
          to="/products" 
          className="block py-2 text-lg font-medium border-b border-gray-100"
          onClick={onClose}
        >
          All Products
        </Link>
        <Link 
          to="/products?category=men" 
          className="block py-2 text-lg font-medium border-b border-gray-100"
          onClick={onClose}
        >
          Men
        </Link>
        <Link 
          to="/products?category=women" 
          className="block py-2 text-lg font-medium border-b border-gray-100"
          onClick={onClose}
        >
          Women
        </Link>
        <Link 
          to="/products?category=jewelry" 
          className="block py-2 text-lg font-medium border-b border-gray-100"
          onClick={onClose}
        >
          Jewelry
        </Link>
        <Link 
          to="/cart" 
          className="block py-2 text-lg font-medium border-b border-gray-100"
          onClick={onClose}
        >
          Cart
        </Link>
        <Link 
          to="/profile/wishlist" 
          className="block py-2 text-lg font-medium border-b border-gray-100"
          onClick={onClose}
        >
          Wishlist
        </Link>
        
        {isAuthenticated ? (
          <>
            <Link 
              to="/profile" 
              className="block py-2 text-lg font-medium border-b border-gray-100"
              onClick={onClose}
            >
              My Account
            </Link>
            <button 
              onClick={() => {
                logout();
                onClose();
              }}
              className="block w-full text-left py-2 text-lg font-medium text-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <Link 
            to="/auth" 
            className="block py-2 text-lg font-medium text-primary-600"
            onClick={onClose}
          >
            Sign In / Sign Up
          </Link>
        )}
      </nav>
    </div>
  );
};

export default MobileMenu;