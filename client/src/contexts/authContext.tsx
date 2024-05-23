import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { IUser, IAuthContextType } from "../types";
import axios from "axios";

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

  useEffect(() => {
    const storedToken = localStorage.getItem('lexiconAIToken')
    if (storedToken) verifyToken(storedToken)
  }, [])

  // sign up
  const signUp = async (userData: IUser) => {
    const email = userData.email;
    const password = userData.password;

    try {
      const response = await fetch("http://localhost:4001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {

        localStorage.setItem("lexiconAIToken", data.token);
        setUser(data.user);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  // login
  const login = async (userData: IUser) => {
    const email = userData.email;
    const password = userData.password;
  
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch("http://localhost:4001/api/auth/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
        if (response.ok) {
          localStorage.setItem("lexiconAIToken", data.token);
          setUser({ email: data.user.email });
          resolve(true);
        } else {
          console.error(data.message);
          reject(data.message);
        }
      } catch (error) {
        console.error("There was an error!", error);
        reject(error);
      }
    });
  };

  // log out
  const logout = () => {
    localStorage.removeItem('lexiconAIToken');
    setUser(null);
  };

  // Verify Token
  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('http://localhost:4001/api/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
      } else {
        console.error(data.message);
        localStorage.removeItem('lexiconAIToken');
      }
    } catch (error) {
      console.error('Error validating token:', error);
    }
  }

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{ user, login, logout, signUp, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
