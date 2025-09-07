import React from 'react';
import { render, screen } from '@testing-library/react';
import RecipeRating from './RecipeRating';

describe('RecipeRating', () => {
  const mockRecipe = {
    name: 'Test Recipe',
    rating: 4.5,
    totalRatings: 100,
    servings: 2,
    nutrition: { calories: 200, protein: 10, carbs: 20, fat: 5, fiber: 3 },
    dietaryTypes: ['vegetarian'],
    mealPrepFriendly: true
  };

  test('displays recipe rating', () => {
    render(<RecipeRating recipe={mockRecipe} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('100 reviews')).toBeInTheDocument();
  });

  test('shows dietary badges', () => {
    render(<RecipeRating recipe={mockRecipe} />);
    expect(screen.getByText('vegetarian')).toBeInTheDocument();
  });
});