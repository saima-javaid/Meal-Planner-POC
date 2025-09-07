export const ENHANCED_RECIPES = [
  {
    name: 'Scrambled Eggs',
    type: 'Breakfast',
    ingredients: ['eggs', 'butter', 'milk', 'salt', 'pepper'],
    instructions: 'Beat eggs with milk, cook in butter over medium heat, stirring gently.',
    prepTime: '5 minutes',
    cookTime: '5 minutes',
    servings: 2,
    difficulty: 'Easy',
    rating: 4.5,
    totalRatings: 128,
    dietaryTypes: ['vegetarian', 'gluten-free', 'keto'],
    nutrition: {
      calories: 280,
      protein: 18,
      carbs: 2,
      fat: 22,
      fiber: 0
    },
    allergens: ['eggs', 'dairy'],
    tags: ['quick', 'protein-rich', 'low-carb'],
    mealPrepFriendly: true,
    storageInstructions: 'Store in refrigerator for up to 3 days. Reheat gently in microwave.'
  },
  {
    name: 'Oatmeal Bowl',
    type: 'Breakfast',
    ingredients: ['oats', 'milk', 'honey', 'banana', 'cinnamon'],
    instructions: 'Cook oats with milk for 5 minutes. Top with sliced banana, honey, and cinnamon.',
    prepTime: '2 minutes',
    cookTime: '5 minutes',
    servings: 1,
    difficulty: 'Easy',
    rating: 4.2,
    totalRatings: 95,
    dietaryTypes: ['vegetarian', 'halal', 'kosher'],
    nutrition: {
      calories: 320,
      protein: 12,
      carbs: 58,
      fat: 6,
      fiber: 8
    },
    allergens: ['dairy'],
    tags: ['healthy', 'fiber-rich', 'filling'],
    mealPrepFriendly: true,
    storageInstructions: 'Prepare dry ingredients in advance. Cook fresh daily for best texture.'
  },
  {
    name: 'Avocado Toast',
    type: 'Breakfast',
    ingredients: ['bread', 'avocado', 'salt', 'pepper', 'lemon', 'tomato'],
    instructions: 'Toast bread. Mash avocado with lemon, salt, and pepper. Spread on toast, top with tomato slices.',
    prepTime: '5 minutes',
    cookTime: '2 minutes',
    servings: 1,
    difficulty: 'Easy',
    rating: 4.7,
    totalRatings: 203,
    dietaryTypes: ['vegan', 'vegetarian', 'halal', 'kosher'],
    nutrition: {
      calories: 290,
      protein: 8,
      carbs: 32,
      fat: 18,
      fiber: 12
    },
    allergens: ['gluten'],
    tags: ['healthy', 'vegetarian', 'trendy'],
    mealPrepFriendly: false,
    storageInstructions: 'Best served fresh. Avocado browns quickly when exposed to air.'
  },
  {
    name: 'Greek Chicken Salad',
    type: 'Lunch',
    ingredients: ['chicken breast', 'lettuce', 'tomato', 'cucumber', 'feta cheese', 'olive oil', 'lemon'],
    instructions: 'Grill seasoned chicken breast. Mix vegetables, add crumbled feta. Dress with olive oil and lemon.',
    prepTime: '10 minutes',
    cookTime: '15 minutes',
    servings: 2,
    difficulty: 'Medium',
    rating: 4.4,
    totalRatings: 156,
    dietaryTypes: ['gluten-free', 'keto'],
    nutrition: {
      calories: 380,
      protein: 35,
      carbs: 12,
      fat: 22,
      fiber: 4
    },
    allergens: ['dairy'],
    tags: ['high-protein', 'mediterranean', 'fresh'],
    mealPrepFriendly: true,
    storageInstructions: 'Store components separately. Assemble just before eating for best freshness.'
  },
  {
    name: 'Pasta Primavera',
    type: 'Lunch',
    ingredients: ['pasta', 'broccoli', 'bell pepper', 'zucchini', 'garlic', 'olive oil', 'parmesan'],
    instructions: 'Cook pasta. Sauté vegetables with garlic in olive oil. Toss with pasta and parmesan.',
    prepTime: '10 minutes',
    cookTime: '15 minutes',
    servings: 3,
    difficulty: 'Medium',
    rating: 4.3,
    totalRatings: 87,
    dietaryTypes: ['vegetarian', 'halal', 'kosher'],
    nutrition: {
      calories: 420,
      protein: 16,
      carbs: 68,
      fat: 12,
      fiber: 6
    },
    allergens: ['gluten', 'dairy'],
    tags: ['vegetarian', 'colorful', 'satisfying'],
    mealPrepFriendly: true,
    storageInstructions: 'Store in refrigerator for up to 4 days. Add a splash of water when reheating.'
  },
  {
    name: 'Turkey Club Sandwich',
    type: 'Lunch',
    ingredients: ['bread', 'turkey', 'bacon', 'lettuce', 'tomato', 'mayo'],
    instructions: 'Toast bread. Layer turkey, crispy bacon, lettuce, and tomato with mayo between bread slices.',
    prepTime: '8 minutes',
    cookTime: '5 minutes',
    servings: 1,
    difficulty: 'Easy',
    rating: 4.1,
    totalRatings: 74,
    dietaryTypes: ['halal'],
    nutrition: {
      calories: 520,
      protein: 32,
      carbs: 38,
      fat: 26,
      fiber: 4
    },
    allergens: ['gluten'],
    tags: ['classic', 'hearty', 'comfort-food'],
    mealPrepFriendly: false,
    storageInstructions: 'Best served fresh. Bread becomes soggy if stored assembled.'
  },
  {
    name: 'Grilled Salmon with Quinoa',
    type: 'Dinner',
    ingredients: ['salmon', 'quinoa', 'asparagus', 'lemon', 'olive oil', 'garlic', 'herbs'],
    instructions: 'Season salmon with herbs. Grill 6-8 minutes per side. Cook quinoa. Steam asparagus. Serve with lemon.',
    prepTime: '10 minutes',
    cookTime: '20 minutes',
    servings: 2,
    difficulty: 'Medium',
    rating: 4.8,
    totalRatings: 234,
    dietaryTypes: ['gluten-free', 'keto', 'paleo'],
    nutrition: {
      calories: 480,
      protein: 42,
      carbs: 35,
      fat: 20,
      fiber: 6
    },
    allergens: ['fish'],
    tags: ['omega-3', 'complete-protein', 'elegant'],
    mealPrepFriendly: true,
    storageInstructions: 'Store salmon and quinoa separately. Reheat gently to avoid overcooking fish.'
  },
  {
    name: 'Beef Stir Fry',
    type: 'Dinner',
    ingredients: ['beef strips', 'broccoli', 'carrot', 'bell pepper', 'soy sauce', 'garlic', 'ginger', 'rice'],
    instructions: 'Marinate beef in soy sauce. Stir-fry beef first, then vegetables. Add sauce and serve over rice.',
    prepTime: '15 minutes',
    cookTime: '12 minutes',
    servings: 3,
    difficulty: 'Medium',
    rating: 4.2,
    totalRatings: 112,
    dietaryTypes: ['gluten-free', 'halal'],
    nutrition: {
      calories: 450,
      protein: 28,
      carbs: 48,
      fat: 16,
      fiber: 4
    },
    allergens: ['soy'],
    tags: ['asian-inspired', 'colorful', 'quick'],
    mealPrepFriendly: true,
    storageInstructions: 'Store in refrigerator for up to 3 days. Vegetables may soften slightly when reheated.'
  },
  {
    name: 'Vegetable Curry',
    type: 'Dinner',
    ingredients: ['chickpeas', 'sweet potato', 'spinach', 'coconut milk', 'curry powder', 'onion', 'garlic', 'rice'],
    instructions: 'Sauté onion and garlic. Add curry powder, sweet potato, and coconut milk. Simmer 15 minutes. Add chickpeas and spinach.',
    prepTime: '15 minutes',
    cookTime: '25 minutes',
    servings: 4,
    difficulty: 'Medium',
    rating: 4.6,
    totalRatings: 189,
    dietaryTypes: ['vegan', 'vegetarian', 'gluten-free', 'halal', 'kosher'],
    nutrition: {
      calories: 380,
      protein: 14,
      carbs: 58,
      fat: 12,
      fiber: 12
    },
    allergens: [],
    tags: ['vegan', 'spicy', 'comfort-food', 'plant-based'],
    mealPrepFriendly: true,
    storageInstructions: 'Excellent for meal prep. Flavors improve after a day. Store for up to 5 days.'
  },
  {
    name: 'Apple Slices with Peanut Butter',
    type: 'Snacks',
    ingredients: ['apple', 'peanut butter', 'cinnamon'],
    instructions: 'Slice apple into wedges. Serve with peanut butter for dipping. Sprinkle with cinnamon.',
    prepTime: '3 minutes',
    cookTime: '0 minutes',
    servings: 1,
    difficulty: 'Easy',
    rating: 4.0,
    totalRatings: 67,
    dietaryTypes: ['vegan', 'vegetarian', 'gluten-free', 'halal', 'kosher'],
    nutrition: {
      calories: 190,
      protein: 8,
      carbs: 20,
      fat: 12,
      fiber: 5
    },
    allergens: ['peanuts'],
    tags: ['healthy', 'no-cook', 'kid-friendly'],
    mealPrepFriendly: false,
    storageInstructions: 'Apple slices brown quickly. Add lemon juice to prevent browning if preparing ahead.'
  },
  {
    name: 'Greek Yogurt Parfait',
    type: 'Snacks',
    ingredients: ['greek yogurt', 'berries', 'granola', 'honey'],
    instructions: 'Layer Greek yogurt with berries and granola. Drizzle with honey.',
    prepTime: '3 minutes',
    cookTime: '0 minutes',
    servings: 1,
    difficulty: 'Easy',
    rating: 4.4,
    totalRatings: 143,
    dietaryTypes: ['vegetarian', 'gluten-free', 'halal', 'kosher'],
    nutrition: {
      calories: 220,
      protein: 15,
      carbs: 32,
      fat: 6,
      fiber: 4
    },
    allergens: ['dairy'],
    tags: ['probiotic', 'antioxidants', 'refreshing'],
    mealPrepFriendly: true,
    storageInstructions: 'Can be assembled the night before. Keep granola separate to maintain crunch.'
  },
  {
    name: 'Trail Mix',
    type: 'Snacks',
    ingredients: ['almonds', 'walnuts', 'dried cranberries', 'dark chocolate chips'],
    instructions: 'Mix all ingredients in a bowl. Store in airtight container.',
    prepTime: '2 minutes',
    cookTime: '0 minutes',
    servings: 4,
    difficulty: 'Easy',
    rating: 4.3,
    totalRatings: 91,
    dietaryTypes: ['vegan', 'vegetarian', 'gluten-free', 'halal', 'kosher'],
    nutrition: {
      calories: 180,
      protein: 5,
      carbs: 16,
      fat: 12,
      fiber: 3
    },
    allergens: ['nuts'],
    tags: ['portable', 'energy-boost', 'no-cook'],
    mealPrepFriendly: true,
    storageInstructions: 'Store in airtight container for up to 2 weeks. Great for batch preparation.'
  }
];

export const DIETARY_TYPES = [
  'vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'keto', 'paleo', 
  'halal', 'kosher', 'low-carb', 'high-protein', 'mediterranean'
];

export const adjustRecipePortions = (recipe, newServings) => {
  const multiplier = newServings / recipe.servings;
  
  return {
    ...recipe,
    servings: newServings,
    nutrition: {
      calories: Math.round(recipe.nutrition.calories * multiplier),
      protein: Math.round(recipe.nutrition.protein * multiplier),
      carbs: Math.round(recipe.nutrition.carbs * multiplier),
      fat: Math.round(recipe.nutrition.fat * multiplier),
      fiber: Math.round(recipe.nutrition.fiber * multiplier)
    }
  };
};

export const filterRecipesByPreferences = (recipes, preferences) => {
  return recipes.filter(recipe => {
    // Filter out recipes with allergens
    if (preferences.allergies?.length > 0) {
      const hasAllergen = recipe.allergens.some(allergen => 
        preferences.allergies.some(userAllergen => 
          allergen.toLowerCase().includes(userAllergen.toLowerCase()) ||
          userAllergen.toLowerCase().includes(allergen.toLowerCase())
        )
      );
      if (hasAllergen) return false;
    }

    // Filter out recipes with disliked ingredients
    if (preferences.dislikes?.length > 0) {
      const hasDisliked = recipe.ingredients.some(ingredient =>
        preferences.dislikes.some(dislike =>
          ingredient.toLowerCase().includes(dislike.toLowerCase()) ||
          dislike.toLowerCase().includes(ingredient.toLowerCase())
        )
      );
      if (hasDisliked) return false;
    }

    // Filter by dietary types if specified
    if (preferences.dietaryTypes?.length > 0) {
      const matchesDietaryType = preferences.dietaryTypes.some(dietType =>
        recipe.dietaryTypes.includes(dietType)
      );
      if (!matchesDietaryType) return false;
    }

    return true;
  });
};

export const scoreRecipeByPreferences = (recipe, preferences) => {
  let score = 0;
  
  // Boost score for liked ingredients
  if (preferences.likes?.length > 0) {
    const likedIngredients = recipe.ingredients.filter(ingredient =>
      preferences.likes.some(like =>
        ingredient.toLowerCase().includes(like.toLowerCase()) ||
        like.toLowerCase().includes(ingredient.toLowerCase())
      )
    );
    score += likedIngredients.length * 0.3;
  }

  // Boost score for matching dietary preferences
  if (preferences.dietaryTypes?.length > 0) {
    const matchingDietTypes = recipe.dietaryTypes.filter(dietType =>
      preferences.dietaryTypes.includes(dietType)
    );
    score += matchingDietTypes.length * 0.2;
  }

  // Boost score for higher ratings
  score += (recipe.rating / 5) * 0.5;

  return score;
};