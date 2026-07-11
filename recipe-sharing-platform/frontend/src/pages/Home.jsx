import { useState, useEffect, useCallback } from "react";
import SearchBar from "../components/common/SearchBar";
import CategoryFilter from "../components/common/CategoryFilter";
import RecipeList from "../components/recipe/RecipeList";
import useDebounce from "../hooks/useDebounce";
import { fetchRecipes } from "../api/recipeService";

const Home = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);

  const [recipes, setRecipes] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category]);

  const loadRecipes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchRecipes({
        search: debouncedSearch,
        category,
        page,
        limit: 9,
      });
      setRecipes(data.recipes);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load recipes");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, page]);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">Discover Delicious Recipes</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Search, filter, and find your next favorite dish</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <SearchBar value={search} onChange={setSearch} />
      </div>
      <div className="mb-8">
        <CategoryFilter selectedCategory={category} onChange={setCategory} />
      </div>

      <RecipeList recipes={recipes} loading={loading} error={error} />

      {!loading && !error && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:border-primary-500 hover:text-primary-600 transition"
          >
            Prev
          </button>
          <span className="text-gray-600 dark:text-gray-300 text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-40 hover:border-primary-500 hover:text-primary-600 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
