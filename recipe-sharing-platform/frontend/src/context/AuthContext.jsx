import { createContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import { toggleFavoriteRequest } from "../api/userService";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.favorites) {
        setFavorites(parsedUser.favorites);
      }
    }
    setLoading(false);
  }, []);

  const register = async (formData) => {
    const { data } = await axiosInstance.post("/auth/register", formData);
    saveUserSession(data);
    toast.success(`Welcome, ${data.name}!`);
    return data;
  };

  const login = async (formData) => {
    const { data } = await axiosInstance.post("/auth/login", formData);
    saveUserSession(data);
    toast.success(`Welcome back, ${data.name}!`);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setFavorites([]);
    toast.success("Logged out successfully");
  };

  const saveUserSession = (data) => {
    const { token, ...userData } = data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    if (userData.favorites) {
      setFavorites(userData.favorites);
    }
  };

  const toggleFavorite = async (recipeId) => {
    try {
      const data = await toggleFavoriteRequest(recipeId);
      setFavorites(data.favorites);
      toast.success(data.isFavorited ? "Added to favorites" : "Removed from favorites");
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  const isFavorited = (recipeId) => favorites.some((id) => id.toString() === recipeId);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!user,
        favorites,
        toggleFavorite,
        isFavorited,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};