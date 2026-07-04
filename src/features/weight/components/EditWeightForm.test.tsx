import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditWeightForm } from './EditWeightForm';
import { WeightRecord } from '../types';
import { formatIsoToDateTimeLocal } from '@/lib/date-utils'; // Import the utility function
import { convertLbsToKg } from '../utils/weight-utils'; // Import conversion utility

describe('EditWeightForm', () => {
  const mockRecord: WeightRecord = {
    id: 'mock-id-123',
    date: '2023-10-27T10:30:00.000Z',
    weight: 80.5,
  };
  let mockOnSave: ReturnType<typeof vi.fn>;
  let mockOnCancel: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnSave = vi.fn();
    mockOnCancel = vi.fn();
    // Ensure consistent time for tests where formatIsoToDateTimeLocal might fallback
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-11-01T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders correctly with initial weight and date values (kg default)', () => {
    render(<EditWeightForm record={mockRecord} onSave={mockOnSave} onCancel={mockOnCancel} />);

    const weightInput = screen.getByLabelText(/Weight \(kg\)/i) as HTMLInputElement;
    const dateInput = screen.getByLabelText(/Date & Time/i) as HTMLInputElement;

    expect(weightInput).toBeInTheDocument();
    expect(weightInput.value).toBe(mockRecord.weight.toString());
    expect(weightInput.type).toBe('number');
    expect(weightInput).toHaveAttribute('step', '0.1');

    expect(dateInput).toBeInTheDocument();
    // Use the actual utility function for comparison
    expect(dateInput.value).toBe(formatIsoToDateTimeLocal(mockRecord.date));
    expect(dateInput.type).toBe('datetime-local');

    expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.queryByText('Weight must be a positive number.')).not.toBeInTheDocument();
    expect(screen.queryByText('Invalid date selected.')).not.toBeInTheDocument();

    expect(weightInput).toHaveAttribute('aria-invalid', 'false');
    expect(dateInput).toHaveAttribute('aria-invalid', 'false');
  });

  it('renders correctly with initial weight and date values (lbs unitPreference)', () => {
    render(<EditWeightForm record={mockRecord} onSave={mockOnSave} onCancel={mockOnCancel} unitPreference="lbs"/>);

    const weightInput = screen.getByLabelText(/Weight \(lbs\)/i) as HTMLInputElement;

    expect(weightInput).toBeInTheDocument();
    expect(weightInput.value).toBe(mockRecord.weight.toString()); // Value is still kg here, conversion happens on save
  });

  it('updates weight input value on change', () => {
    render(<EditWeightForm record={mockRecord} onSave={mockOnSave} onCancel={mockOnCancel} />);
    const weightInput = screen.getByLabelText(/Weight \(kg\)/i) as HTMLInputElement;

    fireEvent.change(weightInput, { target: { value: '81.2' } });
    expect(weightInput.value).toBe('81.2');
  });

  it('updates date input value on change', () => {
    render(<EditWeightForm record={mockRecord} onSave={mockOnSave} onCancel={mockOnCancel} />);
    const dateInput = screen.getByLabelText(/Date & Time/i) as HTMLInputElement;
    const newDateTimeLocal = '2023-11-15T14:45';

    fireEvent.change(dateInput, { target: { value: newDateTimeLocal } });
    expect(dateInput.value).toBe(newDateTimeLocal);
  });

  it('calls onSave with updated record when form is submitted with valid data (kg)', () => {
    render(<EditWeightForm record={mockRecord} onSave={mockOnSave} onCancel={mockOnCancel} />);
    const weightInput = screen.getByLabelText(/Weight \(kg\)/i) as HTMLInputElement;
    const dateInput = screen.getByLabelText(/Date & Time/i) as HTMLInputElement;
    const saveButton = screen.getByRole('button', { name: 'Save Changes' });

    const newWeight = '82.7';
    const newDateTimeLocal = '2023-11-01T15:30';

    fireEvent.change(weightInput, { target: { value: newWeight } });
    fireEvent.change(dateInput, { target: { value: newDateTimeLocal } });
    fireEvent.click(saveButton); // Submits the form

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith({
      ...mockRecord,
      weight: parseFloat(newWeight),
      date: new Date(newDateTimeLocal).toISOString(), // Should convert to ISO string
    });
    expect(screen.queryByText('Weight must be a positive number.')).not.toBeInTheDocument();
    expect(screen.queryByText('Invalid date selected.')).not.toBeInTheDocument();
    expect(weightInput).toHaveAttribute('aria-invalid', 'false');
    expect(dateInput).toHaveAttribute('aria-invalid', 'false');
  });

  it('calls onSave with updated record (weight converted to kg) when form is submitted with valid data (lbs)', () => {
    render(<EditWeightForm record={mockRecord} onSave={mockOnSave} onCancel={mockOnCancel} unitPreference="lbs"/>);
    const weightInput = screen.getByLabelText(/Weight \(lbs\)/i) as HTMLInputElement;
    const dateInput = screen.getByLabelText(/Date & Time/i) as HTMLInputElement;
    const saveButton = screen.getByRole('button', { name: 'Save Changes' });

    const newWeightLbs = '180.0';
    const newDateTimeLocal = '2023-11-01T15:30';
    const expectedWeightKg = convertLbsToKg(parseFloat(newWeightLbs));

    fireEvent.change(weightInput, { target: { value: newWeightLbs } });
    fireEvent.change(dateInput, { target: { value: newDateTimeLocal } });
    fireEvent.click(saveButton); // Submits the form

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith({
      ...mockRecord,
      weight: expect.closeTo(expectedWeightKg), // Converted to kg
      date: new Date(newDateTimeLocal).toISOString(),
    });
  });

  it('calls onCancel when the Cancel button is clicked', () => {
    render(<EditWeightForm record={mockRecord} onSave={mockOnSave} onCancel={mockOnCancel} />);
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    fireEvent.click(cancelButton);
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('displays an error message for invalid weight (zero) and shows date error if still present', () => {
    render(<EditWeightForm record={mockRecord} onSave={mockOnSave} onCancel={mockOnCancel} />);
    const weightInput = screen.getByLabelText(/Weight \(kg\)/i) as HTMLInputElement;
    const dateInput = screen.getByLabelText(/Date & Time/i) as HTMLInputElement;
    const saveButton = screen.getByRole('button', { name: 'Save Changes' });

    // Simulate a previous date error that should be cleared initially, but will be re-evaluated
    fireEvent.change(dateInput, { target: { value: '' } });
    fireEvent.click(saveButton);
    expect(screen.getByText('Invalid date selected.')).toBeInTheDocument(); // Date error is displayed

    fireEvent.change(weightInput, { target: { value: '0' } });
    fireEvent.click(saveButton); // Submit again with invalid weight and invalid date

    expect(mockOnSave).not.toHaveBeenCalled();
    expect(screen.getByText('Weight must be a positive number.')).toBeInTheDocument(); // Weight error should be present
    expect(screen.getByText('Invalid date selected.')).toBeInTheDocument(); // Date error should still be present
    expect(weightInput).toHaveAttribute('aria-invalid', 'true');
    expect(dateInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('displays an error message for invalid weight (negative) and shows date error if still present', () => {
    render(<EditWeightForm record={mockRecord} onSave={mockOnSave} onCancel={mockOnCancel} />);
    const weightInput = screen.getByLabelText(/Weight \(kg\)/i) as HTMLInputElement;
    const dateInput = screen.getByLabelText(/Date & Time/i) as HTMLInputElement;
    const saveButton = screen.getByRole('button', { name: 'Save Changes' });

    // Simulate a previous date error
    fireEvent.change(dateInput, { target: { value: '' } });
    fireEvent.click(saveButton);
    expect(screen.getByText('Invalid date selected.')).toBeInTheDocument();

    fireEvent.change(weightInput, { target: { value: '-10' } });
    fireEvent.click(saveButton);

    expect(mockOnSave).not.toHaveBeenCalled();
    expect(screen.getByText('Weight must be a positive number.')).toBeInTheDocument();
    expect(screen.getByText('Invalid date selected.')).toBeInTheDocument();
    expect(weightInput).toHaveAttribute('aria-invalid', 'true');
    expect(dateInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('clears weight error message when weight input changes after a weight error', () => {
    render(<EditWeightForm record={mockRecord} onSave={mockOnSave} onCancel={mockOnCancel} />);
    const weightInput = screen.getByLabelText(/Weight \(kg\)/i) as HTMLInputElement;
    const dateInput = screen.getByLabelText(/Date & Time/i) as HTMLInputElement; // Get date input to verify its aria-invalid state
    const saveButton = screen.getByRole('button', { name: 'Save Changes' });

    // Trigger weight error
    fireEvent.change(weightInput, { target: { value: '0' } });
    fireEvent.click(saveButton);
    expect(screen.getByText('Weight must be a positive number.')).toBeInTheDocument();
    expect(weightInput).toHaveAttribute('aria-invalid', 'true');
    expect(dateInput).toHaveAttribute('aria-invalid', 'false'); // Date is valid at this point

    // Clear error by typing valid input in weight field
    fireEvent.change(weightInput, { target: { value: '70' } });
    expect(screen.queryByText('Weight must be a positive number.')).not.toBeInTheDocument();
    expect(weightInput).toHaveAttribute('aria-invalid', 'false');
    expect(dateInput).toHaveAttribute('aria-invalid', 'false'); // Date input should remain valid
  });

  it('should not show an error for initial valid data', () => {
    render(<EditWeightForm record={mockRecord} onSave={mockOnSave} onCancel={mockOnCancel} />);
    expect(screen.queryByText('Weight must be a positive number.')).not.toBeInTheDocument();
    expect(screen.queryByText('Invalid date selected.')).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Weight \(kg\)/i)).toHaveAttribute('aria-invalid', 'false');
    expect(screen.getByLabelText(/Date & Time/i)).toHaveAttribute('aria-invalid', 'false');
  });

  it('applies additional custom class names', () => {
    render(<EditWeightForm record={mockRecord} onSave={mockOnSave} onCancel={mockOnCancel} className="custom-form-style" data-testid="edit-form"/>);
    const formElement = screen.getByTestId('edit-form');
    expect(formElement).toHaveClass('custom-form-style');
    expect(formElement).toHaveClass('space-y-4'); // Default class
  });

  it('handles invalid initial date string gracefully by falling back to current time', () => {
    const invalidDateRecord: WeightRecord = {
      id: 'mock-id-invalid-date',
      date: 'invalid-date-string',
      weight: 70
    };
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<EditWeightForm record={invalidDateRecord} onSave={mockOnSave} onCancel={mockOnCancel} />);

    const dateInput = screen.getByLabelText(/Date & Time/i) as HTMLInputElement;
    const now = new Date();
    // Use the actual utility function for the expected fallback
    const expectedFallbackDate = formatIsoToDateTimeLocal(now.toISOString());
    expect(dateInput.value).toBe(expectedFallbackDate);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Invalid date string provided to formatIsoToDateTimeLocal:", "invalid-date-string");

    consoleErrorSpy.mockRestore();
  });

  it('shows an error if date input is cleared/invalid during submission and shows weight error if still present', () => {
    render(<EditWeightForm record={mockRecord} onSave={mockOnSave} onCancel={mockOnCancel} />);
    const weightInput = screen.getByLabelText(/Weight \(kg\)/i) as HTMLInputElement;
    const dateInput = screen.getByLabelText(/Date & Time/i) as HTMLInputElement;
    const saveButton = screen.getByRole('button', { name: 'Save Changes' });

    // Simulate a previous weight error
    fireEvent.change(weightInput, { target: { value: '0' } });
    fireEvent.click(saveButton);
    expect(screen.getByText('Weight must be a positive number.')).toBeInTheDocument(); // Weight error is present

    fireEvent.change(dateInput, { target: { value: '' } }); // Clear the date input
    fireEvent.click(saveButton);

    expect(mockOnSave).not.toHaveBeenCalled();
    expect(screen.getByText('Invalid date selected.')).toBeInTheDocument(); // Date error should be present
    expect(screen.getByText('Weight must be a positive number.')).toBeInTheDocument(); // Weight error should still be present
    expect(dateInput).toHaveAttribute('aria-invalid', 'true');
    expect(weightInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('clears date error message when date input changes after a date error', () => {
    render(<EditWeightForm record={mockRecord} onSave={mockOnSave} onCancel={mockOnCancel} />);
    const weightInput = screen.getByLabelText(/Weight \(kg\)/i) as HTMLInputElement; // Get weight input to verify its aria-invalid state
    const dateInput = screen.getByLabelText(/Date & Time/i) as HTMLInputElement;
    const saveButton = screen.getByRole('button', { name: 'Save Changes' });

    // Trigger date error
    fireEvent.change(dateInput, { target: { value: '' } });
    fireEvent.click(saveButton);
    expect(screen.getByText('Invalid date selected.')).toBeInTheDocument();
    expect(dateInput).toHaveAttribute('aria-invalid', 'true');
    expect(weightInput).toHaveAttribute('aria-invalid', 'false'); // Weight input is initially valid

    // Clear error by typing valid input in date field
    fireEvent.change(dateInput, { target: { value: '2023-11-01T10:00' } });
    expect(screen.queryByText('Invalid date selected.')).not.toBeInTheDocument();
    expect(dateInput).toHaveAttribute('aria-invalid', 'false');
    expect(weightInput).toHaveAttribute('aria-invalid', 'false'); // Weight input should remain valid
  });
});
