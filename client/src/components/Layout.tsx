import React from 'react';
import { Outlet } from 'react-router-dom';
import NavPanel from './NavPanel'; // Adjust the import path as necessary
import { useAuth } from '@/contexts/authContext';
import { AuthPanel } from './AuthPanel';

const Layout: React.FC = () => {
    const { isAuthenticated } = useAuth()
    const SidePanel = () => !isAuthenticated ? <AuthPanel /> : <NavPanel />

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen">
      <SidePanel />
      <div className="h-screen flex flex-col items-center w-full overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
