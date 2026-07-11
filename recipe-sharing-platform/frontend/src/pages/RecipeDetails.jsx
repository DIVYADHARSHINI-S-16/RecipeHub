import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiClock, FiUser, FiEdit2, FiTrash2, FiArrowLeft, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";
import Loader from "../components/common/Loader";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { fetchRecipeById, deleteRecipeRequest } from "../api/recipeService";
import useAuth from "../hooks/useAuth";

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fallbackImage =
    "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1200&auto=format&fit=crop&q=60";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchRecipeById(id);
        setRecipe(data);
      } catch (error) {
        toast.error("Recipe not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteRecipeRequest(id);
      toast.success("Recipe deleted");
      navigate("/profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete recipe");
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  if (loading) return <Loader />;
  if (!recipe) return null;

  const isOwner = isAuthenticated && user?._id === recipe.author?._id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 mb-6 transition"
      >
        <FiArrowLeft /> Back
      </button>

      <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden mb-6">
        <img
          src={recipe.image?.url || fallbackImage}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <span className="absolute top-4 left-4 bg-primary-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
          {recipe.category}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">{recipe.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400 mt-3">
            <span className="flex items-center gap-1.5">
              <FiUser className="text-primary-600" /> {recipe.author?.name}
            </span>
            <span className="flex items-center gap-1.5">
              <FiClock className="text-primary-600" /> {recipe.cookingTime} minutes
            </span>
          </div>
        </div>

        {isOwner && (
          <div className="flex gap-2 shrink-0">
            <Link
              to={`/recipes/${recipe._id}/edit`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary-500 hover:text-primary-600 transition text-sm font-medium"
            >
              <FiEdit2 size={14} /> Edit
            </Link>
            <button
              onClick={() => setShowConfirm(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-sm font-medium"
            >
              <FiTrash2 size={14} /> Delete
            </button>
          </div>
        )}
      </div>

      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">{recipe.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 sticky top-20">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Ingredients</h2>
            <ul className="space-y-2.5">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <FiCheck className="text-primary-600 mt-0.5 shrink-0" />
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Preparation Steps</h2>
          <ol className="space-y-4">
            {recipe.steps.map((step, index) => (
              <li key={index} className="flex gap-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
                <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary-600 text-white font-semibold text-sm">
                  {index + 1}
                </span>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="Delete Recipe"
        message="This action cannot be undone. Are you sure you want to delete this recipe?"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        loading={deleting}
      />
    </div>
  );
};

export default RecipeDetails;
