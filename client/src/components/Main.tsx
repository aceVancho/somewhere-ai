import React from 'react';
import { useAuth } from '../contexts/authContext';
import LoginPanel from './LoginPanel';
import NavPanel from '@/components/NavPanel';

const Main: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div id="main" className='flex w-full h-screen'>
      {!isAuthenticated ? <LoginPanel /> : <NavPanel />}
      <div className="hidden lg:flex w-full bg-primary justify-center items-center text-white">
        <p>Put your animation or picture here.</p>
      </div>
    </div>
  );
};

export default Main;
