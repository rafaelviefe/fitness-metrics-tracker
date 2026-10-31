import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WeightTargetForm } from './WeightTargetForm';
import { convertKgToLbs, convertLbsToKg } from '../utils/weight-utils';

describe('WeightTargetForm', () => {
  let mockOnSave: ReturnType<typeof vi.fn>;
  let mockOnCancel: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnSave = vi.fn();
    mockOnCancel = vi.fn();
  });

  // Test case 1: Renders correctly when initialTargetWeight is null (default kg)
  it('renders correctly when initialTargetWeight is null (default kg)', () => {
    render(
      <WeightTargetForm
        initialTargetWeight={null}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const weightInput = screen.getByLabelText(/Target Weight \(kg\)/i) as HTMLInputElement;
    expect(weightInput).toBeInTheDocument();
    expect(weightInput.value).toBe('');
    expect(weightInput.type).toBe('number');
    expect(weightInput).toHaveAttribute('step', '0.1');
    expect(weightInput).toHaveAttribute('aria-invalid', 'false');

    expect(screen.getByRole('button', { name: 'Save Target' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.queryByText('Target weight must be a positive number.')).not.toBeInTheDocument();
  });

  // Test case 2: Renders correctly when initialTargetWeight is a number (default kg)
  it('renders correctly when initialTargetWeight is a number (default kg)', () => {
    const targetWeightKg = 70.5;
    render(
      <WeightTargetForm
        initialTargetWeight={targetWeightKg}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const weightInput = screen.getByLabelText(/Target Weight \(kg\)/i) as HTMLInputElement;
    expect(weightInput).toBeInTheDocument();
    expect(weightInput.value).toBe(targetWeightKg.toFixed(1));
    expect(weightInput).toHaveAttribute('aria-invalid', 'false');
  });

  // Test case 3: Renders correctly when initialTargetWeight is null (unitPreference lbs)
  it('renders correctly when initialTargetWeight is null (unitPreference lbs)', () => {
    render(
      <WeightTargetForm
        initialTargetWeight={null}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        unitPreference="lbs"
      />
    );

    const weightInput = screen.getByLabelText(/Target Weight \(lbs\)/i) as HTMLInputElement;
    expect(weightInput).toBeInTheDocument();
    expect(weightInput.value).toBe('');
  });

  // Test case 4: Renders correctly when initialTargetWeight is a number (unitPreference lbs)
  it('renders correctly when initialTargetWeight is a number (unitPreference lbs)', () => {
    const targetWeightKg = 70.5;
    const expectedLbs = convertKgToLbs(targetWeightKg).toFixed(1);
    render(
      <WeightTargetForm
        initialTargetWeight={targetWeightKg}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        unitPreference="lbs"
      />
    );

    const weightInput = screen.getByLabelText(/Target Weight \(lbs\)/i) as HTMLInputElement;
    expect(weightInput).toBeInTheDocument();
    expect(weightInput.value).toBe(expectedLbs);
  });

  // Test case 5: Handles valid input change in kg
  it('handles valid input change in kg', () => {
    render(
      <WeightTargetForm
        initialTargetWeight={70}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    const weightInput = screen.getByLabelText(/Target Weight \(kg\)/i) as HTMLInputElement;
    fireEvent.change(weightInput, { target: { value: '72.3' } });
    expect(weightInput.value).toBe('72.3');
  });

  // Test case 6: Handles valid input change in lbs
  it('handles valid input change in lbs', () => {
    render(
      <WeightTargetForm
        initialTargetWeight={70}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        unitPreference="lbs"
      />
    );
    const weightInput = screen.getByLabelText(/Target Weight \(lbs\)/i) as HTMLInputElement;
    fireEvent.change(weightInput, { target: { value: '160.0' } });
    expect(weightInput.value).toBe('160.0');
  });

  // Test case 7: Submits empty input to clear target weight
  it('submits empty input to clear target weight', () => {
    render(
      <WeightTargetForm
        initialTargetWeight={70} // Pre-existing target
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    const weightInput = screen.getByLabelText(/Target Weight \(kg\)/i) as HTMLInputElement;
    const saveButton = screen.getByRole('button', { name: 'Save Target' });

    fireEvent.change(weightInput, { target: { value: '' } }); // Clear input field
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith(null);
    expect(weightInput.value).toBe(''); // Input should remain empty after saving null
    expect(screen.queryByText('Target weight must be a positive number.')).not.toBeInTheDocument();
  });

  // Test case 8: Submits valid weight in kg
  it('submits valid weight in kg', () => {
    const newWeight = '72.8';
    render(
      <WeightTargetForm
        initialTargetWeight={null}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    const weightInput = screen.getByLabelText(/Target Weight \(kg\)/i) as HTMLInputElement;
    const saveButton = screen.getByRole('button', { name: 'Save Target' });

    fireEvent.change(weightInput, { target: { value: newWeight } });
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith(parseFloat(newWeight));
    expect(screen.queryByText('Target weight must be a positive number.')).not.toBeInTheDocument();
  });

  // Test case 9: Submits valid weight in lbs (converted to kg)
  it('submits valid weight in lbs and converts to kg before calling onSave', () => {
    const newWeightLbs = '160.0';
    const expectedWeightKg = convertLbsToKg(parseFloat(newWeightLbs));
    render(
      <WeightTargetForm
        initialTargetWeight={null}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        unitPreference="lbs"
      />
    );
    const weightInput = screen.getByLabelText(/Target Weight \(lbs\)/i) as HTMLInputElement;
    const saveButton = screen.getByRole('button', { name: 'Save Target' });

    fireEvent.change(weightInput, { target: { value: newWeightLbs } });
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith(expect.closeTo(expectedWeightKg));
    expect(screen.queryByText('Target weight must be a positive number.')).not.toBeInTheDocument();
  });

  // Test case 10: Shows error for invalid weight (zero or negative)
  it('shows error for invalid weight (zero or negative)', () => {
    render(
      <WeightTargetForm
        initialTargetWeight={null}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    const weightInput = screen.getByLabelText(/Target Weight \(kg\)/i) as HTMLInputElement;
    const saveButton = screen.getByRole('button', { name: 'Save Target' });

    fireEvent.change(weightInput, { target: { value: '0' } });
    fireEvent.click(saveButton);
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(screen.getByText('Target weight must be a positive number.')).toBeInTheDocument();
    expect(weightInput).toHaveAttribute('aria-invalid', 'true');

    fireEvent.change(weightInput, { target: { value: '-10' } });
    fireEvent.click(saveButton);
    expect(mockOnSave).not.toHaveBeenCalled();
    expect(screen.getByText('Target weight must be a positive number.')).toBeInTheDocument();
    expect(weightInput).toHaveAttribute('aria-invalid', 'true');
  });

  // Test case 11: Attempting non-numeric input clears target (due to type="number" behavior)
  it('attempting non-numeric input clears target (due to type="number" behavior)', () => {
    // Note: When typing non-numeric characters into a type="number" input,
    // e.target.value becomes an empty string. The component correctly handles
    // an empty string input as an intent to clear the target weight.
    render(
      <WeightTargetForm
        initialTargetWeight={70} // A target exists initially
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    const weightInput = screen.getByLabelText(/Target Weight \(kg\)/i) as HTMLInputElement;
    const saveButton = screen.getByRole('button', { name: 'Save Target' });

    fireEvent.change(weightInput, { target: { value: 'abc' } }); // This effectively sets weightInput.value to ''
    fireEvent.click(saveButton);

    // Expect onSave to be called with null, indicating the target is cleared
    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith(null);
    expect(screen.queryByText('Target weight must be a positive number.')).not.toBeInTheDocument();
  });

  // Test case 12: Clears error when valid input is typed after an error
  it('clears error when valid input is typed after an error', () => {
    render(
      <WeightTargetForm
        initialTargetWeight={null}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    const weightInput = screen.getByLabelText(/Target Weight \(kg\)/i) as HTMLInputElement;
    const saveButton = screen.getByRole('button', { name: 'Save Target' });

    fireEvent.change(weightInput, { target: { value: '0' } });
    fireEvent.click(saveButton);
    expect(screen.getByText('Target weight must be a positive number.')).toBeInTheDocument();

    fireEvent.change(weightInput, { target: { value: '75' } });
    expect(screen.queryByText('Target weight must be a positive number.')).not.toBeInTheDocument();
    expect(weightInput).toHaveAttribute('aria-invalid', 'false');
  });

  // Test case 13: Calls onCancel when cancel button is clicked
  it('calls onCancel when cancel button is clicked', () => {
    render(
      <WeightTargetForm
        initialTargetWeight={70}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });

    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  // Test case 14: useEffect updates form when initialTargetWeight prop changes
  it('updates form when initialTargetWeight prop changes', async () => {
    const { rerender } = render(
      <WeightTargetForm
        initialTargetWeight={null}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    const weightInput = screen.getByLabelText(/Target Weight \(kg\)/i) as HTMLInputElement;
    expect(weightInput.value).toBe('');

    // Change initialTargetWeight to a value
    rerender(
      <WeightTargetForm
        initialTargetWeight={80.2}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    // Use waitFor to ensure useEffect has run and state updated
    await waitFor(() => {
      expect(weightInput.value).toBe('80.2');
    });

    // Change initialTargetWeight back to null
    rerender(
      <WeightTargetForm
        initialTargetWeight={null}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    await waitFor(() => {
      expect(weightInput.value).toBe('');
    });
  });

  // Test case 15: useEffect updates form when unitPreference prop changes
  it('updates form when unitPreference prop changes', async () => {
    const initialWeightKg = 70.5;
    const { rerender } = render(
      <WeightTargetForm
        initialTargetWeight={initialWeightKg}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        unitPreference="kg"
      />
    );
    const weightInput = screen.getByLabelText(/Target Weight \(kg\)/i) as HTMLInputElement;
    expect(weightInput.value).toBe(initialWeightKg.toFixed(1));

    // Change unitPreference to lbs
    rerender(
      <WeightTargetForm
        initialTargetWeight={initialWeightKg}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        unitPreference="lbs"
      />
    );
    const weightInputLbs = screen.getByLabelText(/Target Weight \(lbs\)/i) as HTMLInputElement;
    const expectedLbs = convertKgToLbs(initialWeightKg).toFixed(1);
    await waitFor(() => {
      expect(weightInputLbs.value).toBe(expectedLbs);
    });

    // Change unitPreference back to kg
    rerender(
      <WeightTargetForm
        initialTargetWeight={initialWeightKg}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        unitPreference="kg"
      />
    );
    const weightInputKg = screen.getByLabelText(/Target Weight \(kg\)/i) as HTMLInputElement;
    await waitFor(() => {
      expect(weightInputKg.value).toBe(initialWeightKg.toFixed(1));
    });
  });

  // Test case 16: Applies custom className
  it('applies custom className', () => {
    render(
      <WeightTargetForm
        initialTargetWeight={null}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        className="my-custom-target-form"
        data-testid="target-form"
      />
    );
    const formElement = screen.getByTestId('target-form');
    expect(formElement).toHaveClass('my-custom-target-form');
    expect(formElement).toHaveClass('space-y-4'); // Default class
  });

  // Test case 17: Applies formId prop
  it('applies the formId prop to the root form element', () => {
    render(
      <WeightTargetForm
        initialTargetWeight={null}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        formId="unique-target-form"
        aria-label="Set Target Weight Form"
      />
    );
    const formElement = screen.getByRole('form', { name: 'Set Target Weight Form' });
    expect(formElement).toHaveAttribute('id', 'unique-target-form');
  });

  // Test case 18: Clears error state when initialTargetWeight prop changes
  it('clears error state when initialTargetWeight prop changes', async () => {
    const { rerender } = render(
      <WeightTargetForm
        initialTargetWeight={0}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );
    const weightInput = screen.getByLabelText(/Target Weight \(kg\)/i) as HTMLInputElement;
    const saveButton = screen.getByRole('button', { name: 'Save Target' });

    fireEvent.click(saveButton); // Trigger error
    expect(screen.getByText('Target weight must be a positive number.')).toBeInTheDocument();

    rerender(
      <WeightTargetForm
        initialTargetWeight={70.0}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Target weight must be a positive number.')).not.toBeInTheDocument();
      expect(weightInput).toHaveAttribute('aria-invalid', 'false');
    });
  });
});