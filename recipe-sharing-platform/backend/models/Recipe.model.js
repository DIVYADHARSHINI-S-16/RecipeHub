import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 500,
    },
    ingredients: {
      type: [String],
      required: [true, "At least one ingredient is required"],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "Ingredients list cannot be empty",
      },
    },
    steps: {
      type: [String],
      required: [true, "At least one step is required"],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "Steps list cannot be empty",
      },
    },
    cookingTime: {
      type: Number,
      required: [true, "Cooking time is required"],
      min: [1, "Cooking time must be at least 1 minute"],
    },
    servings: {
      type: Number,
      required: [true, "Servings is required"],
      min: [1, "Servings must be at least 1"],
      default: 4,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Breakfast",
        "Lunch",
        "Dinner",
        "Dessert",
        "Snacks",
        "Beverages",
        "Vegan",
        "Other",
      ],
    },
    image: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

recipeSchema.index({ title: "text" });

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
