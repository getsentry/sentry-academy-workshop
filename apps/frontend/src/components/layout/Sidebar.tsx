import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  BookOpen,
  Home,
  Layers,
  Star,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  GraduationCap
} from 'lucide-react';
import { Avatar } from '../ui/Avatar';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isCollapsed?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  to,
  icon,
  label,
  isActive = false,
  isCollapsed = false
}) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
      }`}
    >
      <span className="text-lg">{icon}</span>
      {!isCollapsed && <span className="ml-3 transition-opacity duration-200">{label}</span>}
    </Link>
  );
};

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 relative ${
      isCollapsed ? 'w-16' : 'w-64'
    } ${className}`}>
      <div className="px-4 py-5 flex items-center justify-between">
        <div className="flex items-center">
          <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          {!isCollapsed && (
            <h1 className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
              Sentry Academy
            </h1>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 absolute -right-3 top-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-sm"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
        <SidebarItem
          to="/"
          icon={<Home size={20} />}
          label="Home"
          isActive={isActive('/')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          to="/courses"
          icon={<BookOpen size={20} />}
          label="All Courses"
          isActive={isActive('/courses')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          to="/my-courses"
          icon={<Layers size={20} />}
          label="My Courses"
          isActive={isActive('/my-courses')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          to="/favorites"
          icon={<Star size={20} />}
          label="Favorites"
          isActive={isActive('/favorites')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          to="/lesson-plans"
          icon={<Bookmark size={20} />}
          label="Lesson Plans"
          isActive={isActive('/lesson-plans')}
          isCollapsed={isCollapsed}
        />
      </nav>

      <div className="border-t border-gray-200 dark:border-gray-700 px-2 py-3 space-y-1">
        <SidebarItem
          to="/profile"
          icon={<User size={20} />}
          label="Profile"
          isActive={isActive('/profile')}
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          to="/settings"
          icon={<Settings size={20} />}
          label="Settings"
          isActive={isActive('/settings')}
          isCollapsed={isCollapsed}
        />
      </div>
    </div>
  );
};

export default Sidebar;