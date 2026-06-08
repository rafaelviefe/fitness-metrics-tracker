import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddWeightForm } from './AddWeightForm';
import { formatIsoToDateTimeLocal } from '@/lib/date-utils'; // For comparison with initial date
import { convertLbsToKg } from '../utils/weight-utils'; // Import conversion utility for tests

describe('AddWeightForm', () => {
  let mockOnWeightAdded: ReturnType<typeof vi.fn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  // Use fake timers to control Date.now() and new Date() behavior for consistent initial date
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-11-15T10:00:00.000Z')); // Consistent system time
    mockOnWeightAdded = vi.fn();
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  const getInitialDateTimeLocal = () => formatIsoToDateTimeLocal(new Date('2023-11-15T10:00:00.000Z').toISOString());

  it('renders correctly with default unit preference (kg)', () => {
    render(<AddWeightForm onWeightAdded={mockOnWeightAdded} />);

    const weightInput = screen.getByLabelText(/Weight \(kg\)/i) as HTMLInputElement;
    const dateInput = screen.getByLabelText(/Date & Time/i) as HTMLInputElement;
    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    expect(weightInput).toBeInTheDocument();
    expect(weightInput.value).toBe('');
    expect(weightInput.type).toBe('number');
    expect(weightInput).toHaveAttribute('step', '0.1');
    expect(weightInput).toHaveAttribute('aria-invalid', 'false');

    expect(dateInput).toBeInTheDocument();
    expect(dateInput.value).toBe(getInitialDateTimeLocal());
    expect(dateInput.type).toBe('datetime-local');
    expect(dateInput).toHaveAttribute('aria-invalid', 'false');

    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeDisabled(); // Button disabled initially as weight is empty
    expect(screen.queryByText('Weight must be a positive number.')).not.toBeInTheDocument();
    expect(screen.queryByText('Invalid date selected.')).not.toBeInTheDocument();
  });

  it('renders correctly with unit preference set to lbs', () => {
    render(<AddWeightForm onWeightAdded={mockOnWeightAdded} unitPreference="lbs" />);

    const weightInput = screen.getByLabelText(/Weight \(lbs\)/i) as HTMLInputElement;
    expect(weightInput).toBeInTheDocument();
    expect(weightInput.value).toBe('');
    expect(weightInput.type).toBe('number');
  });

  it('updates weight input value on change', () => {
    render(<AddWeightForm onWeightAdded={mockOnWeightAdded} />);
    const weightInput = screen.getByLabelText(/Weight \(kg\)/i) as HTMLInputElement;

    fireEvent.change(weightInput, { target: { value: '75.3' } });
    expect(weightInput.value).toBe('75.3');
  });

  it('updates date input value on change', () => {
    render(<AddWeightForm onWeightAdded={mockOnWeightAdded} />);
    const dateInput = screen.getByLabelText(/Date & Time/i) as HTMLInputElement;
    const newDateTimeLocal = '2023-11-16T15:45';

    fireEvent.change(dateInput, { target: { value: newDateTimeLocal } });
    expect(dateInput.value).toBe(newDateTimeLocal);
  });

  it('calls onWeightAdded with correct weight and date (ISO string) on valid submission (kg)', () => {
    render(<AddWeightForm onWeightAdded={mockOnWeightAdded} />);
    const weightInput = screen.getByLabelText(/Weight \(kg\)/i) as HTMLInputElement;
    const dateInput = screen.getByLabelText(/Date & Time/i) as HTMLInputElement;
    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    const newWeight = '78.5';
    const newDateTimeLocal = '2023-11-16T12:00'; // Example date time
    const expectedIsoDate = new Date(newDateTimeLocal).toISOString();

    fireEvent.change(weightInput, { target: { value: newWeight } });
    fireEvent.change(dateInput, { target: { value: newDateTimeLocal } });
    expect(addButton).toBeEnabled();

    fireEvent.click(addButton);

    expect(mockOnWeightAdded).toHaveBeenCalledTimes(1);
    expect(mockOnWeightAdded).toHaveBeenCalledWith(parseFloat(newWeight), expectedIsoDate);
    expect(weightInput.value).toBe(''); // Weight input should be cleared
    expect(dateInput.value).toBe(getInitialDateTimeLocal()); // Date input should reset to current time
    expect(addButton).toBeDisabled(); // Button should be disabled again
    expect(screen.queryByText('Weight must be a positive number.')).not.toBeInTheDocument();
    expect(screen.queryByText('Invalid date selected.')).not.toBeInTheDocument();
  });

  it('calls onWeightAdded with weight converted to kg when unitPreference is lbs', () => {
    render(<AddWeightForm onWeightAdded={mockOnWeightAdded} unitPreference="lbs" />);
    const weightInput = screen.getByLabelText(/Weight \(lbs\)/i) as HTMLInputElement;
    const dateInput = screen.getByLabelText(/Date & Time/i) as HTMLInputElement;
    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    const newWeightLbs = '170.0'; // Example weight in lbs
    const newDateTimeLocal = '2023-11-17T09:00';
    const expectedIsoDate = new Date(newDateTimeLocal).toISOString();
    const expectedWeightKg = convertLbsToKg(parseFloat(newWeightLbs));

    fireEvent.change(weightInput, { target: { value: newWeightLbs } });
    fireEvent.change(dateInput, { target: { value: newDateTimeLocal } });
    expect(addButton).toBeEnabled();

    fireEvent.click(addButton);

    expect(mockOnWeightAdded).toHaveBeenCalledTimes(1);
    // Expect onWeightAdded to receive the converted weight in kg
    expect(mockOnWeightAdded).toHaveBeenCalledWith(expect.closeTo(expectedWeightKg), expectedIsoDate);
    expect(weightInput.value).toBe('');
    expect(dateInput.value).toBe(getInitialDateTimeLocal());
    expect(addButton).toBeDisabled();
  });

  it('shows an error for invalid weight (zero) and keeps date valid', () => {
    render(<AddWeightForm onWeightAdded={mockOnWeightAdded} />);
    const weightInput = screen.getByLabelText(/Weight \(kg\)/i) as HTMLInputElement;
    const dateInput = screen.getByLabelText(/Date & Time/i) as HTMLInputElement;
    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    fireEvent.change(weightInput, { target: { value: '0' } });
    fireEvent.click(addButton);

    expect(mockOnWeightAdded).not.toHaveBeenCalled();
    expect(screen.getByText('Weight must be a positive number.')).toBeInTheDocument();
    expect(weightInput).toHaveAttribute('aria-invalid', 'true');
    expect(dateInput).toHaveAttribute('aria-invalid', 'false'); // Date is still valid
    expect(addButton).toBeDisabled();
  });

  it('shows an error for invalid date (empty string) and keeps weight valid', () => {
    render(<AddWeightForm onWeightAdded={mockOnWeightAdded} />);
    const weightInput = screen.getByLabelText(/Weight \(kg\)/i) as HTMLInputElement;
    const dateInput = screen.getByLabelText(/Date & Time/i) as HTMLInputElement;
    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    fireEvent.change(weightInput, { target: { value: '70' } }); // Make weight valid
    fireEvent.change(dateInput, { target: { value: '' } }); // Make date invalid
    fireEvent.click(addButton);

    expect(mockOnWeightAdded).not.toHaveBeenCalled();
    expect(screen.getByText('Invalid date selected.')).toBeInTheDocument();
    expect(dateInput).toHaveAttribute('aria-invalid', 'true');
    expect(weightInput).toHaveAttribute('aria-invalid', 'false'); // Weight is still valid
    expect(addButton).toBeDisabled();
  });

  it('shows both weight and date errors if both are invalid', () => {
    render(<AddWeightForm onWeightAdded={mockOnWeightAdded} />);
    const weightInput = screen.getByLabelText(/Weight \(kg\)/i) as HTMLInputElement;
    const dateInput = screen.getByLabelText(/Date & Time/i) as HTMLInputElement;
    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    fireEvent.change(weightInput, { target: { value: '-10' } }); // Invalid weight
    fireEvent.change(dateInput, { target: { value: 'malformed-date' } }); // Invalid date
    fireEvent.click(addButton);

    expect(mockOnWeightAdded).not.toHaveBeenCalled();
    expect(screen.getByText('Weight must be a positive number.')).toBeInTheDocument();
    expect(screen.getByText('Invalid date selected.')).toBeInTheDocument();
    expect(weightInput).toHaveAttribute('aria-invalid', 'true');
    expect(dateInput).toHaveAttribute('aria-invalid', 'true');
    expect(addButton).toBeDisabled();
    // The console.error for malformed date is logged by formatIsoToDateTimeLocal only during initialization,
    // or if passed to it explicitly during logic that calls it directly with user input.
    // In AddWeightForm, new Date(addedDate) is used for validation, which doesn't trigger formatIsoToDateTimeLocal's console.error.
  });

  it('clears weight error when weight input changes after an error', () => {
    render(<AddWeightForm onWeightAdded={mockOnWeightAdded} />);
    const weightInput = screen.getByLabelText(/Weight \(kg\)/i) as HTMLInputElement;
    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    fireEvent.change(weightInput, { target: { value: '0' } });
    fireEvent.click(addButton);
    expect(screen.getByText('Weight must be a positive number.')).toBeInTheDocument();
    expect(weightInput).toHaveAttribute('aria-invalid', 'true');
    expect(addButton).toBeDisabled();

    fireEvent.change(weightInput, { target: { value: '70' } });
    expect(screen.queryByText('Weight must be a positive number.')).not.toBeInTheDocument();
    expect(weightInput).toHaveAttribute('aria-invalid', 'false');
    // Button is still disabled because initially weight was empty, now it's valid, but date is also valid
    // So the button should be enabled now.
    expect(addButton).toBeEnabled();
  });

  it('clears date error when date input changes after an error', () => {
    render(<AddWeightForm onWeightAdded={mockOnWeightAdded} />);
    const weightInput = screen.getByLabelText(/Weight \(kg\)/i) as HTMLInputElement;
    const dateInput = screen.getByLabelText(/Date & Time/i) as HTMLInputElement;
    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    fireEvent.change(weightInput, { target: { value: '70' } }); // Make weight valid
    fireEvent.change(dateInput, { target: { value: '' } }); // Make date invalid
    fireEvent.click(addButton);
    expect(screen.getByText('Invalid date selected.')).toBeInTheDocument();
    expect(dateInput).toHaveAttribute('aria-invalid', 'true');
    expect(addButton).toBeDisabled();

    fireEvent.change(dateInput, { target: { value: '2023-11-16T10:00' } }); // Make date valid
    expect(screen.queryByText('Invalid date selected.')).not.toBeInTheDocument();
    expect(dateInput).toHaveAttribute('aria-invalid', 'false');
    expect(addButton).toBeEnabled(); // Both are now valid
  });

  it('clears all errors on successful submission', () => {
    render(<AddWeightForm onWeightAdded={mockOnWeightAdded} />);
    const weightInput = screen.getByLabelText(/Weight \(kg\)/i) as HTMLInputElement;
    const dateInput = screen.getByLabelText(/Date & Time/i) as HTMLInputElement;
    const addButton = screen.getByRole('button', { name: 'Add Weight' });

    // Trigger both errors
    fireEvent.change(weightInput, { target: { value: '0' } });
    fireEvent.change(dateInput, { target: { value: '' } });
    fireEvent.click(addButton);
    expect(screen.getByText('Weight must be a positive number.')).toBeInTheDocument();
    expect(screen.getByText('Invalid date selected.')).toBeInTheDocument();
    expect(addButton).toBeDisabled();

    // Correct inputs and submit
    fireEvent.change(weightInput, { target: { value: '75' } });
    fireEvent.change(dateInput, { target: { value: '2023-11-16T11:30' } });
    expect(addButton).toBeEnabled();
    fireEvent.click(addButton);

    expect(mockOnWeightAdded).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Weight must be a positive number.')).not.toBeInTheDocument();
    expect(screen.queryByText('Invalid date selected.')).not.toBeInTheDocument();
    expect(weightInput).toHaveValue(null);
    expect(dateInput.value).toBe(getInitialDateTimeLocal());
    expect(addButton).toBeDisabled();
  });

  it('should apply custom class names', () => {
    render(<AddWeightForm className="my-custom-form" data-testid="add-form" />);
    const formElement = screen.getByTestId('add-form');
    expect(formElement).toHaveClass('my-custom-form');
    expect(formElement).toHaveClass('space-y-4'); // Default class
  });
});