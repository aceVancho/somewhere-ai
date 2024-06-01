import React, { useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import ModeToggle from '@/components/ModeToggle';
import DropdownAvatar from '@/components/DropdownAvatar';

const HomePage: React.FC = () => {
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
    return <div> Loading...</div>; // Or any loading indicator
  }

  return (
    <div id="home-container" className='flex flex-col w-full items-center'>
      Home Page
      <div className="bottom-8 w-full flex justify-between">
            <ModeToggle />
            <DropdownAvatar />
          </div>
    </div>
  );
};

export default HomePage;
