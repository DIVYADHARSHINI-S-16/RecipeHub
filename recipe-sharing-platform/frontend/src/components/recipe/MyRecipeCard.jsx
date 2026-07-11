import { Link } from "react-router-dom";
import { FiClock, FiEdit2, FiTrash2 } from "react-icons/fi";

const MyRecipeCard = ({ recipe, onDelete }) => {
  const fallbackImage =
    "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&auto=format&fit=crop&q=60";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 flex flex-col">
      <Link to={`/recipes/${recipe._id}`} className="relative h-40 overflow-hidden block">
        <img
          src={recipe.image?.url || fallbackImage}
          alt={recipe.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {recipe.category}
        </span>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/recipes/${recipe._id}`}>
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 line-clamp-1 hover:text-primary-600 transition">
            {recipe.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-2">
          <FiClock className="text-primary-600" />
          <span>{recipe.cookingTime} min</span>
        </div>

        <div className="flex gap-2 mt-4">
          <Link
            to={`/recipes/${recipe._id}/edit`}
            className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary-500 hover:text-primary-600 transition"
          >
            <FiEdit2 size={14} /> Edit
          </Link>
          <button
            onClick={() => onDelete(recipe._id)}
            className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium py-2 rounded-lg border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          >
            <FiTrash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyRecipeCard;
