import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AddWeightForm } from './AddWeightForm';

describe('AddWeightForm', () => {
  it('renders an input field for weight with a placeholder', () => {
    render(<AddWeightForm />);
    const weightInput = screen.getByPlaceholderText('Enter weight in kg');
    expect(weightInput).toBeInTheDocument();
    expect(weightInput).toHaveAttribute('type', 'number');
    expect(weightInput).toHaveAttribute('step', '0.1');
  });

  it('renders Input and Button components', () => {
    render(<AddWeightForm />);
    const weightInput = screen.getByPlaceholderText('Enter weight in kg');
    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    expect(weightInput).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
  });
});
