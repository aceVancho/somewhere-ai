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

  const signUp = async (userData: IUser): Promise<void> => {
    try {
      const response = await fetch("http://localhost:4001/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("somewhereAIToken", data.token);
        setUser({ email: data.email });
      } else {
        throw new Error(data.message || 'Failed to sign up');
      }
    } catch (error) {
      console.error("Sign Up error:", error);
      throw error;
    }
  };

  const login = async (userData: IUser): Promise<void> => {
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
      if (response.ok) {
        localStorage.setItem("somewhereAIToken", data.token);
        setUser({ email: data.user.email });
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
      const response = await fetch('http://localhost:4001/api/users/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log(data);

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

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, signUp, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
