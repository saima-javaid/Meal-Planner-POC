import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GroceryInventory from './GroceryInventory';

describe('GroceryInventory', () => {
  const defaultProps = {
    groceries: [],
    setGroceries: jest.fn()
  };

  test('renders inventory title', () => {
    render(
      <MemoryRouter>
        <GroceryInventory {...defaultProps} />
      </MemoryRouter>
    );
    expect(screen.getByText('My Grocery Inventory')).toBeInTheDocument();
  });

  test('displays empty state', () => {
    render(
      <MemoryRouter>
        <GroceryInventory {...defaultProps} />
      </MemoryRouter>
    );
    expect(screen.getByText('No groceries added yet')).toBeInTheDocument();
  });
});