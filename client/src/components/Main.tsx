import React from 'react';
import { useAuth } from '../contexts/authContext';
import NavPanel from '@/components/NavPanel';
import { MainContainer } from './MainContainer';
import { ContainerProvider } from '../contexts/containerContext';
import { AuthPanel } from './AuthPanel';

const Main: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const MainSidePanel = () => !isAuthenticated ? <AuthPanel /> : <NavPanel />

  return (
    <ContainerProvider>
      <div id="main" className='flex flex-col lg:flex-row w-full h-screen'>
        <MainSidePanel />
        <div className="flex-1">
          <MainContainer />
        </div>
      </div>
    </ContainerProvider>
  );
};

export default Main;
