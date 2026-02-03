/**
 * @fileoverview Main dashboard layout with sidebar navigation
 * @author Enterprise Development Team  
 * @version 1.0.0
 * @compliance ISO/IEC 12207, CMMI Level 3+
 */

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppSidebar } from '@/components/navigation/AppSidebar';
import { TopBar } from '@/components/navigation/TopBar';

/**
 * Props for DashboardLayout component
 */
interface DashboardLayoutProps {
  children?: React.ReactNode;
}

/**
 * Main dashboard layout component
 * 
 * Features:
 * - Responsive sidebar navigation
 * - Top navigation bar with user menu
 * - Content area for routed pages
 * - Collapsible sidebar with mini mode
 * - Enterprise design system integration
 * 
 * @param props - Component props
 * @returns JSX element
 * 
 * @example
 * ```tsx
 * <DashboardLayout>
 *   <DashboardContent />
 * </DashboardLayout>
 * ```
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children
}) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  return <div className="h-screen bg-gradient-subtle antialiased overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 lg:hidden bg-black/50" onClick={() => setSidebarOpen(false)} />}

      <div className="flex h-full">
        {/* Sidebar - Fixed positioning */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <AppSidebar onNavigate={() => setSidebarOpen(false)} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full lg:ml-0">
          {/* Top Navigation Bar - Fixed */}
          <div className="shrink-0">
            <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Page Content - Scrollable */}
            <main className="flex-1 overflow-y-auto bg-background">
              <div className="p-3 sm:p-4 md:p-6 lg:p-8">
                <div className="max-w-full mx-auto w-full">
                  {children || <Outlet />}
                </div>
              </div>
              
              {/* Footer - Inside scrollable area */}
              <footer className="border-t border-border bg-card px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 mt-auto">
                <div className="max-w-full mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2 sm:space-x-4">
                      <span className="font-medium">© 2026 BizConnect</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">Admin Dashboard v1.0</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                      <span className="hidden md:inline">Professional Business Network</span>
                      <span className="hidden md:inline">•</span>
                      <span className="hidden md:inline">Enterprise Ready</span>
                    </div>
                  </div>
                </div>
              </footer>
            </main>
          </div>
        </div>
      </div>
    </div>;
};
export default DashboardLayout;