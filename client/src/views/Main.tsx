import React, { useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import SidePanel from '@/components/SidePanel';

const Main: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !user) {
        navigate('/login');
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>; // skeletons
  }

  return (
    <div id="main" className='flex w-full h-screen'>
      <SidePanel />
      <div className="hidden lg:flex w-full bg-primary justify-center items-center text-white">
        <p>Put your animation or picture here.</p>
      </div>
    </div>
  );
};

export default Main;
