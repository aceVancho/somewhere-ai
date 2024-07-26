import { useAuth } from "@/contexts/authContext";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const CountdownRedirect: React.FC = () => {
  const [countdown, setCountdown] = useState(5);
  const { logout, isAuthenticated } = useAuth()
  const navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount === 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      if (isAuthenticated) logout()
      navigate("/login");
    }
  }, [countdown, navigate]);

  return (
    <div className="h-1/2 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <h2 className="font-medium text-xl text-muted-foreground mb-3">
          Logging you out and redirecting in {countdown}
        </h2>
        <div className="spinner flex gap-1">
          <div className="rect1"></div>
          <div className="rect2"></div>
          <div className="rect3"></div>
          <div className="rect4"></div>
          <div className="rect5"></div>
        </div>
      </div>
    </div>
  );
};
