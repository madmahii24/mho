import { useEffect, useState } from 'react';

import { LOCAL_CUSTINFO_KEY, LOCAL_TOKEN_KEY } from '@/utils/constants';

// Custom event name for auth state changes
export const AUTH_CHANGE_EVENT = 'auth-state-change';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem(LOCAL_TOKEN_KEY);
      const user = localStorage.getItem(LOCAL_CUSTINFO_KEY);
      setIsAuthenticated(!!(token && user));
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
    }
  };
  
  const getCustInfo = () => {
    try {
      const user = localStorage.getItem(LOCAL_CUSTINFO_KEY);
      return JSON.parse(user || '{}');
    } catch (error) {
      console.error("Error parsing customer info:", error);
      return {};
    }
  }
  
  useEffect(() => {
    // Initial check
    checkAuthStatus();
    
    // Listen for auth change events
    const handleAuthChange = () => checkAuthStatus();
    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    };
  }, []);

  // Function to login user
  const login = () => {
    // Use CustomEvent instead of Event
    const authEvent = new CustomEvent(AUTH_CHANGE_EVENT);
    window.dispatchEvent(authEvent)
    setTimeout(() => {
      window.location.href = '/'; // Or any default landing page
    }, 100);
  };

  // Function to logout user
  const logout = () => {
    try {
      // Clear auth data from localStorage
      localStorage.removeItem(LOCAL_TOKEN_KEY);
      localStorage.removeItem(LOCAL_CUSTINFO_KEY);
      
      // Update state directly
      setIsAuthenticated(false);
      
      // Force a page refresh after a short delay to ensure clean state
      setTimeout(() => {
        window.location.href = '/login'; // Or any default landing page
      }, 100);
      
      // Set a timeout safety mechanism - if after 2 seconds page hasn't refreshed, force it
      const safetyTimeout = setTimeout(() => {
        window.location.reload();
      }, 2000);
      
      // Clean up the safety timeout if the page does refresh properly
      window.addEventListener('beforeunload', () => {
        clearTimeout(safetyTimeout);
      }, { once: true });
      
    } catch (error) {
      console.error("Error during logout:", error);
      // Last resort - force reload
      window.location.reload();
    }
  };

  return { isAuthenticated, login, logout, setIsAuthenticated, getCustInfo };
};
