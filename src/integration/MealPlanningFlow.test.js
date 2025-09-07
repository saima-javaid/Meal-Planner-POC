import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('Meal Planning Integration', () => {
  test('app renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Smart Meal Planning Made Easy')).toBeInTheDocument();
  });

  test('displays feature cards', () => {
    render(<App />);
    expect(screen.getByText('Complete Meal Planning')).toBeInTheDocument();
    expect(screen.getByText('Quick AI Planning')).toBeInTheDocument();
  });
});