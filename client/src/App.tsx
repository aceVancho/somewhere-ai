import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './contexts/authContext';
import { WordBankProvider } from './contexts/old/wordBankContext';
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
                <WordBankProvider>
                  <BrowserRouter>
                      <Toaster />
                      {/* <Navbar /> */}
                        <Routes>
                          {/* <Route path="/" element={<HomePage />} /> */}
                          <Route path="/" element={<LoginPage />} />
                          <Route path="/registrationPage" element={<RegistrationPage />} />
                        </Routes>
                  </BrowserRouter>
                </WordBankProvider>
              </AuthProvider>
            </div>
          </ThemeProvider>
  );
};

export default App;
