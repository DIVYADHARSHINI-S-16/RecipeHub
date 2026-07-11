import Recipe from "../models/Recipe.model.js";

export const createRecipe = async (req, res, next) => {
  try {
    const { title, description, ingredients, steps, cookingTime, category, image } = req.body;

    if (!title || !description || !ingredients || !steps || !cookingTime || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const recipe = await Recipe.create({
      title,
      description,
      ingredients: Array.isArray(ingredients) ? ingredients : ingredients.split(",").map((i) => i.trim()),
      steps: Array.isArray(steps) ? steps : steps.split(",").map((s) => s.trim()),
      cookingTime,
      category,
      image: image || { url: "", publicId: "" },
      author: req.user._id,
    });

    const populatedRecipe = await recipe.populate("author", "name avatar");

    res.status(201).json(populatedRecipe);
  } catch (error) {
    next(error);
  }
};

export const getRecipes = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 9 } = req.query;

    const query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category && category !== "All") {
      query.category = category;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [recipes, total] = await Promise.all([
      Recipe.find(query)
        .populate("author", "name avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Recipe.countDocuments(query),
    ]);

    res.status(200).json({
      recipes,
      totalRecipes: total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    next(error);
  }
};

export const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("author", "name avatar bio");

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json(recipe);
  } catch (error) {
    next(error);
  }
};

export const updateRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this recipe" });
    }

    const { title, description, ingredients, steps, cookingTime, category, image } = req.body;

    recipe.title = title ?? recipe.title;
    recipe.description = description ?? recipe.description;
    recipe.ingredients = ingredients
      ? Array.isArray(ingredients)
        ? ingredients
        : ingredients.split(",").map((i) => i.trim())
      : recipe.ingredients;
    recipe.steps = steps
      ? Array.isArray(steps)
        ? steps
        : steps.split(",").map((s) => s.trim())
      : recipe.steps;
    recipe.cookingTime = cookingTime ?? recipe.cookingTime;
    recipe.category = category ?? recipe.category;
    recipe.image = image ?? recipe.image;

    const updatedRecipe = await recipe.save();
    const populatedRecipe = await updatedRecipe.populate("author", "name avatar");

    res.status(200).json(populatedRecipe);
  } catch (error) {
    next(error);
  }
};

export const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this recipe" });
    }

    await recipe.deleteOne();

    res.status(200).json({ message: "Recipe deleted successfully", id: req.params.id });
  } catch (error) {
    next(error);
  }
};

export const getMyRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find({ author: req.user._id })
      .populate("author", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(recipes);
  } catch (error) {
    next(error);
  }
};
