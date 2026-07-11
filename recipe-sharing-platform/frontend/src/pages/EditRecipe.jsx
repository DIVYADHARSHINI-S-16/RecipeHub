import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/common/Loader";
import RecipeForm from "../components/recipe/RecipeForm";
import { fetchRecipeById, updateRecipeRequest } from "../api/recipeService";
import useAuth from "../hooks/useAuth";

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notAllowed, setNotAllowed] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchRecipeById(id);

        if (data.author._id !== user._id) {
          setNotAllowed(true);
          return;
        }

        setRecipe(data);
      } catch (error) {
        toast.error("Recipe not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      await updateRecipeRequest(id, payload);
      toast.success("Recipe updated!");
      navigate(`/recipes/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update recipe");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  if (notAllowed) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-4xl mb-3">🚫</p>
        <p className="text-gray-600 dark:text-gray-300 font-medium">You're not authorized to edit this recipe.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">Edit Recipe ✏️</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Update your recipe details below</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 sm:p-8">
        <RecipeForm
          initialData={recipe}
          onSubmit={handleSubmit}
          loading={saving}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
};

export default EditRecipe;
