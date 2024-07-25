
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from "@/components/ui/button"


export const ResetToken = () => {
    const [searchParams] = useSearchParams();

    useEffect(() => {
      const passwordResetToken = searchParams.get('passwordResetToken');
      if (passwordResetToken) {
        localStorage.setItem('passwordResetToken', passwordResetToken);
        window.open('https://www.github.com')

      }
    }, [searchParams]);

    return (
      <div className="flex flex-col h-2/5 justify-center items-center">
        <h1 className='text-3xl font-extrabold mb-2'>Welcome back.</h1>
        <h1 className='leading-7'>Your password reset request was successful.</h1>
        <h1 className='leading-7 text-primary font-medium'>You may close this tab now.</h1>
      </div>
      )
}