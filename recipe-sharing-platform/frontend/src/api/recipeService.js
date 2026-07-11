import axiosInstance from "./axiosInstance";

export const fetchRecipes = async ({ search = "", category = "All", page = 1, limit = 9 } = {}) => {
  const params = {};

  if (search.trim()) params.search = search.trim();
  if (category && category !== "All") params.category = category;
  params.page = page;
  params.limit = limit;

  const { data } = await axiosInstance.get("/recipes", { params });
  return data;
};

export const fetchRecipeById = async (id) => {
  const { data } = await axiosInstance.get(`/recipes/${id}`);
  return data;
};

export const createRecipeRequest = async (payload) => {
  const { data } = await axiosInstance.post("/recipes", payload);
  return data;
};

export const updateRecipeRequest = async (id, payload) => {
  const { data } = await axiosInstance.put(`/recipes/${id}`, payload);
  return data;
};

export const deleteRecipeRequest = async (id) => {
  const { data } = await axiosInstance.delete(`/recipes/${id}`);
  return data;
};
