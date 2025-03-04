
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from '@/providers/AuthProvider';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import Employees from '@/pages/Employees';
import Attendance from '@/pages/Attendance';
import Projects from '@/pages/Projects';
import Settings from '@/pages/Settings';
import UserManagement from '@/pages/UserManagement';
import AdminSignup from '@/pages/AdminSignup';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="archipeople-theme">
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-signup" element={<AdminSignup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
