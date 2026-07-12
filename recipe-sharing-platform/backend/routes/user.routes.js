import express from "express";
import { getProfile, updateProfile, changePassword, toggleFavorite, getFavorites } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.post("/favorites/:recipeId", protect, toggleFavorite);
router.get("/favorites", protect, getFavorites);

export default router;