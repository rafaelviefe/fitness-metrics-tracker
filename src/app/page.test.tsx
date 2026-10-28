import { describe, it, expect, beforeEach, fireEvent, act } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LocalStorageAdapter } from '@/core/storage/local-storage.adapter';
import Home from './page';
import { convertKgToLbs } from '@/features/weight/utils/weight-utils'; // Import for conversion

const UNIT_PREFERENCE_KEY = 'unitPreference';
const DISPLAY_TIME_PREFERENCE_KEY = 'displayTimePreference';
const SORT_ORDER_PREFERENCE_KEY = 'sortOrderPreference';
const SHOW_ADD_FORM_PREFERENCE_KEY = 'showAddFormPreference'; // NEW: Key for AddForm visibility
const SHOW_TARGET_FORM_PREFERENCE_KEY = 'showTargetFormPreference'; // NEW: Key for TargetForm visibility
const TARGET_WEIGHT_KEY = 'targetWeight'; // NEW: Key for target weight

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
    // There are now six WeightStatisticsCard components (latest, highest, lowest, oldest, average, target), each should show "No records yet."
    const noRecordsMessages = screen.getAllByText('No records yet.');
    expect(noRecordsMessages).toHaveLength(6);
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

  // NEW: Test for showAddForm preference loading from localStorage
  it('hides the AddWeightForm if showAddFormPreference is false in localStorage', () => {
    const localStorageAdapter = new LocalStorageAdapter(window.localStorage);
    localStorageAdapter.setItem(SHOW_ADD_FORM_PREFERENCE_KEY, 'false');

    render(<Home />);

    // The form should not be in the document
    expect(screen.queryByLabelText(/Weight \(kg\)/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Add Weight' })).not.toBeInTheDocument();
  });

  // NEW: Test for showAddForm preference when true or not set
  it('shows the AddWeightForm if showAddFormPreference is true or not set in localStorage', () => {
    // Case 1: 'true' is explicitly set
    const localStorageAdapterTrue = new LocalStorageAdapter(window.localStorage);
    localStorageAdapterTrue.clear(); // Clear for fresh test
    localStorageAdapterTrue.setItem(SHOW_ADD_FORM_PREFERENCE_KEY, 'true');
    const { unmount: unmountTrue } = render(<Home />);
    expect(screen.getByLabelText(/Weight \(kg\)/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Weight' })).toBeInTheDocument();
    unmountTrue();

    // Case 2: No preference is set (should default to true)
    const localStorageAdapterUnset = new LocalStorageAdapter(window.localStorage);
    localStorageAdapterUnset.clear(); // Clear for fresh test
    const { unmount: unmountUnset } = render(<Home />);
    expect(screen.getByLabelText(/Weight \(kg\)/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Weight' })).toBeInTheDocument();
    unmountUnset();
  });

  // NEW: Test for WeightTargetForm being initially hidden when preference is not set
  it('hides the WeightTargetForm initially when no SHOW_TARGET_FORM_PREFERENCE_KEY is set in localStorage', () => {
    // Ensure localStorage is empty for the preference key
    const localStorageAdapter = new LocalStorageAdapter(window.localStorage);
    localStorageAdapter.removeItem(SHOW_TARGET_FORM_PREFERENCE_KEY);

    render(<Home />);

    // The WeightTargetForm should not be visible
    expect(screen.queryByLabelText(/Target Weight \(kg\)/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save Target' })).not.toBeInTheDocument();

    // The toggle button for the target form should say "Set Target Weight" (indicating it's currently hidden)
    expect(screen.getByRole('button', { name: 'Set Target Weight' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Hide Target Form' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Set Target Weight' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows the WeightTargetForm if SHOW_TARGET_FORM_PREFERENCE_KEY is true in localStorage', () => {
    const localStorageAdapter = new LocalStorageAdapter(window.localStorage);
    localStorageAdapter.setItem(SHOW_TARGET_FORM_PREFERENCE_KEY, 'true');

    render(<Home />);

    // The WeightTargetForm should be visible
    expect(screen.getByLabelText(/Target Weight \(kg\)/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save Target' })).toBeInTheDocument();

    // The toggle button for the target form should say "Hide Target Form" (indicating it's currently visible)
    expect(screen.getByRole('button', { name: 'Hide Target Form' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Set Target Weight' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hide Target Form' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('correctly loads and displays the target weight from localStorage on initial render', () => {
    const localStorageAdapter = new LocalStorageAdapter(window.localStorage);
    const testTargetWeightKg = 70.5;
    // Set a target weight in localStorage (stored in KG)
    localStorageAdapter.setItem(TARGET_WEIGHT_KEY, testTargetWeightKg);
    // Ensure default unit preference is kg for this test (it is by default, but explicitly setting won't hurt)
    localStorageAdapter.setItem(UNIT_PREFERENCE_KEY, 'kg');

    render(<Home />);

    // Find the WeightStatisticsCard labeled "Target Weight"
    const targetWeightCard = screen.getByRole('heading', { name: 'Target Weight' }).closest('div');
    expect(targetWeightCard).toBeInTheDocument();

    // Check if the weight is displayed correctly in kg
    expect(screen.getByText('70.5 kg')).toBeInTheDocument();
    // Ensure "No records yet." is not displayed within this specific card
    expect(targetWeightCard).not.toHaveTextContent('No records yet.');
  });

  it('correctly loads and displays the target weight in lbs from localStorage on initial render if unit preference is lbs', () => {
    const localStorageAdapter = new LocalStorageAdapter(window.localStorage);
    const testTargetWeightKg = 70.5;
    const expectedLbs = convertKgToLbs(testTargetWeightKg).toFixed(1);

    // Set a target weight in localStorage (stored in KG)
    localStorageAdapter.setItem(TARGET_WEIGHT_KEY, testTargetWeightKg);
    // Set unit preference to lbs
    localStorageAdapter.setItem(UNIT_PREFERENCE_KEY, 'lbs');

    render(<Home />);

    // Find the WeightStatisticsCard labeled "Target Weight"
    const targetWeightCard = screen.getByRole('heading', { name: 'Target Weight' }).closest('div');
    expect(targetWeightCard).toBeInTheDocument();

    // Check if the weight is displayed correctly in lbs
    expect(screen.getByText(`${expectedLbs} lbs`)).toBeInTheDocument();
    // Ensure "No records yet." is not displayed within this specific card
    expect(targetWeightCard).not.toHaveTextContent('No records yet.');
  });
});
