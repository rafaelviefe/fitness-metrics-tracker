import { describe, it, expect, beforeEach, fireEvent, act } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LocalStorageAdapter } from '@/core/storage/local-storage.adapter';
import Home from './page';

const UNIT_PREFERENCE_KEY = 'unitPreference';
const DISPLAY_TIME_PREFERENCE_KEY = 'displayTimePreference';
const SORT_ORDER_PREFERENCE_KEY = 'sortOrderPreference';

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

  it('correctly loads and applies the displayTime preference from localStorage on initial render, ensuring "Date & Time" is active if set', () => {
    const localStorageAdapter = new LocalStorageAdapter(window.localStorage);
    // Set the display time preference to 'true' in localStorage before rendering
    localStorageAdapter.setItem(DISPLAY_TIME_PREFERENCE_KEY, 'true');

    render(<Home />);

    // Check if the 'Date & Time' toggle group item is selected
    const dateTimeToggle = screen.getByRole('button', { name: 'Date & Time' });
    const dateOnlyToggle = screen.getByRole('button', { name: 'Date Only' });

    expect(dateTimeToggle).toHaveAttribute('aria-pressed', 'true');
    expect(dateOnlyToggle).toHaveAttribute('aria-pressed', 'false');

    // Optionally, you could also verify that a WeightRecordCard, if present, would display time.
    // Since there are no records initially, this check is limited to the toggle button state.
  });

  it('correctly loads and applies the sortOrder preference from localStorage on initial render, ensuring the correct sort toggle is active if set', () => {
    const localStorageAdapter = new LocalStorageAdapter(window.localStorage);
    // Set a specific sort order preference in localStorage before rendering
    const preferredSortOrder = 'weight_asc';
    localStorageAdapter.setItem(SORT_ORDER_PREFERENCE_KEY, preferredSortOrder);

    render(<Home />);

    // Get all sort order toggle buttons using their aria-label as the accessible name
    const dateNewestToggle = screen.getByRole('button', { name: 'Sort by date, newest first' });
    const dateOldestToggle = screen.getByRole('button', { name: 'Sort by date, oldest first' });
    const weightHighestToggle = screen.getByRole('button', { name: 'Sort by weight, highest first' });
    const weightLowestToggle = screen.getByRole('button', { name: 'Sort by weight, lowest first' });

    // Assert that the preferred sort order button is active
    expect(weightLowestToggle).toHaveAttribute('aria-pressed', 'true');

    // Assert that other sort order buttons are not active
    expect(dateNewestToggle).toHaveAttribute('aria-pressed', 'false');
    expect(dateOldestToggle).toHaveAttribute('aria-pressed', 'false');
    expect(weightHighestToggle).toHaveAttribute('aria-pressed', 'false');
  });
});
