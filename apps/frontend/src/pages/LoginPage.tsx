import React from 'react';
import { Navigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';
import { ThemeToggle } from '../components/ui/ThemeToggle';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle size="lg" />
      </div>
      
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left side - form */}
        <div className="w-full lg:w-1/2 p-8 flex items-center justify-center bg-white dark:bg-gray-800">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-8">
              <div className="flex items-center">
                <GraduationCap className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                <h1 className="ml-2 text-2xl font-bold text-gray-900 dark:text-white">
                  Sentry Academy
                </h1>
              </div>
            </div>

            <LoginForm />
          </div>
        </div>

        {/* Right side - image and copy */}
        <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 dark:from-purple-950 dark:via-purple-900 dark:to-purple-800 text-white">
          <div className="h-full flex items-center justify-center">
            <div className="p-16 text-center">
              <h1 className="text-7xl font-black mb-4 text-white" style={{ fontFamily: 'Rubik, sans-serif' }}>
                Code <span className="inline-block transition-transform duration-300 hover:-rotate-12 hover:translate-y-1">Breaks</span>,
              </h1>
              <h1 className="text-7xl font-black mb-6 text-white" style={{ fontFamily: 'Rubik, sans-serif' }}>
                Learn how to fix it faster
              </h1>
              
              <h2 className="text-2xl font-semibold text-purple-100 dark:text-purple-200 mb-8 max-w-md mx-auto leading-relaxed">
                Learn the 'not bad' way to monitor your applications at Sentry Academy
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;