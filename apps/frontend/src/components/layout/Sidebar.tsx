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
      className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
        isActive
          ? 'bg-cyber-surface-light text-cyber-cyan border border-cyber-cyan/30 shadow-glow'
          : 'text-cyber-text-muted hover:bg-cyber-surface-hover hover:text-cyber-cyan hover:border-cyber-cyan/20 border border-transparent'
      }`}
    >
      <span className={`text-lg transition-all duration-200 ${isActive ? 'text-glow' : 'group-hover:text-glow'}`}>
        {icon}
      </span>
      {!isCollapsed && (
        <span className={`ml-3 transition-all duration-200 font-medium ${isActive ? 'text-glow-cyan' : ''}`}>
          {label}
        </span>
      )}
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
    <div className={`h-screen bg-cyber-surface border-r border-cyber-cyan/20 flex flex-col transition-all duration-300 relative backdrop-blur-sm ${
      isCollapsed ? 'w-16' : 'w-64'
    } ${className}`}>
      <div className="px-4 py-5 flex items-center justify-between">
        <div className="flex items-center">
          <GraduationCap className="h-8 w-8 text-cyber-cyan text-glow animate-pulse-glow" />
          {!isCollapsed && (
            <h1 className="ml-2 text-xl font-bold text-cyber-text font-cyber text-glow-cyan">
              Sentry Academy
            </h1>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-full text-cyber-text-muted hover:text-cyber-cyan hover:bg-cyber-surface-hover absolute -right-3 top-6 bg-cyber-surface border border-cyber-cyan/30 shadow-neon-cyan transition-all duration-200"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {user && !isCollapsed && (
        <div className="px-4 py-3 mb-4 border-b border-cyber-cyan/20">
          <div className="flex items-center bg-cyber-surface-light rounded-lg p-3 border border-cyber-cyan/20">
            <Avatar
              src={user.avatar}
              alt={user.name}
              fallback={user.name}
              size="md"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-cyber-text font-cyber">{user.name}</p>
              <p className="text-xs text-cyber-text-dim">{user.email}</p>
            </div>
          </div>
        </div>
      )}

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

      <div className="border-t border-cyber-cyan/20 px-2 py-3 space-y-1 bg-cyber-surface-light/50">
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