import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AddWeightForm } from './AddWeightForm';

describe('AddWeightForm', () => {
  it('renders the placeholder text', () => {
    render(<AddWeightForm />);
    expect(screen.getByText('Add Weight Form Placeholder')).toBeInTheDocument();
  });
});