import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MealPlanner from './MealPlanner';

describe('MealPlanner', () => {
  const defaultProps = {
    mealPlan: {},
    setMealPlan: jest.fn(),
    preferences: { allergies: [], likes: [], dislikes: [], dietaryTypes: [] },
    groceries: [],
    scheduledDelivery: null
  };

  test('renders meal planner title', () => {
    render(
      <MemoryRouter>
        <MealPlanner {...defaultProps} />
      </MemoryRouter>
    );
    expect(screen.getByText('Weekly Meal Planner')).toBeInTheDocument();
  });

  test('displays days of the week', () => {
    render(
      <MemoryRouter>
        <MealPlanner {...defaultProps} />
      </MemoryRouter>
    );
    expect(screen.getByText('Monday')).toBeInTheDocument();
  });
});