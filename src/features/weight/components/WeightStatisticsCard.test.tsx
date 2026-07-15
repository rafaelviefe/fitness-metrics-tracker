import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { WeightStatisticsCard } from './WeightStatisticsCard';
import { WeightRecord } from '../types';
import { convertKgToLbs } from '../utils/weight-utils'; // Import conversion utility

describe('WeightStatisticsCard', () => {
  const mockRecord: WeightRecord = {
    id: 'mock-id-1',
    date: '2023-10-27T14:30:00.000Z',
    weight: 78.9,
  };

  it('renders correctly with a provided record and default displayTime (false) and unit (kg)', () => {
    render(<WeightStatisticsCard record={mockRecord} label="Latest Weight" data-testid="stat-card" />);

    const cardElement = screen.getByTestId('stat-card');
    expect(cardElement).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Latest Weight' })).toBeInTheDocument();
    expect(screen.getByText('78.9 kg')).toBeInTheDocument();
    expect(screen.getByText('October 27, 2023')).toBeInTheDocument();
    expect(screen.queryByText('2:30 PM')).not.toBeInTheDocument(); // Should not display time by default
    expect(screen.queryByText('No records yet.')).not.toBeInTheDocument();

    // Check some default classes for Card and component specific ones
    expect(cardElement).toHaveClass('rounded-lg');
    expect(cardElement).toHaveClass('p-6');
    expect(cardElement).toHaveClass('flex-col');
  });

  it('renders correctly with displayTime set to true', () => {
    render(<WeightStatisticsCard record={mockRecord} label="Latest Weight" displayTime={true} data-testid="stat-card" />);

    expect(screen.getByText('78.9 kg')).toBeInTheDocument();
    expect(screen.getByText('October 27, 2023, 2:30 PM')).toBeInTheDocument(); // Should display date AND time
    expect(screen.queryByText('October 27, 2023')).not.toBeInTheDocument(); // Only date without time should not be present alone
  });

  it('renders correctly with displayTime explicitly set to false', () => {
    render(<WeightStatisticsCard record={mockRecord} label="Latest Weight" displayTime={false} data-testid="stat-card" />);

    expect(screen.getByText('78.9 kg')).toBeInTheDocument();
    expect(screen.getByText('October 27, 2023')).toBeInTheDocument();
    expect(screen.queryByText('2:30 PM')).not.toBeInTheDocument(); // Should not display time
  });

  it('renders weight in lbs when unitPreference is lbs', () => {
    const expectedLbs = convertKgToLbs(mockRecord.weight).toFixed(1); // 78.9 kg * 2.20462 = 173.945898 -> 173.9
    render(<WeightStatisticsCard record={mockRecord} label="Latest Weight" unitPreference="lbs" data-testid="stat-card" />);

    expect(screen.getByText(`${expectedLbs} lbs`)).toBeInTheDocument();
    expect(screen.queryByText(/kg/i)).not.toBeInTheDocument();
  });

  it('renders weight in kg when unitPreference is kg', () => {
    render(<WeightStatisticsCard record={mockRecord} label="Latest Weight" unitPreference="kg" data-testid="stat-card" />);

    expect(screen.getByText('78.9 kg')).toBeInTheDocument();
    expect(screen.queryByText(/lbs/i)).not.toBeInTheDocument();
  });

  it('renders weight in lbs with time when displayTime is true and unitPreference is lbs', () => {
    const expectedLbs = convertKgToLbs(mockRecord.weight).toFixed(1);
    render(<WeightStatisticsCard record={mockRecord} label="Latest Weight" displayTime={true} unitPreference="lbs" data-testid="stat-card" />);

    expect(screen.getByText(`${expectedLbs} lbs`)).toBeInTheDocument();
    expect(screen.getByText('October 27, 2023, 2:30 PM')).toBeInTheDocument();
  });

  it('renders "No records yet." when record is undefined', () => {
    render(<WeightStatisticsCard label="Latest Weight" data-testid="stat-card" />);

    const cardElement = screen.getByTestId('stat-card');
    expect(cardElement).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Latest Weight' })).toBeInTheDocument();
    expect(screen.getByText('No records yet.')).toBeInTheDocument();
    expect(screen.queryByText(/kg/)).not.toBeInTheDocument();
    expect(screen.queryByText(/lbs/)).not.toBeInTheDocument();
    expect(screen.queryByText(/\d{4}/)).not.toBeInTheDocument(); // No date displayed
  });

  it('renders "No records yet." when record is null', () => {
    render(<WeightStatisticsCard record={null} label="Latest Weight" data-testid="stat-card" />);

    expect(screen.getByText('No records yet.')).toBeInTheDocument();
    expect(screen.queryByText(/kg/)).not.toBeInTheDocument();
    expect(screen.queryByText(/lbs/)).not.toBeInTheDocument();
  });

  it('applies additional custom class names', () => {
    render(<WeightStatisticsCard record={mockRecord} label="Latest Weight" className="custom-bg-green-100" data-testid="stat-card" />);
    const cardElement = screen.getByTestId('stat-card');
    expect(cardElement).toHaveClass('custom-bg-green-100');
    expect(cardElement).toHaveClass('flex-col'); // Ensure default classes are still present
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<WeightStatisticsCard record={mockRecord} label="Latest Weight" ref={ref} />);
    expect(ref.current).toBeInTheDocument();
    expect(ref.current).toHaveTextContent('78.9 kg');
  });

  it('passes through arbitrary DOM props', () => {
    render(<WeightStatisticsCard record={mockRecord} label="Latest Weight" id="myStatCard" data-testid="stat-card" />);
    const cardElement = screen.getByTestId('stat-card');
    expect(cardElement).toBeInTheDocument();
    expect(cardElement).toHaveAttribute('id', 'myStatCard');
  });

  it('renders different labels', () => {
    render(<WeightStatisticsCard record={mockRecord} label="Min Weight" />);
    expect(screen.getByRole('heading', { name: 'Min Weight' })).toBeInTheDocument();
  });

  it('renders different weight values', () => {
    const recordWithDifferentWeight = { ...mockRecord, weight: 65.2 };
    render(<WeightStatisticsCard record={recordWithDifferentWeight} label="Latest Weight" />);
    expect(screen.getByText('65.2 kg')).toBeInTheDocument();
  });

  it('renders different dates', () => {
    const recordWithDifferentDate = { ...mockRecord, date: '2022-01-01T00:00:00.000Z' };
    render(<WeightStatisticsCard record={recordWithDifferentDate} label="Latest Weight" />);
    expect(screen.getByText('January 1, 2022')).toBeInTheDocument();
  });

  it('gracefully displays "Invalid Date" when record contains an invalid date string', () => {
    const invalidDateRecord: WeightRecord = {
      id: 'mock-id-invalid-date',
      date: 'this-is-not-a-valid-date',
      weight: 70.0,
    };
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

    render(<WeightStatisticsCard record={invalidDateRecord} label="Latest Weight" />);

    expect(screen.getByText('70 kg')).toBeInTheDocument();
    expect(screen.getByText('Invalid Date')).toBeInTheDocument();
    // Verify that the console.error was called due to the invalid date
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Invalid date string provided to formatDateForDisplay:',
      'this-is-not-a-valid-date'
    );

    consoleErrorSpy.mockRestore();
  });

  it('gracefully displays "Invalid Date" with displayTime=true when record contains an invalid date string', () => {
    const invalidDateRecord: WeightRecord = {
      id: 'mock-id-invalid-date-with-time',
      date: 'yet-another-invalid-date',
      weight: 70.0,
    };
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

    render(<WeightStatisticsCard record={invalidDateRecord} label="Latest Weight" displayTime={true} />);

    expect(screen.getByText('70 kg')).toBeInTheDocument();
    expect(screen.getByText('Invalid Date')).toBeInTheDocument();
    // Verify that the console.error was called due to the invalid date
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Invalid date string provided to formatDateWithTimeForDisplay:',
      'yet-another-invalid-date'
    );

    consoleErrorSpy.mockRestore();
  });

  it('should suppress date display for average weight if record id is "average" (even if displayTime is true)', () => {
    const averageRecord: WeightRecord = {
      id: 'average', 
      date: '2023-10-27T10:00:00.000Z', 
      weight: 75.0,
    };
    render(<WeightStatisticsCard record={averageRecord} label="Average Weight" displayTime={true} />);

    expect(screen.getByText('75 kg')).toBeInTheDocument();
    expect(screen.queryByText(/2023/)).not.toBeInTheDocument(); // Date should be suppressed
    expect(screen.queryByText(/AM|PM/)).not.toBeInTheDocument(); // Time should be suppressed
    expect(screen.queryByText('October 27, 2023, 10:00 AM')).not.toBeInTheDocument(); // Full date with time should be suppressed
  });
});
