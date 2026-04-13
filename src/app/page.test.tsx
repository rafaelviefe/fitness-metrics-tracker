import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './page';
import { LocalStorageAdapter } from '@/core/storage/local-storage.adapter';

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
    // There are now four WeightStatisticsCard components, each should show "No records yet."
    const noRecordsMessages = screen.getAllByText('No records yet.');
    expect(noRecordsMessages).toHaveLength(4);
  });
});
