import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EditWeightForm } from './EditWeightForm';
import { WeightRecord } from '../types';

describe('EditWeightForm', () => {
  it('renders correctly with a mock WeightRecord', () => {
    const mockRecord: WeightRecord = {
      id: 'mock-id-123',
      date: '2023-10-27T10:00:00.000Z',
      weight: 80.5,
    };

    render(<EditWeightForm record={mockRecord} />);

    // Verify that the component renders some expected content based on the mock record
    expect(screen.getByText(`Edit Form for ${mockRecord.id}`)).toBeInTheDocument();
  });
});
