import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { IUser, IAuthContextType } from "../types";

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth needs an AuthProvider");
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('somewhereAIToken');
    if (storedToken) {
      setLoading(true);
      verifyToken(storedToken).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const resetPassword = async (passwordData: ResetPasswordParams) => {
    try {
      const response = await fetch('http://localhost:4001/api/users/resetPassword', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("somewhereAIToken")}`,
        },
        body: JSON.stringify(passwordData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Password Reset Error:', error)
      throw error;
    }
  };
  


  const signUp = async (userData: SignUpParams): Promise<void> => {
    try {
      const response = await fetch("http://localhost:4001/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log('signUp:', { data });
      if (response.ok) {
        localStorage.setItem("somewhereAIToken", data.token);
        setUser(data);
      } else {
        throw new Error(data.message || 'Failed to sign up');
      }
    } catch (error) {
      console.error("Sign Up error:", error);
      throw error;
    }
  };

  const login = async (userData: SignUpParams): Promise<void> => {
    const { email, password } = userData;
  
    try {
      const response = await fetch("http://localhost:4001/api/users/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log('login:', { data });
      if (response.ok) {
        localStorage.setItem("somewhereAIToken", data.token);
        setUser(data.user);
      } else {
        console.error(data.message);
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("There was an error!", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('somewhereAIToken');
    setUser(null);
  };

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('http://localhost:4001/api/users/verifyToken', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('verifyToken:', { data });
      if (response.ok) {
        setUser(data.user);
      } else {
        console.error(data.message);
        localStorage.removeItem('somewhereAIToken');
      }
    } catch (error) {
      console.error('Error validating token:', error);
      localStorage.removeItem('somewhereAIToken');
    }
};

  const verifyUser = async (email: string) => {
    try {
      const response = await fetch('http://localhost:4001/api/users/verifyUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log('verifyUser:', { data });
      if (response.ok) return true 
      else return false
    } catch (error) {
      console.error('Error validating user:', error);
      throw error;
    }
};

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, signUp, resetPassword, isAuthenticated, loading, verifyUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
