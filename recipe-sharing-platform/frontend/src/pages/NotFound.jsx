import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl mb-4">🍳</p>
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">404</h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">
        Oops! This page seems to have been eaten. Let's get you back to the kitchen.
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-2.5 rounded-lg transition"
      >
        <FiHome /> Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
