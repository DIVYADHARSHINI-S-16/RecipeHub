import express from "express";
import { uploadImage, removeImage } from "../controllers/upload.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), uploadImage);
router.delete("/:publicId", protect, removeImage);

export default router;
