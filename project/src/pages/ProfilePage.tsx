import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, ShoppingBag, Heart, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('account');

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
          <User size={48} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Sign In Required</h1>
          <p className="text-gray-600 mb-6">
            You need to be signed in to view your profile.
          </p>
          <Button as={Link} to="/auth" variant="primary">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'account', label: 'Account', icon: <User size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={20} /> },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="bg-primary-800 text-white p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <div className="bg-white rounded-full h-20 w-20 flex items-center justify-center text-primary-800 text-2xl font-bold mb-4 sm:mb-0 sm:mr-6">
                {user.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-primary-200">{user.email}</p>
              </div>
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="md:w-64 border-r border-gray-200">
              <nav className="p-4">
                <ul className="space-y-1">
                  {tabs.map((tab) => (
                    <li key={tab.id}>
                      <button
                        className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <span className="mr-3">{tab.icon}</span>
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    </li>
                  ))}
                  
                  <li className="pt-4 mt-4 border-t border-gray-200">
                    <button
                      className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={logout}
                    >
                      <LogOut size={20} className="mr-3" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
            
            {/* Content */}
            <div className="flex-1 p-6">
              {activeTab === 'account' && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Account Information</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Full Name</h3>
                      <p className="text-base font-medium">{user.name}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Email Address</h3>
                      <p className="text-base font-medium">{user.email}</p>
                    </div>
                    
                    <div className="pt-4">
                      <Button variant="outline" size="sm">
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Order History</h2>
                  
                  <div className="text-center py-12">
                    <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-6">
                      When you place orders, they will appear here.
                    </p>
                    <Button as={Link} to="/products" variant="primary">
                      Start Shopping
                    </Button>
                  </div>
                </div>
              )}
              
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-xl font-bold mb-6">My Wishlist</h2>
                  
                  <div className="text-center py-12">
                    <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-500 mb-6">
                      Save items you love to your wishlist and they will show up here.
                    </p>
                    <Button as={Link} to="/products" variant="primary">
                      Explore Products
                    </Button>
                  </div>
                </div>
              )}
              
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Account Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Password</h3>
                      <Button variant="outline" size="sm">
                        Change Password
                      </Button>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="font-medium mb-3">Notification Preferences</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            id="email-notifications"
                            type="checkbox"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            defaultChecked
                          />
                          <label htmlFor="email-notifications" className="ml-2 text-gray-700">
                            Email notifications
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="marketing-emails"
                            type="checkbox"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            defaultChecked
                          />
                          <label htmlFor="marketing-emails" className="ml-2 text-gray-700">
                            Marketing emails
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="font-medium mb-3 text-red-600">Danger Zone</h3>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;