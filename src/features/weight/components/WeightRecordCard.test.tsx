import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { WeightRecordCard } from './WeightRecordCard';
import { WeightRecord } from '../types';

describe('WeightRecordCard', () => {
  const mockRecord: WeightRecord = {
    id: '123',
    date: '2023-10-27T10:00:00.000Z',
    weight: 75.5,
  };

  it('renders the weight record date and weight correctly', () => {
    render(<WeightRecordCard record={mockRecord} />);

    // Check for formatted date string (adjust based on locale if needed, 'en-US' used in component)
    expect(screen.getByText('October 27, 2023')).toBeInTheDocument();
    expect(screen.getByText('75.5 kg')).toBeInTheDocument();
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

  it('renders different weight values', () => {
    const recordWithDifferentWeight = { ...mockRecord, weight: 80.2 };
    render(<WeightRecordCard record={recordWithDifferentWeight} />);
    expect(screen.getByText('80.2 kg')).toBeInTheDocument();
  });

  it('renders different dates', () => {
    const recordWithDifferentDate = { ...mockRecord, date: '2022-05-15T08:30:00.000Z' };
    render(<WeightRecordCard record={recordWithDifferentDate} />);
    expect(screen.getByText('May 15, 2022')).toBeInTheDocument();
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
});
