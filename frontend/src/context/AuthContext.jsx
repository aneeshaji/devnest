import { createContext, useState, useEffect } from "react";
import { auth as authAPI } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Check if user is logged in and set user state
   * If user is logged in, make a GET request to /api/auth/me
   * If request is successful, set user state to response data
   * If request fails, remove token from local storage and set user state to null
   * Set loading state to false when request is completed
   * @returns {void}
   */
  /*******  db7f8ac2-0d6c-4a53-84a5-51ac72cba26d  *******/ const checkAuth =
    async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await authAPI.getMe();
          setUser(response.data);
        } catch (error) {
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    localStorage.setItem("token", response.data.token);
    setUser(response.data);
    return response.data;
  };

  const register = async (username, email, password) => {
    const response = await authAPI.register({ username, email, password });
    localStorage.setItem("token", response.data.token);
    setUser(response.data);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
