import express from "express";
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getMyRecipes,
} from "../controllers/recipe.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/user/my-recipes", protect, getMyRecipes);

router.route("/")
  .get(getRecipes)
  .post(protect, createRecipe);

router.route("/:id")
  .get(getRecipeById)
  .put(protect, updateRecipe)
  .delete(protect, deleteRecipe);

export default router;
