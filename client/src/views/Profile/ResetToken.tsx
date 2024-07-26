import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from "@/contexts/authContext";
import { PasswordResetForm } from "./PasswordResetForm";
import { CountdownRedirect } from "./CountdownRedirect";

export const ResetToken: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { resetPassword } = useAuth();
    const [passwordResetToken, setPasswordResetToken] = useState<null | string>(null);
    const [email, setEmail] = useState('');
    const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);

    useEffect(() => {
      const passwordResetTokenParam = searchParams.get('passwordResetToken');
      if (passwordResetTokenParam) setPasswordResetToken(passwordResetTokenParam);

      const emailParam = searchParams.get('email');
      if (emailParam) {
        setEmail(emailParam.trim());
      }
    }, [searchParams]);

    return (
      <div className="flex flex-col h-screen justify-evenly items-center">
        {passwordResetSuccess ? (
          <CountdownRedirect />
        ) : (
          <PasswordResetForm
            email={email}
            token={passwordResetToken || ""}
            resetPassword={resetPassword}
            onSuccess={() => setPasswordResetSuccess(true)}
          />
        )}
      </div>
    );
};
