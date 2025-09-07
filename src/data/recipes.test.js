import { 
  adjustRecipePortions, 
  filterRecipesByPreferences, 
  scoreRecipeByPreferences,
  ENHANCED_RECIPES 
} from './recipes';

describe('Recipe Utilities', () => {
  const mockRecipe = {
    name: 'Test Recipe',
    servings: 2,
    nutrition: { calories: 200, protein: 10, carbs: 20, fat: 5, fiber: 3 },
    ingredients: ['eggs', 'milk'],
    allergens: ['eggs', 'dairy'],
    dietaryTypes: ['vegetarian'],
    rating: 4.5
  };

  describe('adjustRecipePortions', () => {
    test('doubles portions correctly', () => {
      const adjusted = adjustRecipePortions(mockRecipe, 4);
      expect(adjusted.servings).toBe(4);
      expect(adjusted.nutrition.calories).toBe(400);
      expect(adjusted.nutrition.protein).toBe(20);
    });

    test('halves portions correctly', () => {
      const adjusted = adjustRecipePortions(mockRecipe, 1);
      expect(adjusted.servings).toBe(1);
      expect(adjusted.nutrition.calories).toBe(100);
      expect(adjusted.nutrition.protein).toBe(5);
    });
  });

  describe('filterRecipesByPreferences', () => {
    test('filters out recipes with allergens', () => {
      const preferences = { allergies: ['eggs'] };
      const filtered = filterRecipesByPreferences([mockRecipe], preferences);
      expect(filtered).toHaveLength(0);
    });

    test('filters out recipes with disliked ingredients', () => {
      const preferences = { dislikes: ['milk'] };
      const filtered = filterRecipesByPreferences([mockRecipe], preferences);
      expect(filtered).toHaveLength(0);
    });

    test('includes recipes matching dietary types', () => {
      const preferences = { dietaryTypes: ['vegetarian'] };
      const filtered = filterRecipesByPreferences([mockRecipe], preferences);
      expect(filtered).toHaveLength(1);
    });
  });

  describe('scoreRecipeByPreferences', () => {
    test('scores higher for liked ingredients', () => {
      const preferences = { likes: ['eggs'] };
      const score = scoreRecipeByPreferences(mockRecipe, preferences);
      expect(score).toBeGreaterThan(0);
    });

    test('scores higher for matching dietary types', () => {
      const preferences = { dietaryTypes: ['vegetarian'] };
      const score = scoreRecipeByPreferences(mockRecipe, preferences);
      expect(score).toBeGreaterThan(0);
    });
  });
});