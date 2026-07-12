import { useState, useEffect } from "react";
import { FiTrash2, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";
import StarRating from "../common/StarRating";
import { getReviewsForRecipe, submitReview, deleteReviewRequest } from "../../api/reviewService";
import useAuth from "../../hooks/useAuth";

const Reviews = ({ recipeId }) => {
  const { user, isAuthenticated } = useAuth();

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);

  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await getReviewsForRecipe(recipeId);
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
      setTotalReviews(data.totalReviews);

      const existingReview = data.reviews.find((r) => r.user._id === user?._id);
      if (existingReview) {
        setMyRating(existingReview.rating);
        setMyComment(existingReview.comment);
      }
    } catch (error) {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (myRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmitting(true);
    try {
      await submitReview(recipeId, { rating: myRating, comment: myComment });
      toast.success("Review submitted");
      loadReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await deleteReviewRequest(reviewId);
      toast.success("Review deleted");
      setMyRating(0);
      setMyComment("");
      loadReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete review");
    }
  };

  const myReview = reviews.find((r) => r.user._id === user?._id);

  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Reviews</h2>
        {totalReviews > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating rating={Math.round(averageRating)} readOnly size={16} />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {averageRating} ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
            </span>
          </div>
        )}
      </div>

      {isAuthenticated && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 mb-6"
        >
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            {myReview ? "Update your review" : "Leave a review"}
          </p>
          <StarRating rating={myRating} onChange={setMyRating} size={24} />
          <textarea
            value={myComment}
            onChange={(e) => setMyComment(e.target.value)}
            placeholder="Share your thoughts about this recipe (optional)"
            className="input-field resize-none mt-3"
            rows={3}
            maxLength={500}
          />
          <button type="submit" disabled={submitting} className="btn-primary sm:w-auto px-6 mt-3">
            {submitting ? "Submitting..." : myReview ? "Update Review" : "Submit Review"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review this recipe!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 shrink-0 overflow-hidden">
                    {review.user?.avatar ? (
                      <img src={review.user.avatar} alt={review.user.name} className="w-full h-full object-cover" />
                    ) : (
                      <FiUser size={14} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{review.user?.name}</p>
                    <StarRating rating={review.rating} readOnly size={14} />
                  </div>
                </div>
                {user?._id === review.user?._id && (
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="text-gray-400 hover:text-red-500 transition"
                    aria-label="Delete review"
                  >
                    <FiTrash2 size={16} />
                  </button>
                )}
              </div>
              {review.comment && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-3">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;