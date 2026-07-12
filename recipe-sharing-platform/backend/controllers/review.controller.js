import Review from "../models/Review.model.js";
import Recipe from "../models/Recipe.model.js";

export const getReviewsForRecipe = async (req, res, next) => {
  try {
    const { recipeId } = req.params;

    const reviews = await Review.find({ recipe: recipeId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    const avgResult = await Review.aggregate([
      { $match: { recipe: new (await import("mongoose")).default.Types.ObjectId(recipeId) } },
      { $group: { _id: "$recipe", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    const averageRating = avgResult.length > 0 ? Math.round(avgResult[0].avgRating * 10) / 10 : 0;
    const totalReviews = avgResult.length > 0 ? avgResult[0].count : 0;

    res.status(200).json({ reviews, averageRating, totalReviews });
  } catch (error) {
    next(error);
  }
};

export const createOrUpdateReview = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const review = await Review.findOneAndUpdate(
      { recipe: recipeId, user: req.user._id },
      { rating, comment: comment || "" },
      { new: true, upsert: true, runValidators: true }
    ).populate("user", "name avatar");

    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await review.deleteOne();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    next(error);
  }
};