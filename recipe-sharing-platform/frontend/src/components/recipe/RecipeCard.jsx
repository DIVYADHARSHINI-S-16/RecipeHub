import { Link } from "react-router-dom";
import { FiClock, FiUser } from "react-icons/fi";

const RecipeCard = ({ recipe }) => {
  const fallbackImage =
    "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500&auto=format&fit=crop&q=60";

  return (
    <Link
      to={`/recipes/${recipe._id}`}
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={recipe.image?.url || fallbackImage}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {recipe.category}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">{recipe.title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 flex-1">{recipe.description}</p>

        <div className="flex items-center justify-between mt-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <FiClock className="text-primary-600" />
            <span>{recipe.cookingTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <FiUser className="text-primary-600" />
            <span className="line-clamp-1 max-w-[100px]">{recipe.author?.name || "Unknown"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
