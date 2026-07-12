import axiosInstance from "./axiosInstance";

export const getReviewsForRecipe = async (recipeId) => {
  const { data } = await axiosInstance.get(`/reviews/${recipeId}`);
  return data;
};

export const submitReview = async (recipeId, payload) => {
  const { data } = await axiosInstance.post(`/reviews/${recipeId}`, payload);
  return data;
};

export const deleteReviewRequest = async (reviewId) => {
  const { data } = await axiosInstance.delete(`/reviews/${reviewId}`);
  return data;
};