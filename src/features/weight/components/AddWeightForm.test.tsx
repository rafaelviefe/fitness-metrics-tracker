import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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

  it('calls onWeightAdded with the correct weight value when form is submitted', async () => {
    const handleWeightAdded = vi.fn();
    render(<AddWeightForm onWeightAdded={handleWeightAdded} />);

    const weightInput = screen.getByPlaceholderText('Enter weight in kg');
    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    fireEvent.change(weightInput, { target: { value: '75.3' } });
    expect(weightInput).toHaveValue(75.3);

    fireEvent.click(addButton);

    expect(handleWeightAdded).toHaveBeenCalledTimes(1);
    expect(handleWeightAdded).toHaveBeenCalledWith(75.3);
    expect(weightInput).toHaveValue(null); // Input should be cleared after submission
  });

  it('does not call onWeightAdded if no weight is entered', async () => {
    const handleWeightAdded = vi.fn();
    render(<AddWeightForm onWeightAdded={handleWeightAdded} />);

    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    fireEvent.click(addButton);

    expect(handleWeightAdded).not.toHaveBeenCalled();
  });

  it('does not call onWeightAdded if the prop is not provided', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    render(<AddWeightForm />); // No onWeightAdded prop

    const weightInput = screen.getByPlaceholderText('Enter weight in kg');
    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    fireEvent.change(weightInput, { target: { value: '60' } });
    fireEvent.click(addButton);

    expect(consoleSpy).toHaveBeenCalledWith('Submitting weight:', '60'); // Logs but does not crash
    consoleSpy.mockRestore();
  });

  it('clears the input field after submission', async () => {
    const handleWeightAdded = vi.fn();
    render(<AddWeightForm onWeightAdded={handleWeightAdded} />);

    const weightInput = screen.getByPlaceholderText('Enter weight in kg');
    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    fireEvent.change(weightInput, { target: { value: '80' } });
    fireEvent.click(addButton);

    expect(weightInput).toHaveValue(null);
  });
});