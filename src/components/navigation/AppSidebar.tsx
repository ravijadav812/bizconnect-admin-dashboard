/**
 * @fileoverview Application sidebar navigation component
 * @author Enterprise Development Team
 * @version 1.0.0
 * @compliance ISO/IEC 12207, CMMI Level 3+
 */

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  BarChart3,
  Settings
} from 'lucide-react';
import { NavItem } from '@/types';
import { useCurrentUser } from '@/stores/authStore';

/**
 * Navigation menu items configuration - simplified to only essential items
 */
const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard'
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: 'BarChart3'
  },
  {
    title: 'All Users',
    href: '/dashboard/users',
    icon: 'Users'
  },
  {
    title: 'Approvals',
    href: '/dashboard/approvals',
    icon: 'UserCheck'
  },
  {
    title: 'Job Limits',
    href: '/dashboard/job-limits',
    icon: 'Settings'
  }
];

/**
 * Icon mapping for dynamic icon rendering
 */
const iconMap = {
  LayoutDashboard,
  Users,
  UserCheck,
  BarChart3,
  Settings
};

/**
 * Application sidebar component
 * 
 * Features:
 * - Fixed navigation menu
 * - Active route highlighting
 * - Role-based access control
 * - Responsive design
 * - Auto-close on mobile
 * 
 * @returns JSX element
 */
interface AppSidebarProps {
  onNavigate?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ onNavigate }) => {
  const location = useLocation();
  const currentUser = useCurrentUser();

  /**
   * Check if a route is currently active
   */
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  /**
   * Check if user has permission to view menu item
   */
  const hasPermission = (item: NavItem): boolean => {
    if (!item.permission || !currentUser) return true;
    return currentUser.permissions.includes(item.permission);
  };

  /**
   * Render navigation item - mobile responsive with proper highlighting
   */
  const renderNavItem = (item: NavItem) => {
    if (!hasPermission(item)) return null;

    const IconComponent = iconMap[item.icon as keyof typeof iconMap];

    return (
      <NavLink 
        key={item.href}
        to={item.href}
        onClick={onNavigate}
        end={item.href === '/dashboard'}
        className={({ isActive }) => 
          `w-full flex items-center px-3 py-2 sm:py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
            isActive 
              ? 'bg-primary text-primary-foreground shadow-sm' 
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`
        }
        aria-current={isActive(item.href) ? 'page' : undefined}
      >
        <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
        <span className="ml-3 text-sm sm:text-base">
          {item.title}
        </span>
      </NavLink>
    );
  };

  return (
    <div className="w-full sm:w-80 border-r border-border/20 bg-sidebar flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="flex h-14 sm:h-16 items-center border-b border-border/20 px-4 sm:px-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-primary/10 rounded-lg">
            <img 
              src="/lovable-uploads/77133f71-0e4e-4c8e-8f8f-b3bf0fddf8c5.png" 
              alt="BizConnect Logo" 
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-semibold text-foreground">BizConnect</span>
            <span className="text-xs text-muted-foreground">Admin Panel</span>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 sm:py-8 flex-1 overflow-y-auto">
        {/* Main Navigation */}
        <div>
          <div>
            <nav className="space-y-1 sm:space-y-2">
              {navigationItems.map(renderNavItem)}
            </nav>
          </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="border-t border-border/50 p-4 sm:p-6 mt-auto">
        <div className="text-xs text-muted-foreground">
          <div className="font-semibold text-foreground">BizConnect Admin Panel v1.0</div>
          <div className="mt-1">Professional Business Network</div>
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;