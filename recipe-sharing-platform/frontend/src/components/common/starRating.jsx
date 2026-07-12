import { FiStar } from "react-icons/fi";

const StarRating = ({ rating, onChange, size = 20, readOnly = false }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => onChange && onChange(star)}
          className={readOnly ? "cursor-default" : "cursor-pointer hover:scale-110 transition-transform"}
        >
          <FiStar
            size={size}
            className={star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;