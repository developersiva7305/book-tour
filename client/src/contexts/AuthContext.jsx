import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem('tourAppUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Email validation regex
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const login = (email, password) => {
    const storedUser = JSON.parse(localStorage.getItem('tourAppUser'));

    if (!storedUser) {
      setUser(storedUser)
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'User not found. Please register first.',
      });
      return false;
    }
    if (email && password) {
      const mockUser = storedUser;
      localStorage.setItem('tourAppUser', JSON.stringify(mockUser));
      setUser(mockUser);
      toast({ title: 'Login Successful!', description: `Welcome back, ${mockUser.fullName}!` });
      navigate('/');
      return true;
    }
    toast({
      variant: 'destructive',
      title: 'Login Failed',
      description: 'Invalid email or password.',
    });
    return false;
  };

  const register = (fullName, email, password, phone) => {
    const storedUser = JSON.parse(localStorage.getItem('tourAppUser'));

    if (storedUser && storedUser.email === email) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: 'This email is already registered. Please login.',
      });
      return false;
    }

    if (!isValidEmail(email)) {
      toast({
        variant: 'destructive',
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
      });
      return false;
    }

    if (fullName && email && password && phone) {
      const newUser = { fullName, email, password, phone, id: Date.now().toString() };
      localStorage.setItem('tourAppUser', JSON.stringify(newUser));
      setUser(newUser);
      toast({
        title: 'Registration Successful!',
        description: `Welcome, ${newUser.fullName}!`
      });
      navigate('/');
      return true;
    }

    toast({
      variant: 'destructive',
      title: 'Registration Failed',
      description: 'Please fill all fields.',
    });
    return false;
  };

  const resetPassword = (email, Password) => {
    const storedUser = JSON.parse(localStorage.getItem('tourAppUser'));

    if ((Password)) {
      toast({
        variant: 'destructive',
        title: 'Weak Password',
        description:
          'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.',
      });
      return false;
    }

    if (storedUser && storedUser.email === email) {
      const updatedUser = { ...storedUser, password: newPassword };
      localStorage.setItem('tourAppUser', JSON.stringify(updatedUser));
      toast({
        title: 'Password Reset Successful',
        description: 'You can now login with your new password.',
      });
      navigate('/login');
      return true;
    }

    toast({
      variant: 'destructive',
      title: 'Reset Failed',
      description: 'Email not found.',
    });
    return false;
  };

  const logout = () => {
    localStorage.removeItem('tourAppUser');
    setUser(null);
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);