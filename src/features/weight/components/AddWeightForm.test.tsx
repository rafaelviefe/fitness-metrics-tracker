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
    expect(screen.queryByText('Weight must be a positive number.')).not.toBeInTheDocument(); // No error on valid submission
  });

  it('does not call onWeightAdded if no weight is entered and shows an error', async () => {
    const handleWeightAdded = vi.fn();
    render(<AddWeightForm onWeightAdded={handleWeightAdded} />);

    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    fireEvent.click(addButton);

    expect(handleWeightAdded).not.toHaveBeenCalled();
    expect(await screen.findByText('Weight must be a positive number.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter weight in kg')).toHaveValue(null); // Input clears even on error
  });

  it('does not call onWeightAdded if the prop is not provided (and no error is shown)', async () => {
    // This test has been adjusted as the component no longer logs to console in this scenario.
    render(<AddWeightForm />); // No onWeightAdded prop

    const weightInput = screen.getByPlaceholderText('Enter weight in kg');
    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    fireEvent.change(weightInput, { target: { value: '60' } }); // A valid weight
    fireEvent.click(addButton);

    // The component logic dictates that if onWeightAdded is not provided, nothing happens with the weight value.
    expect(weightInput).toHaveValue(null); // Input still clears
    expect(screen.queryByText('Weight must be a positive number.')).not.toBeInTheDocument(); // No error for valid weight
  });

  it('clears the input field after successful submission', async () => {
    const handleWeightAdded = vi.fn();
    render(<AddWeightForm onWeightAdded={handleWeightAdded} />);

    const weightInput = screen.getByPlaceholderText('Enter weight in kg');
    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    fireEvent.change(weightInput, { target: { value: '80' } });
    fireEvent.click(addButton);

    expect(weightInput).toHaveValue(null);
    expect(screen.queryByText('Weight must be a positive number.')).not.toBeInTheDocument(); // No error on valid submission
  });

  it('shows an error if a negative weight is entered', async () => {
    const handleWeightAdded = vi.fn();
    render(<AddWeightForm onWeightAdded={handleWeightAdded} />);

    const weightInput = screen.getByPlaceholderText('Enter weight in kg');
    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    fireEvent.change(weightInput, { target: { value: '-5' } });
    fireEvent.click(addButton);

    expect(handleWeightAdded).not.toHaveBeenCalled();
    expect(await screen.findByText('Weight must be a positive number.')).toBeInTheDocument();
    // Input value should not clear on error so user can correct it
    expect(weightInput).toHaveValue(-5);
  });

  it('shows an error if zero weight is entered', async () => {
    const handleWeightAdded = vi.fn();
    render(<AddWeightForm onWeightAdded={handleWeightAdded} />);

    const weightInput = screen.getByPlaceholderText('Enter weight in kg');
    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    fireEvent.change(weightInput, { target: { value: '0' } });
    fireEvent.click(addButton);

    expect(handleWeightAdded).not.toHaveBeenCalled();
    expect(await screen.findByText('Weight must be a positive number.')).toBeInTheDocument();
    // Input value should not clear on error so user can correct it
    expect(weightInput).toHaveValue(0);
  });

  it('clears the error message when user starts typing after an error', async () => {
    render(<AddWeightForm />);

    const weightInput = screen.getByPlaceholderText('Enter weight in kg');
    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    // Trigger an error
    fireEvent.change(weightInput, { target: { value: '-10' } });
    fireEvent.click(addButton);
    expect(await screen.findByText('Weight must be a positive number.')).toBeInTheDocument();

    // Start typing a valid number
    fireEvent.change(weightInput, { target: { value: '70' } });
    expect(screen.queryByText('Weight must be a positive number.')).not.toBeInTheDocument();
  });

  it('clears the error message on successful submission', async () => {
    const handleWeightAdded = vi.fn();
    render(<AddWeightForm onWeightAdded={handleWeightAdded} />);

    const weightInput = screen.getByPlaceholderText('Enter weight in kg');
    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    // Trigger an error first
    fireEvent.change(weightInput, { target: { value: '-10' } });
    fireEvent.click(addButton);
    expect(await screen.findByText('Weight must be a positive number.')).toBeInTheDocument();

    // Correct the input and submit
    fireEvent.change(weightInput, { target: { value: '70' } });
    fireEvent.click(addButton);

    expect(handleWeightAdded).toHaveBeenCalledWith(70);
    expect(screen.queryByText('Weight must be a positive number.')).not.toBeInTheDocument();
    expect(weightInput).toHaveValue(null);
  });
});
