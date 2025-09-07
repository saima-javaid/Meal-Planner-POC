import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  test('renders home page', () => {
    render(<App />);
    expect(screen.getByText('Smart Meal Planning Made Easy')).toBeInTheDocument();
  });

  test('renders navigation', () => {
    render(<App />);
    expect(screen.getByText('Meal Planner')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});