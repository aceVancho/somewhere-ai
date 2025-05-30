import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/authContext';
import { ThemeProvider } from "./contexts/ThemeProvider"
import { Toaster } from "@/components/ui/toaster"
import { EntryProvider } from './contexts/entryContext';
import AllEntries from './views/AllEntries/AllEntries';
import NewEntry from './views/NewEntry/NewEntry';
import BulkUpload from './views/BulkUpload/BulkUpload';
import Profile from './views/Profile/Profile';
import { Login } from './views/Login/Login';
import Layout from './components/Layout';
import { Skeleton } from './components/ui/skeleton';
import { ResetToken } from './views/Profile/ResetToken';

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center w-full overflow-y-auto">
        <Skeleton className="w-1/2 h-20 my-2" />
        <Skeleton className="w-1/2 h-20 my-2" />
        <Skeleton className="w-1/2 h-20 my-2" />
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App: React.FC = () => { 
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <AuthProvider>
          <Toaster duration={7000} />
          <EntryProvider>
            <Routes>
              <Route path='/' element={<Layout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/all-entries" element={<ProtectedRoute><AllEntries /></ProtectedRoute>} />
                <Route path="/new-entry" element={<ProtectedRoute><NewEntry /></ProtectedRoute>} />
                <Route path="/bulk-upload" element={<ProtectedRoute><BulkUpload /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              </Route>
              <Route path="/reset-token" element={<ResetToken />} />
            </Routes>
          </EntryProvider>
          </AuthProvider>
        </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
