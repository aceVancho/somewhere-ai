import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/authContext';
import { ThemeProvider } from "./contexts/ThemeProvider"
import { Toaster } from "@/components/ui/toaster"
import { EntryProvider } from './contexts/entryContext';
import AllEntries from './views/AllEntries/AllEntries';
import NewEntry from './views/NewEntry/NewEntry';
import Profile from './views/Profile/Profile';
import { Login } from './components/Login';
import Layout from './components/Layout';

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App: React.FC = () => { 
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <BrowserRouter>
          <Toaster />
          <EntryProvider>
            <Routes>
              <Route path='/' element={<Layout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/all-entries" element={<ProtectedRoute><AllEntries /></ProtectedRoute>} />
                <Route path="/new-entry" element={<ProtectedRoute><NewEntry /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
              </Route>
            </Routes>
          </EntryProvider>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
