import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { WeightRecordCard } from './WeightRecordCard';
import { WeightRecord } from '../types';
import { convertKgToLbs } from '../utils/weight-utils';

describe('WeightRecordCard', () => {
  const mockRecord: WeightRecord = {
    id: '123',
    date: '2023-10-27T10:00:00.000Z',
    weight: 75.5,
  };

  it('renders the weight record date and weight correctly with default kg unit and no time', () => {
    render(<WeightRecordCard record={mockRecord} />);

    // Check for formatted date string (adjust based on locale if needed, 'en-US' used in component)
    expect(screen.getByText('October 27, 2023')).toBeInTheDocument();
    expect(screen.queryByText(/10:00 AM/i)).not.toBeInTheDocument(); // Time should NOT be present by default
    expect(screen.getByText('75.5 kg')).toBeInTheDocument();
  });

  it('renders the weight record date and weight correctly with kg unit explicitly set and no time', () => {
    render(<WeightRecordCard record={mockRecord} unitPreference="kg" displayTime={false} />);

    expect(screen.getByText('October 27, 2023')).toBeInTheDocument();
    expect(screen.queryByText(/10:00 AM/i)).not.toBeInTheDocument();
    expect(screen.getByText('75.5 kg')).toBeInTheDocument();
    expect(screen.queryByText(/lbs/i)).not.toBeInTheDocument();
  });

  it('renders the weight record with lbs unit when unitPreference is lbs and no time', () => {
    const expectedLbs = convertKgToLbs(mockRecord.weight).toFixed(1);
    render(<WeightRecordCard record={mockRecord} unitPreference="lbs" displayTime={false} />);

    expect(screen.getByText('October 27, 2023')).toBeInTheDocument();
    expect(screen.queryByText(/10:00 AM/i)).not.toBeInTheDocument();
    expect(screen.getByText(`${expectedLbs} lbs`)).toBeInTheDocument();
    expect(screen.queryByText(/kg/i)).not.toBeInTheDocument();
  });

  it('renders the date with time when displayTime is true', () => {
    render(<WeightRecordCard record={mockRecord} displayTime={true} />);

    expect(screen.getByText('October 27, 2023, 10:00 AM')).toBeInTheDocument();
    expect(screen.queryByText('October 27, 2023')).not.toBeInTheDocument(); // Ensure it's not rendering just date
    expect(screen.getByText('75.5 kg')).toBeInTheDocument();
  });

  it('renders the date with time when displayTime is true and unitPreference is lbs', () => {
    const expectedLbs = convertKgToLbs(mockRecord.weight).toFixed(1);
    render(<WeightRecordCard record={mockRecord} displayTime={true} unitPreference="lbs" />);

    expect(screen.getByText('October 27, 2023, 10:00 AM')).toBeInTheDocument();
    expect(screen.getByText(`${expectedLbs} lbs`)).toBeInTheDocument();
  });

  it('applies additional custom class names', () => {
    render(<WeightRecordCard record={mockRecord} className="custom-card-style" data-testid="weight-card"/>);
    const cardElement = screen.getByTestId('weight-card');
    expect(cardElement).toHaveClass('custom-card-style');
    // Ensure default classes are still present (from Card and base styling)
    expect(cardElement).toHaveClass('rounded-lg');
    expect(cardElement).toHaveClass('flex');
    expect(cardElement).toHaveClass('justify-between');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<WeightRecordCard record={mockRecord} ref={ref} />);
    expect(ref.current).toBeInTheDocument();
    expect(ref.current).toHaveTextContent('75.5 kg');
  });

  it('passes through arbitrary DOM props', () => {
    render(<WeightRecordCard record={mockRecord} id="myWeightCard" data-testid="weight-card" />);
    const cardElement = screen.getByTestId('weight-card');
    expect(cardElement).toHaveAttribute('id', 'myWeightCard');
  });

  it('renders different weight values in kg', () => {
    const recordWithDifferentWeight = { ...mockRecord, weight: 80.2 };
    render(<WeightRecordCard record={recordWithDifferentWeight} />);
    expect(screen.getByText('80.2 kg')).toBeInTheDocument();
  });

  it('renders different weight values in lbs', () => {
    const recordWithDifferentWeight = { ...mockRecord, weight: 80.2 };
    const expectedLbs = convertKgToLbs(recordWithDifferentWeight.weight).toFixed(1);
    render(<WeightRecordCard record={recordWithDifferentWeight} unitPreference="lbs" />);
    expect(screen.getByText(`${expectedLbs} lbs`)).toBeInTheDocument();
  });

  it('renders different dates without time', () => {
    const recordWithDifferentDate = { ...mockRecord, date: '2022-05-15T08:30:00.000Z' };
    render(<WeightRecordCard record={recordWithDifferentDate} displayTime={false} />);
    expect(screen.getByText('May 15, 2022')).toBeInTheDocument();
    expect(screen.queryByText(/08:30 AM/i)).not.toBeInTheDocument();
  });

  it('renders different dates with time', () => {
    const recordWithDifferentDate = { ...mockRecord, date: '2022-05-15T08:30:00.000Z' };
    render(<WeightRecordCard record={recordWithDifferentDate} displayTime={true} />);
    expect(screen.getByText('May 15, 2022, 8:30 AM')).toBeInTheDocument();
  });

  it('calls onDelete with the record id when the delete button is clicked', () => {
    const handleDelete = vi.fn();
    render(<WeightRecordCard record={mockRecord} onDelete={handleDelete} />);

    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(deleteButton);

    expect(handleDelete).toHaveBeenCalledTimes(1);
    expect(handleDelete).toHaveBeenCalledWith(mockRecord.id);
  });

  it('does not call onDelete if the prop is not provided and delete button is clicked', () => {
    const consoleSpy = vi.spyOn(console, 'error'); // Using console.error for consistency with adapter error logging
    consoleSpy.mockImplementation(() => {}); // Suppress console output for this test

    render(<WeightRecordCard record={mockRecord} />); // No onDelete prop

    const deleteButton = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(deleteButton);

    expect(consoleSpy).not.toHaveBeenCalled(); // No error should be logged for missing onDelete prop
    consoleSpy.mockRestore();
  });

  it('calls onEdit with the record when the edit button is clicked', () => {
    const handleEdit = vi.fn();
    render(<WeightRecordCard record={mockRecord} onEdit={handleEdit} />);

    const editButton = screen.getByRole('button', { name: 'Edit' });
    fireEvent.click(editButton);

    expect(handleEdit).toHaveBeenCalledTimes(1);
    expect(handleEdit).toHaveBeenCalledWith(mockRecord);
  });

  it('does not call onEdit if the prop is not provided and edit button is clicked', () => {
    const consoleSpy = vi.spyOn(console, 'error');
    consoleSpy.mockImplementation(() => {});

    render(<WeightRecordCard record={mockRecord} />); // No onEdit prop

    const editButton = screen.getByRole('button', { name: 'Edit' });
    fireEvent.click(editButton);

    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('gracefully displays "Invalid Date" when provided with an invalid date string (no time)', () => {
    const invalidDateRecord: WeightRecord = {
      id: '456',
      date: 'this-is-not-a-date',
      weight: 60.0,
    };
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<WeightRecordCard record={invalidDateRecord} displayTime={false} />);

    expect(screen.getByText('Invalid Date')).toBeInTheDocument();
    expect(screen.getByText('60 kg')).toBeInTheDocument();
    // Verify that the console.error was called due to the invalid date
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Invalid date string provided to formatDateForDisplay:',
      'this-is-not-a-date'
    );

    consoleErrorSpy.mockRestore();
  });

  it('gracefully displays "Invalid Date" when provided with an invalid date string (with time)', () => {
    const invalidDateRecord: WeightRecord = {
      id: '456',
      date: 'another-invalid-date-string',
      weight: 60.0,
    };
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<WeightRecordCard record={invalidDateRecord} displayTime={true} />);

    expect(screen.getByText('Invalid Date')).toBeInTheDocument();
    expect(screen.getByText('60 kg')).toBeInTheDocument();
    // Verify that the console.error was called due to the invalid date
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Invalid date string provided to formatDateWithTimeForDisplay:',
      'another-invalid-date-string'
    );

    consoleErrorSpy.mockRestore();
  });
});
