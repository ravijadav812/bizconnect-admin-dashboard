import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { DashboardLayout } from "./components/layouts/DashboardLayout";
import TokenManager from "./components/auth/TokenManager";
import LoginPage from "./pages/auth/LoginPage";
import DashboardHome from "./pages/dashboard/DashboardHome";
import UserList from "./pages/dashboard/UserList";
import CreateUser from "./pages/admin/users/CreateUser";
import EditUser from "./pages/admin/users/EditUser";
import UserManagement from "./pages/admin/users/UserManagement";
import ApprovalManagement from "./pages/admin/approvals/ApprovalManagement";
import ApprovalHistory from "./pages/admin/approvals/ApprovalHistory";
import CategoryManagement from "./pages/admin/categories/CategoryManagement";
import AnalyticsDashboard from "./pages/analytics";
import JobLimits from "./pages/settings/JobLimits";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <TokenManager />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardHome />} />
            <Route path="users" element={<UserList />} />
            <Route path="users/new" element={<CreateUser />} />
            <Route path="users/:id/edit" element={<EditUser />} />
            <Route path="approvals" element={<ApprovalManagement />} />
            <Route path="approvals/history" element={<ApprovalHistory />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="job-limits" element={<JobLimits />} />
            <Route path="roles" element={<div className="p-6"><h1 className="text-2xl font-bold">Role Management</h1><p>Role management coming soon...</p></div>} />
            <Route path="reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Reports</h1><p>Reports dashboard coming soon...</p></div>} />
            <Route path="notifications" element={<div className="p-6"><h1 className="text-2xl font-bold">Notifications</h1><p>Notifications center coming soon...</p></div>} />
            <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p>System settings coming soon...</p></div>} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
