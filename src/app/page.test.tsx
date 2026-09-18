import { describe, it, expect, beforeEach, fireEvent, act } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './page';
import { LocalStorageAdapter } from '@/core/storage/local-storage.adapter';

const UNIT_PREFERENCE_KEY = 'unitPreference';

describe('Home Page', () => {
  // Clear localStorage before each test to ensure a clean state
  beforeEach(() => {
    const localStorageAdapter = new LocalStorageAdapter(window.localStorage);
    localStorageAdapter.clear();
  });

  it('renders the main heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Fitness Metrics Tracker');
  });

  it('shows system status as online', () => {
    render(<Home />);
    const status = screen.getByText(/System Status:/i);
    expect(status).toHaveTextContent('Online');
  });

  it('renders "No weight records found." initially when localStorage is empty', () => {
    render(<Home />);
    expect(screen.getByText('No weight records found. Add some!')).toBeInTheDocument();
  });

  it('displays "No records yet." for all statistics cards initially when localStorage is empty', () => {
    render(<Home />);
    // There are now five WeightStatisticsCard components (latest, highest, lowest, oldest, average), each should show "No records yet."
    const noRecordsMessages = screen.getAllByText('No records yet.');
    expect(noRecordsMessages).toHaveLength(5);
  });

  it('correctly loads and applies the displayUnit preference from localStorage on initial render (lbs)', () => {
    const localStorageAdapter = new LocalStorageAdapter(window.localStorage);
    // Set the unit preference to 'lbs' in localStorage before rendering
    localStorageAdapter.setItem(UNIT_PREFERENCE_KEY, 'lbs');

    render(<Home />);

    // Check if the 'lbs' toggle group item is selected
    const lbsToggle = screen.getByRole('button', { name: 'lbs' });
    const kgToggle = screen.getByRole('button', { name: 'kg' });

    expect(lbsToggle).toHaveAttribute('aria-pressed', 'true');
    expect(kgToggle).toHaveAttribute('aria-pressed', 'false');

    // Verify that the AddWeightForm reflects the 'lbs' preference
    expect(screen.getByLabelText(/Weight \(lbs\)/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Weight \(kg\)/i)).not.toBeInTheDocument();
  });
});
