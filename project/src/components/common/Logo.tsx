import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LogoProps {
  isLight?: boolean;
}

const Logo: React.FC<LogoProps> = ({ isLight = false }) => {
  const textColor = isLight ? 'text-white' : 'text-primary-800';

  return (
    <Link to="/" className="flex items-center">
      <ShoppingBag size={28} className={`mr-2 ${textColor}`} />
      <span className={`text-xl font-bold ${textColor}`}>FashionStore</span>
    </Link>
  );
};

export default Logo;