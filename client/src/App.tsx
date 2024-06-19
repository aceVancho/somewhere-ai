import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/authContext';
import { ThemeProvider } from "./contexts/ThemeProvider"
import { Toaster } from "@/components/ui/toaster"
import Main from './components/Main';
import { EntryProvider } from './contexts/entryContext';

const App: React.FC = () => { 
  return (
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
              <AuthProvider>
                  <BrowserRouter>
                      <Toaster />
                          <EntryProvider>
                            <Routes>
                              <Route path="/" element={<Main />} />
                              <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                          </EntryProvider>
                  </BrowserRouter>
              </AuthProvider>
          </ThemeProvider>
  );
};

export default App;
