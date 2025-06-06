import React, { useState } from 'react';
import ModeToggle from '@/components/ModeToggle';
import { useLogo } from '@/components/Logo';
import { LoginForm } from '../views/Login/LoginForm';
import { SignUpForm } from '../views/Login/SignUpForm';

export const AuthPanel: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="w-full lg:w-3/12 flex flex-col items-center p-8 relative h-full">
      <img className="w-8/12 mb-7" src={useLogo()} alt="logo" />
      {isSignUp ? (
        <SignUpForm switchToLogin={() => setIsSignUp(false)} />
      ) : (
        <LoginForm switchToSignUp={() => setIsSignUp(true)} />
      )}
      <div className="bottom-8 w-full flex justify-between">
        <ModeToggle />
      </div>
    </div>
  );
};
