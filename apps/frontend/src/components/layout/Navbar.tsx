import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Search, Bell, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useDebounceCallback } from '../../hooks/useDebounce';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Initialize search query from URL on mount and when navigating to different pages
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search') || '';
    setSearchQuery(searchParam);
  }, [location.pathname]); // Only when pathname changes, not on every search update

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    navigate(`/courses?search=${encodeURIComponent(e.target.value)}`);
  };
  const debouncedSearch = useDebounceCallback(handleSearchChange, 1000);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still navigate to login even if logout API call fails
      navigate('/login');
    }
  };

  // BUG: Function to display user settings - assumes consistent data structure from backend
  const getUserSettingsInfo = () => {
    if (!user) return null;
    
    try {
      // BUG: Try to access various settings structures that backend might return inconsistently
      
      // Some users might have 'displaySettings' (from regular login success case)
      const notificationStatus = (user as any).displaySettings?.showNotifications;
      
      // Others might have 'notificationSettings' (from backend data processing errors)
      const altNotificationStatus = (user as any).notificationSettings;
      
      // BUG: Assume privacy level exists in a specific nested structure
      const privacyLevel = (user as any).displaySettings?.privacyLevel || 
                          (user as any).settings?.privacy?.level || 
                          'unknown';
      
      return {
        notifications: notificationStatus ?? altNotificationStatus ?? false,
        privacy: privacyLevel,
        // BUG: Try to access theme from different possible locations
        theme: (user as any).theme || (user as any).preferences?.theme || 'light'
      };
    } catch (error) {
      console.error('Error accessing user settings:', error);
      return {
        notifications: false,
        privacy: 'unknown',
        theme: 'light'
      };
    }
  };

  // BUG: Function to get user's last login info with assumptions about backend data
  const getLastLoginInfo = () => {
    try {
      // BUG: Backend might return different property names for last login
      const lastLogin = (user as any)?.lastLoginDate || 
                       (user as any)?.lastLoginTimestamp ||
                       (user as any)?.metadata?.lastLogin;
      
      if (lastLogin) {
        return new Date(lastLogin).toLocaleDateString();
      }
      
      // BUG: For SSO users, try to get login info from OAuth data
      if ((user as any)?.authProvider) {
        const oauthLastLogin = (user as any)?.oauthTokens?.issuedAt;
        if (oauthLastLogin) {
          return `via ${(user as any).authProvider} - ${new Date(oauthLastLogin).toLocaleDateString()}`;
        }
      }
      
      return 'Recently';
    } catch (error) {
      console.error('Error getting last login info:', error);
      return 'Unknown';
    }
  };

  // BUG: Function to get social profile info for SSO users
  const getSocialProfileInfo = () => {
    try {
      // BUG: SSO users should have social profile data, but backend structure is inconsistent
      if ((user as any)?.authProvider) {
        const socialProfile = (user as any)?.socialProfile;
        
        if (socialProfile) {
          return {
            verified: socialProfile.verified,
            // BUG: Try different property names for profile image
            avatar: socialProfile.profileImage || socialProfile.avatar,
            provider: (user as any).authProvider
          };
        }
        
        // BUG: Fallback to accessing social data from different structure
        const provider = (user as any).authProvider;
        const socialData = (user as any)?.social?.[provider];
        
        if (socialData) {
          return {
            verified: socialData.verified,
            avatar: socialData.avatar,
            provider: provider
          };
        }
      }
      
      // BUG: For regular login, try to access social avatars array
      const socialAvatars = (user as any)?.socialAvatars;
      if (socialAvatars && socialAvatars.length > 0) {
        return {
          verified: socialAvatars[0].verified,
          avatar: socialAvatars[0].avatar,
          provider: socialAvatars[0].provider
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting social profile info:', error);
      return null;
    }
  };

  const userSettings = getUserSettingsInfo();
  const lastLoginInfo = getLastLoginInfo();
  const socialInfo = getSocialProfileInfo();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 max-w-lg">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400"
              defaultValue={searchQuery}
              onChange={debouncedSearch}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          
          <button className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors">
            <Bell size={20} />
            {/* BUG: Show notification indicator based on user settings */}
            {userSettings?.notifications && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Avatar
                src={user?.avatar || socialInfo?.avatar}
                alt={user?.name || 'User'}
                fallback={user?.name || 'U'}
                size="sm"
              />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {/* BUG: Show auth provider info for SSO users */}
                  {(user as any)?.authProvider ? `via ${(user as any).authProvider}` : user?.role}
                  {/* BUG: Show verification status from social profile */}
                  {socialInfo?.verified && (
                    <span className="ml-1 text-green-500">✓</span>
                  )}
                </p>
              </div>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                {/* BUG: Display user info with assumptions about data structure */}
                <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  <div>Last login: {lastLoginInfo}</div>
                  {/* BUG: Show privacy level from settings */}
                  <div>Privacy: {userSettings?.privacy}</div>
                  {/* BUG: Show profile completeness for users with missing data */}
                  {(user as any)?.profileIncomplete && (
                    <div className="text-amber-600 dark:text-amber-400 mt-1">⚠ Profile incomplete</div>
                  )}
                  {/* BUG: Show SSO warnings if they exist */}
                  {(user as any)?.ssoIncomplete && (
                    <div className="text-amber-600 dark:text-amber-400 mt-1">⚠ Social data limited</div>
                  )}
                </div>
                
                <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Your Profile
                  {/* BUG: Show social profile indicator */}
                  {socialInfo && (
                    <span className="float-right text-xs text-blue-500 dark:text-blue-400">
                      {socialInfo.provider}
                    </span>
                  )}
                </a>
                
                <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Settings
                  {/* BUG: Show settings info that might be missing */}
                  <span className="float-right text-xs text-gray-400">
                    ({userSettings?.privacy || 'N/A'})
                  </span>
                </a>
                
                {/* BUG: Show missing data warnings if they exist */}
                {(user as any)?.missingData && (
                  <div className="px-4 py-2 text-xs text-amber-600 dark:text-amber-400 border-t border-gray-200 dark:border-gray-700">
                    <div>⚠ Some data unavailable:</div>
                    {(user as any).missingData.slice(0, 2).map((warning: string, index: number) => (
                      <div key={index} className="truncate">• {warning}</div>
                    ))}
                  </div>
                )}
                
                {/* BUG: Show SSO specific warnings */}
                {(user as any)?.ssoWarnings && (
                  <div className="px-4 py-2 text-xs text-amber-600 dark:text-amber-400 border-t border-gray-200 dark:border-gray-700">
                    <div>⚠ {(user as any).authProvider} Issues:</div>
                    {(user as any).ssoWarnings.slice(0, 2).map((warning: string, index: number) => (
                      <div key={index} className="truncate">• {warning}</div>
                    ))}
                  </div>
                )}
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-t border-gray-200 dark:border-gray-700"
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