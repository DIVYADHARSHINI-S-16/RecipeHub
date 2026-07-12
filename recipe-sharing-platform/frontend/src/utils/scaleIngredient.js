/**
 * Scales the leading quantity in an ingredient string based on a serving ratio.
 * Handles plain numbers, decimals, simple fractions ("1/2"), and mixed
 * numbers ("1 1/2"). Ingredients with no leading quantity (e.g. "Salt to
 * taste") are returned unchanged.
 *
 * Examples:
 *   scaleIngredientText("2 cups flour", 2)        -> "4 cups flour"
 *   scaleIngredientText("1/2 tsp salt", 2)         -> "1 tsp salt"
 *   scaleIngredientText("1 1/2 cups milk", 0.5)    -> "3/4 cups milk"
 *   scaleIngredientText("Salt to taste", 2)        -> "Salt to taste"
 */

// Matches a leading quantity: "1", "1.5", "1/2", or "1 1/2"
const QUANTITY_REGEX = /^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(\.\d+)?)(\s*)/;

const FRACTIONS = [
  { value: 1 / 4, label: "1/4" },
  { value: 1 / 3, label: "1/3" },
  { value: 1 / 2, label: "1/2" },
  { value: 2 / 3, label: "2/3" },
  { value: 3 / 4, label: "3/4" },
];

const parseQuantityToken = (token) => {
  if (token.includes(" ")) {
    // Mixed number, e.g. "1 1/2"
    const [whole, frac] = token.split(" ");
    const [num, den] = frac.split("/").map(Number);
    return Number(whole) + num / den;
  }
  if (token.includes("/")) {
    const [num, den] = token.split("/").map(Number);
    return num / den;
  }
  return parseFloat(token);
};

const formatQuantity = (value) => {
  if (value <= 0) return "0";

  const whole = Math.floor(value);
  const remainder = value - whole;

  // Snap the fractional remainder to the closest "nice" cooking fraction
  let closestFraction = null;
  let smallestDiff = 0.05; // tolerance
  for (const f of FRACTIONS) {
    const diff = Math.abs(remainder - f.value);
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestFraction = f;
    }
  }

  if (closestFraction) {
    return whole > 0 ? `${whole} ${closestFraction.label}` : closestFraction.label;
  }

  if (remainder < 0.05) {
    return `${whole}`;
  }

  // Fall back to a clean decimal (max 2 places, no trailing zeros)
  return parseFloat(value.toFixed(2)).toString();
};

export const scaleIngredientText = (ingredientText, ratio) => {
  if (!ingredientText || ratio === 1) return ingredientText;

  const match = ingredientText.match(QUANTITY_REGEX);
  if (!match) return ingredientText; // no leading quantity, e.g. "Salt to taste"

  const originalQuantity = parseQuantityToken(match[1]);
  const scaled = originalQuantity * ratio;
  const rest = ingredientText.slice(match[0].length);

  return `${formatQuantity(scaled)} ${rest}`;
};