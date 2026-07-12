import express from "express";
import {
  getReviewsForRecipe,
  createOrUpdateReview,
  deleteReview,
} from "../controllers/review.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:recipeId", getReviewsForRecipe);
router.post("/:recipeId", protect, createOrUpdateReview);
router.delete("/:reviewId", protect, deleteReview);

export default router;