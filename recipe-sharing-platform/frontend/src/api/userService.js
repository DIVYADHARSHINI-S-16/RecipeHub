import axiosInstance from "./axiosInstance";

export const getMyProfile = async () => {
  const { data } = await axiosInstance.get("/users/profile");
  return data;
};

export const updateMyProfile = async (payload) => {
  const { data } = await axiosInstance.put("/users/profile", payload);
  return data;
};

export const changeMyPassword = async (payload) => {
  const { data } = await axiosInstance.put("/users/change-password", payload);
  return data;
};

export const getMyRecipes = async () => {
  const { data } = await axiosInstance.get("/recipes/user/my-recipes");
  return data;
};

export const deleteRecipeById = async (id) => {
  const { data } = await axiosInstance.delete(`/recipes/${id}`);
  return data;
};

export const toggleFavoriteRequest = async (recipeId) => {
  const { data } = await axiosInstance.post(`/users/favorites/${recipeId}`);
  return data;
};

export const getFavoritesRequest = async () => {
  const { data } = await axiosInstance.get("/users/favorites");
  return data;
};