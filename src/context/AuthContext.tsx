
import React, { createContext, useState, useEffect, useContext } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  completePasswordReset: (email: string, token: string, newPassword: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

// For demo purposes, we'll simulate authentication with local storage
const STORAGE_KEY = 'lottery_auth';
const USERS_STORAGE_KEY = 'lottery_users';
const RESET_TOKENS_KEY = 'lottery_reset_tokens';

// Initial mock users that will be merged with any stored users
const INITIAL_MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: '2',
    username: 'user',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
  },
];

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  resetPassword: async () => {},
  completePasswordReset: async () => {},
  loading: false,
  error: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [resetTokens, setResetTokens] = useState<Record<string, { token: string, expires: number }>>({});

  // Initialize users from localStorage or use initial mock users
  useEffect(() => {
    // Load users from local storage
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (storedUsers) {
      try {
        const parsedUsers = JSON.parse(storedUsers);
        setUsers(parsedUsers);
      } catch (e) {
        console.error('Failed to parse users:', e);
        setUsers(INITIAL_MOCK_USERS);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_USERS));
      }
    } else {
      // Initialize with mock users if none exist
      setUsers(INITIAL_MOCK_USERS);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_MOCK_USERS));
    }

    // Load reset tokens
    const storedTokens = localStorage.getItem(RESET_TOKENS_KEY);
    if (storedTokens) {
      try {
        setResetTokens(JSON.parse(storedTokens));
      } catch (e) {
        console.error('Failed to parse reset tokens:', e);
        setResetTokens({});
      }
    }

    // Check for existing auth session
    const storedAuth = localStorage.getItem(STORAGE_KEY);
    if (storedAuth) {
      try {
        const userData = JSON.parse(storedAuth);
        setUser(userData);
      } catch (e) {
        console.error('Failed to parse auth data:', e);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    }
  }, [users]);

  // Save reset tokens whenever they change
  useEffect(() => {
    localStorage.setItem(RESET_TOKENS_KEY, JSON.stringify(resetTokens));
  }, [resetTokens]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Find user from our stored users list
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
        return Promise.resolve();
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Login error:', error);
      throw error; // Rethrow to handle in the component
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists
      if (users.some(u => u.email === email)) {
        throw new Error('User with this email already exists');
      }
      
      // Create new user
      const newUser = {
        id: String(users.length + 1),
        username,
        email,
        role: 'user',
        password
      };
      
      // Update users array
      setUsers(prevUsers => [...prevUsers, newUser]);
      
      return Promise.resolve();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if user exists
      const userExists = users.some(u => u.email === email);
      if (!userExists) {
        throw new Error('No account found with this email address');
      }
      
      // Generate a random token
      const token = Math.random().toString(36).substring(2, 15);
      
      // Store token with expiry (24 hours)
      const expires = Date.now() + 24 * 60 * 60 * 1000;
      setResetTokens(prev => ({
        ...prev,
        [email]: { token, expires }
      }));
      
      // In a real app, we would send an email here
      console.log(`Reset password email sent to ${email} with token: ${token}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return Promise.resolve();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Reset password error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const completePasswordReset = async (email: string, token: string, newPassword: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validate token
      const resetData = resetTokens[email];
      if (!resetData) {
        throw new Error('Invalid or expired reset link');
      }
      
      if (resetData.token !== token) {
        throw new Error('Invalid reset token');
      }
      
      if (resetData.expires < Date.now()) {
        throw new Error('Reset link has expired');
      }
      
      // Update user's password
      const updatedUsers = users.map(user => {
        if (user.email === email) {
          return { ...user, password: newPassword };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      
      // Remove used token
      const { [email]: _, ...remainingTokens } = resetTokens;
      setResetTokens(remainingTokens);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return Promise.resolve();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Complete password reset error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        register,
        logout,
        resetPassword,
        completePasswordReset,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
