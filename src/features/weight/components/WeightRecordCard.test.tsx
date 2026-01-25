import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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

  it('accepts an onDelete prop (function) without issues', () => {
    const handleDelete = vi.fn();
    render(<WeightRecordCard record={mockRecord} onDelete={handleDelete} data-testid="weight-card" />);
    const cardElement = screen.getByTestId('weight-card');
    expect(cardElement).toBeInTheDocument();
    // No direct UI interaction for onDelete in this component yet, just verifying prop acceptance.
    expect(handleDelete).not.toHaveBeenCalled();
  });
});
