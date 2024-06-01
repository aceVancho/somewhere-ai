import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext';
import RegistrationPage from './components/RegistrationPage';
import { ThemeProvider } from "./contexts/ThemeProvider"
import { Toaster } from "@/components/ui/toaster"
import HomePage from './views/HomePage';
import LoginPage from './views/LoginPage';

const App: React.FC = () => { 
  return (
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="flex flex-col">
              <AuthProvider>
                  <BrowserRouter>
                      <Toaster />
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="login" element={<LoginPage />} />
                          <Route path="/registrationPage" element={<RegistrationPage />} />
                        </Routes>
                  </BrowserRouter>
              </AuthProvider>
            </div>
          </ThemeProvider>
  );
};

export default App;
