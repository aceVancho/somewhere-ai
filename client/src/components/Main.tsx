import React from 'react';
import { useAuth } from '../contexts/authContext';
import LoginPanel from './LoginPanel';
import NavPanel from '@/components/NavPanel';
import { MainContainer } from './MainContainer';
import { ContainerProvider } from '../contexts/containerContext';

const Main: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const MainSidePanel = () => !isAuthenticated ? <LoginPanel /> : <NavPanel />

  return (
    <ContainerProvider>
      <div id="main" className='flex w-full h-screen'>
        <MainSidePanel />
        <MainContainer />
      </div>
    </ContainerProvider>
  );
};

export default Main;
