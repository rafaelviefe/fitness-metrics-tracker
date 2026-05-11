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
    expect(addButton).toBeEnabled(); // Button should be enabled with valid input

    fireEvent.click(addButton);

    expect(handleWeightAdded).toHaveBeenCalledTimes(1);
    expect(handleWeightAdded).toHaveBeenCalledWith(75.3);
    expect(weightInput).toHaveValue(null); // Input should be cleared after submission
    expect(screen.queryByText('Weight must be a positive number.')).not.toBeInTheDocument(); // No error on valid submission
    expect(addButton).toBeDisabled(); // Button should be disabled again after clearing input
  });

  it('should disable the "Add Weight" button when the input field is empty and not show an error initially', () => {
    const handleWeightAdded = vi.fn();
    render(<AddWeightForm onWeightAdded={handleWeightAdded} />);

    const weightInput = screen.getByPlaceholderText('Enter weight in kg');
    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    // Initially, input is empty, button should be disabled
    expect(weightInput).toHaveValue(null);
    expect(addButton).toBeDisabled();

    // Clicking a disabled button should not trigger submission or show an error
    fireEvent.click(addButton);

    expect(handleWeightAdded).not.toHaveBeenCalled();
    expect(screen.queryByText('Weight must be a positive number.')).not.toBeInTheDocument(); // No error message before actual submission
  });

  it('clears the input field after successful submission even if onWeightAdded is not provided', async () => {
    render(<AddWeightForm />); // No onWeightAdded prop

    const weightInput = screen.getByPlaceholderText('Enter weight in kg');
    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    fireEvent.change(weightInput, { target: { value: '60' } }); // A valid weight
    expect(addButton).toBeEnabled(); // Button should be enabled with valid input
    fireEvent.click(addButton);

    expect(weightInput).toHaveValue(null); // Input still clears
    expect(screen.queryByText('Weight must be a positive number.')).not.toBeInTheDocument(); // No error for valid weight
    expect(addButton).toBeDisabled(); // Button should be disabled again after clearing input
  });

  it('shows an error if a negative weight is entered and button is disabled', async () => {
    const handleWeightAdded = vi.fn();
    render(<AddWeightForm onWeightAdded={handleWeightAdded} />);

    const weightInput = screen.getByPlaceholderText('Enter weight in kg');
    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    fireEvent.change(weightInput, { target: { value: '-5' } });
    expect(addButton).toBeEnabled(); // Button should be enabled once value is present

    fireEvent.click(addButton);

    expect(handleWeightAdded).not.toHaveBeenCalled();
    expect(await screen.findByText('Weight must be a positive number.')).toBeInTheDocument();
    expect(weightInput).toHaveValue(-5);
    expect(addButton).toBeDisabled(); // Button should be disabled due to the error
  });

  it('shows an error if zero weight is entered and button is disabled', async () => {
    const handleWeightAdded = vi.fn();
    render(<AddWeightForm onWeightAdded={handleWeightAdded} />);

    const weightInput = screen.getByPlaceholderText('Enter weight in kg');
    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    fireEvent.change(weightInput, { target: { value: '0' } });
    expect(addButton).toBeEnabled(); // Button should be enabled once value is present

    fireEvent.click(addButton);

    expect(handleWeightAdded).not.toHaveBeenCalled();
    expect(await screen.findByText('Weight must be a positive number.')).toBeInTheDocument();
    expect(weightInput).toHaveValue(0);
    expect(addButton).toBeDisabled(); // Button should be disabled due to the error
  });

  it('clears the error message when user starts typing after an error', async () => {
    render(<AddWeightForm />);

    const weightInput = screen.getByPlaceholderText('Enter weight in kg');
    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    // Trigger an error
    fireEvent.change(weightInput, { target: { value: '-10' } });
    expect(addButton).toBeEnabled();
    fireEvent.click(addButton);
    expect(await screen.findByText('Weight must be a positive number.')).toBeInTheDocument();
    expect(addButton).toBeDisabled(); // Button disabled due to error

    // Start typing a valid number
    fireEvent.change(weightInput, { target: { value: '70' } });
    expect(screen.queryByText('Weight must be a positive number.')).not.toBeInTheDocument();
    expect(addButton).toBeEnabled(); // Button re-enabled after clearing error with valid input
  });

  it('clears the error message on successful submission', async () => {
    const handleWeightAdded = vi.fn();
    render(<AddWeightForm onWeightAdded={handleWeightAdded} />);

    const weightInput = screen.getByPlaceholderText('Enter weight in kg');
    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    // Trigger an error first
    fireEvent.change(weightInput, { target: { value: '-10' } });
    expect(addButton).toBeEnabled();
    fireEvent.click(addButton);
    expect(await screen.findByText('Weight must be a positive number.')).toBeInTheDocument();
    expect(addButton).toBeDisabled(); // Button disabled due to error

    // Correct the input and submit
    fireEvent.change(weightInput, { target: { value: '70' } });
    expect(addButton).toBeEnabled(); // Button re-enabled after correcting input
    fireEvent.click(addButton);

    expect(handleWeightAdded).toHaveBeenCalledWith(70);
    expect(screen.queryByText('Weight must be a positive number.')).not.toBeInTheDocument();
    expect(weightInput).toHaveValue(null);
    expect(addButton).toBeDisabled(); // Button disabled again after clearing input
  });
});
