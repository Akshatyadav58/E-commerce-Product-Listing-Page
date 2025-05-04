import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import SearchBar from '../common/SearchBar';
import MobileMenu from './MobileMenu';
import Logo from '../common/Logo';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const { cartItems } = useCart();

  const isHomePage = location.pathname === '/';
  const headerClass = isHomePage && !isScrolled && !isMobileMenuOpen
    ? 'bg-transparent text-white'
    : 'bg-white text-text-primary shadow-sm';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`${headerClass} fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
    >
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              className="mr-4 lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Logo isLight={isHomePage && !isScrolled && !isMobileMenuOpen} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <Link to="/" className="font-medium hover:text-primary-700">Home</Link>
            <Link to="/products" className="font-medium hover:text-primary-700">Products</Link>
            <Link to="/products?category=men" className="font-medium hover:text-primary-700">Men</Link>
            <Link to="/products?category=women" className="font-medium hover:text-primary-700">Women</Link>
            <Link to="/products?category=jewelry" className="font-medium hover:text-primary-700">Jewelry</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            
            <Link to={isAuthenticated ? "/profile/wishlist" : "/auth"} className="p-2 rounded-full hover:bg-gray-100" aria-label="Wishlist">
              <Heart size={20} />
            </Link>
            
            <Link to="/cart" className="p-2 rounded-full hover:bg-gray-100 relative" aria-label="Cart">
              <ShoppingBag size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            
            <Link to={isAuthenticated ? "/profile" : "/auth"} className="p-2 rounded-full hover:bg-gray-100" aria-label="Account">
              <User size={20} />
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && <MobileMenu onClose={() => setIsMobileMenuOpen(false)} />}
        
        {/* Search Bar */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-md p-4 animate-slide-up">
            <SearchBar onClose={() => setIsSearchOpen(false)} />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;