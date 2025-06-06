import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Search, Bell, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { useDebounceCallback } from '../../hooks/useDebounce';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    navigate(`/courses?search=${encodeURIComponent(e.target.value)}`);
  };
  const debouncedSearch = useDebounceCallback(handleSearchChange, 1000);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Handle search navigation
  useEffect(() => {
    // Only proceed if there's a debounced search query different from URL
    const currentParams = new URLSearchParams(location.search);
    const currentSearchParam = currentParams.get('search') || '';
    setSearchQuery(currentSearchParam);

    if (location.pathname === '/courses') {
      const params = new URLSearchParams(location.search);
      params.set('search', currentSearchParam);
      navigate(`/courses?${params.toString()}`, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  return (
    <header className="bg-cyber-surface border-b border-cyber-cyan/20 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center flex-1">
          <div className="md:hidden mr-2">
            <Button
              variant="ghost"
              size="sm"
              aria-label="Menu"
              className="p-1 text-cyber-text hover:bg-cyber-surface-hover"
            >
              <Menu size={24} />
            </Button>
          </div>
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-cyber-cyan" />
            </div>
            <input
              type="search"
              className="block w-full pl-10 pr-3 py-2 bg-cyber-surface border border-cyber-cyan/30 text-cyber-text rounded-lg focus:ring-cyber-cyan focus:border-cyber-cyan focus:bg-cyber-surface-light placeholder-cyber-text-dim transition-all duration-200"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => {
                if (e.target.value.length > 0) {
                  setSearchQuery(e.target.value);
                  debouncedSearch(e);
                } else {
                  navigate(`/courses`);
                }
              }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative text-cyber-text-muted hover:text-cyber-cyan focus:outline-none transition-colors duration-200 group">
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-cyber-pink shadow-neon-pink animate-pulse-glow"></span>
          </button>

          <div className="relative">
            <button
              className="flex items-center space-x-2 text-cyber-text hover:text-cyber-cyan focus:outline-none transition-colors duration-200"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              {user && (
                <Avatar
                  src={user.avatar}
                  alt={user.name}
                  fallback={user.name}
                  size="sm"
                />
              )}
              <span className="hidden md:block text-sm font-medium font-cyber">{user?.name}</span>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-cyber-surface-light rounded-lg shadow-neon-cyan py-1 z-10 border border-cyber-cyan/30 backdrop-blur-sm">
                <a href="/profile" className="block px-4 py-2 text-sm text-cyber-text hover:bg-cyber-surface-hover hover:text-cyber-cyan transition-colors duration-200">
                  Your Profile
                </a>
                <a href="/settings" className="block px-4 py-2 text-sm text-cyber-text hover:bg-cyber-surface-hover hover:text-cyber-cyan transition-colors duration-200">
                  Settings
                </a>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm text-cyber-text hover:bg-cyber-surface-hover hover:text-cyber-pink transition-colors duration-200"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;