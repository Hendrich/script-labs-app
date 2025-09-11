import { useState, useEffect } from "react";
import { authService } from "../services/authService.js";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      //console.log('🔄 useAuth: Attempting login for:', email);
      const response = await authService.login(email, password);
      //console.log('✅ useAuth: Login response:', response);

      if (response.user) {
        //console.log('👤 useAuth: Setting user state:', response.user);
        setUser(response.user);
        //console.log('🔄 useAuth: User state updated, should trigger re-render');
      } else {
        console.error("❌ useAuth: No user in response");
        throw new Error("Login failed: No user data received");
      }

      return response;
    } catch (err) {
      console.error("❌ useAuth: Login failed:", err.message);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(userData);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user, // Make this reactive to user state changes
  };
};
