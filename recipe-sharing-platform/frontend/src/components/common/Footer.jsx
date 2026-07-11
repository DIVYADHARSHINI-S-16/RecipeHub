import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-gray-100">
            <span className="text-xl">🍲</span>
            Recipe<span className="text-primary-600">Hub</span>
          </Link>
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
            © {new Date().getFullYear()} RecipeHub. Built with the MERN stack.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
