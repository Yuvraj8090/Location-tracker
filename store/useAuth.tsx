import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { CURRENT_USER } from '../constants/data';

interface AuthState {
  isLoggedIn: boolean;
  user: typeof CURRENT_USER | null;
  login: (empId: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

/**
 * AuthProvider handles the global authentication state.
 * Architecture Note: For production, migrate this to Zustand or Redux 
 * if the state tree grows to include permissions, tokens, or offline sync.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<typeof CURRENT_USER | null>(null);

  const login = useCallback(async (empId: string, _password: string): Promise<boolean> => {
    // Simulated API Latency
    return new Promise((resolve) => {
      setTimeout(() => {
        if (empId.trim().length > 0) {
          setUser(CURRENT_USER);
          setIsLoggedIn(true);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1600);
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  // Memoize value to prevent unnecessary re-renders of all consumers
  const value = useMemo(() => ({
    isLoggedIn,
    user,
    login,
    logout
  }), [isLoggedIn, user, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
}