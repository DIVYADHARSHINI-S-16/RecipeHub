import { useState } from "react";
import { FiPlus, FiX, FiClock, FiUsers } from "react-icons/fi";
import ImageUpload from "../common/ImageUpload";
import { CATEGORIES } from "../../utils/constants";

const emptyDefaults = {
  title: "",
  description: "",
  ingredients: [""],
  steps: [""],
  cookingTime: "",
  servings: "",
  category: "",
  image: null,
};

const RecipeForm = ({ initialData, onSubmit, submitLabel = "Publish Recipe", loading }) => {
  const [form, setForm] = useState({ ...emptyDefaults, ...initialData });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleListChange = (field, index, value) => {
    const updated = [...form[field]];
    updated[index] = value;
    setForm((prev) => ({ ...prev, [field]: updated }));
  };

  const addListItem = (field) => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const removeListItem = (field, index) => {
    if (form[field].length === 1) return;
    setForm((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const validate = () => {
    const newErrors = {};
    if (form.title.trim().length < 3) newErrors.title = "Title must be at least 3 characters";
    if (form.description.trim().length < 10) newErrors.description = "Description must be at least 10 characters";
    if (form.ingredients.filter((i) => i.trim()).length === 0)
      newErrors.ingredients = "Add at least one ingredient";
    if (form.steps.filter((s) => s.trim()).length === 0) newErrors.steps = "Add at least one step";
    if (!form.cookingTime || Number(form.cookingTime) <= 0)
      newErrors.cookingTime = "Enter a valid cooking time";
    if (!form.servings || Number(form.servings) <= 0)
      newErrors.servings = "Enter a valid number of servings";
    if (!form.category) newErrors.category = "Select a category";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      ingredients: form.ingredients.map((i) => i.trim()).filter(Boolean),
      steps: form.steps.map((s) => s.trim()).filter(Boolean),
      cookingTime: Number(form.cookingTime),
      servings: Number(form.servings),
      category: form.category,
      image: form.image || { url: "", publicId: "" },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ImageUpload value={form.image} onChange={(val) => handleChange("image", val)} />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Recipe Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="e.g. Creamy Garlic Butter Pasta"
          className="input-field"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="A short, tasty description of your recipe..."
          rows={3}
          maxLength={500}
          className="input-field resize-none"
        />
        <div className="flex justify-between mt-1">
          {errors.description ? (
            <p className="text-red-500 text-sm">{errors.description}</p>
          ) : (
            <span />
          )}
          <p className="text-xs text-gray-400 dark:text-gray-500">{form.description.length}/500</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
          <select
            value={form.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="input-field"
          >
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Cooking Time (minutes)</label>
          <div className="relative">
            <FiClock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="number"
              min={1}
              value={form.cookingTime}
              onChange={(e) => handleChange("cookingTime", e.target.value)}
              placeholder="e.g. 30"
              className="input-field pl-10"
            />
          </div>
          {errors.cookingTime && <p className="text-red-500 text-sm mt-1">{errors.cookingTime}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Servings</label>
          <div className="relative">
            <FiUsers className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="number"
              min={1}
              value={form.servings}
              onChange={(e) => handleChange("servings", e.target.value)}
              placeholder="e.g. 4"
              className="input-field pl-10"
            />
          </div>
          {errors.servings && <p className="text-red-500 text-sm mt-1">{errors.servings}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Ingredients</label>
        <div className="space-y-2">
          {form.ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleListChange("ingredients", index, e.target.value)}
                placeholder={`Ingredient ${index + 1} (e.g. 2 cups flour)`}
                className="input-field"
              />
              <button
                type="button"
                onClick={() => removeListItem("ingredients", index)}
                className="shrink-0 w-11 h-11 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:border-red-300 transition"
              >
                <FiX />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addListItem("ingredients")}
          className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 mt-2"
        >
          <FiPlus size={16} /> Add Ingredient
        </button>
        {errors.ingredients && <p className="text-red-500 text-sm mt-1">{errors.ingredients}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Steps</label>
        <div className="space-y-2">
          {form.steps.map((step, index) => (
            <div key={index} className="flex gap-2">
              <span className="shrink-0 w-11 h-11 flex items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 font-semibold text-sm">
                {index + 1}
              </span>
              <textarea
                value={step}
                onChange={(e) => handleListChange("steps", index, e.target.value)}
                placeholder={`Describe step ${index + 1}...`}
                rows={2}
                className="input-field resize-none"
              />
              <button
                type="button"
                onClick={() => removeListItem("steps", index)}
                className="shrink-0 w-11 h-11 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:border-red-300 transition"
              >
                <FiX />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addListItem("steps")}
          className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 mt-2"
        >
          <FiPlus size={16} /> Add Step
        </button>
        {errors.steps && <p className="text-red-500 text-sm mt-1">{errors.steps}</p>}
      </div>

      <button type="submit" disabled={loading} className="btn-primary sm:w-auto px-8">
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
};

export default RecipeForm;