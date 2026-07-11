import { FiSearch, FiX } from "react-icons/fi";

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="relative w-full sm:max-w-md">
      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search recipes by title..."
        className="w-full pl-10 pr-9 py-2.5 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Clear search"
        >
          <FiX />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
