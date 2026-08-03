import { createContext, useContext, useState, type ReactNode } from 'react';
import { getLocalStorage, type User } from '../data/localStorage';

/**
 * Fake login for practice.
 * currentUser is null until login succeeds with a matching user from localStorage.
 */
const AuthContext = createContext<{
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
} | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  function login(username: string, password: string): boolean {
    const users = getLocalStorage();
    const user = users.find(
      (storedUser) => storedUser.email === username && storedUser.password === password,
    );

    // Expected user mistake — return false so the UI can show a message.
    // Reserve throw for programming mistakes (e.g. useAuth outside AuthProvider).
    if (!user) {
      return false;
    }

    setCurrentUser(user);
    return true;
  }

  function logout() {
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
