import { CATEGORIES } from "../../utils/constants";

const CategoryFilter = ({ selectedCategory, onChange }) => {
  const allCategories = ["All", ...CATEGORIES];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible scrollbar-hide">
      {allCategories.map((cat) => {
        const isActive = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition-colors duration-200 ${
              isActive
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:text-primary-600"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
