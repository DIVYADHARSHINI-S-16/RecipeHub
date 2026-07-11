import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import RecipeForm from "../components/recipe/RecipeForm";
import { createRecipeRequest } from "../api/recipeService";

const CreateRecipe = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (payload) => {
    setLoading(true);
    try {
      const recipe = await createRecipeRequest(payload);
      toast.success("Recipe published!");
      navigate(`/recipes/${recipe._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create recipe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">Share a New Recipe 🍳</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Fill in the details below to publish your recipe</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 sm:p-8">
        <RecipeForm onSubmit={handleSubmit} loading={loading} submitLabel="Publish Recipe" />
      </div>
    </div>
  );
};

export default CreateRecipe;
