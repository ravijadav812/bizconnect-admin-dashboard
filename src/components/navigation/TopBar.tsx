/**
 * @fileoverview Top navigation bar with user menu and notifications
 * @author Enterprise Development Team
 * @version 1.0.0
 * @compliance ISO/IEC 12207, CMMI Level 3+
 */

import React from 'react';
import { Bell, Search, Settings, LogOut, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuthStore, useCurrentUser } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';

/**
 * Props for TopBar component
 */
interface TopBarProps {
  onMenuClick?: () => void;
}

/**
 * Top navigation bar component
 * 
 * Features:
 * - Global search functionality
 * - Notification bell with badge
 * - User profile dropdown menu
 * - Mobile responsive design
 * - Logout functionality
 * 
 * @returns JSX element
 */
export const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const currentUser = useCurrentUser();

  /**
   * Handle user logout
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /**
   * Handle profile navigation
   */
  const handleProfile = () => {
    navigate('/dashboard/profile');
  };

  /**
   * Handle settings navigation
   */
  const handleSettings = () => {
    navigate('/dashboard/settings');
  };

  /**
   * Get user initials for avatar fallback
   */
  const getUserInitials = (): string => {
    if (!currentUser) return 'U';
    return `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`;
  };

  /**
   * Get user display name
   */
  const getUserDisplayName = (): string => {
    if (!currentUser) return 'User';
    return `${currentUser.firstName} ${currentUser.lastName}`;
  };

  return (
    <header className="flex h-14 sm:h-16 items-center border-b border-border bg-card/95 backdrop-blur-md px-3 sm:px-4 lg:px-6 z-30">
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-accent/80 transition-colors duration-200"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-6 flex flex-col justify-center space-y-1">
            <span className="block w-full h-0.5 bg-foreground"></span>
            <span className="block w-full h-0.5 bg-foreground"></span>
            <span className="block w-full h-0.5 bg-foreground"></span>
          </div>
        </button>

        {/* Mobile Logo - visible on small screens */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-lg">
            <img 
              src="/lovable-uploads/77133f71-0e4e-4c8e-8f8f-b3bf0fddf8c5.png" 
              alt="BizConnect Logo" 
              className="w-5 h-5 object-contain"
            />
          </div>
          <span className="text-lg font-semibold text-foreground hidden sm:inline">BizConnect</span>
        </div>

        {/* Global Search */}
        <div className="relative flex-1 max-w-xs sm:max-w-md lg:max-w-lg">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10 pr-4 text-sm bg-background/50 border-border/50 focus:bg-background focus:border-primary/50 h-9 sm:h-10"
            aria-label="Global search"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative shrink-0 rounded-lg hover:bg-accent/80 h-9 w-9 sm:h-10 sm:w-10">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 text-xs flex items-center justify-center shadow-sm"
          >
            3
          </Badge>
          <span className="sr-only">View notifications</span>
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 shrink-0 h-10 sm:h-12 px-2 sm:px-3 rounded-lg hover:bg-accent/80">
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8 ring-2 ring-primary/10">
                <AvatarImage src={currentUser?.avatar} alt={getUserDisplayName()} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xs sm:text-sm font-semibold">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-semibold">{getUserDisplayName()}</span>
                <span className="text-xs text-muted-foreground capitalize font-medium">
                  {currentUser?.role || 'User'}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 sm:w-64 shadow-lg border-border/50">
            <DropdownMenuLabel className="pb-2 sm:pb-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10 ring-2 ring-primary/10">
                  <AvatarImage src={currentUser?.avatar} alt={getUserDisplayName()} />
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold text-sm">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none">{getUserDisplayName()}</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {currentUser?.email}
                  </p>
                  <p className="text-xs leading-none text-primary font-medium capitalize">
                    {currentUser?.role || 'User'}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfile} className="cursor-pointer py-3 focus:bg-accent/80">
              <User className="mr-3 h-4 w-4" />
              <span className="font-medium">Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettings} className="cursor-pointer py-3 focus:bg-accent/80">
              <Settings className="mr-3 h-4 w-4" />
              <span className="font-medium">System Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="cursor-pointer py-3 text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span className="font-medium">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopBar;