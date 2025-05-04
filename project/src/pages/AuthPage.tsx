import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';

const AuthPage = () => {
  const [authType, setAuthType] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();

  const toggleAuthType = () => {
    setAuthType(authType === 'login' ? 'register' : 'login');
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom">
        <div className="mx-auto max-w-md bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                {authType === 'login' ? 'Sign In to Your Account' : 'Create a New Account'}
              </h1>
              <p className="mt-2 text-gray-600">
                {authType === 'login'
                  ? 'Enter your credentials to access your account'
                  : 'Fill in your information to create an account'}
              </p>
            </div>
            
            <AuthForm type={authType} />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {authType === 'login'
                  ? "Don't have an account?"
                  : 'Already have an account?'}{' '}
                <button
                  type="button"
                  className="font-medium text-primary-600 hover:text-primary-500"
                  onClick={toggleAuthType}
                >
                  {authType === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;