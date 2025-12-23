import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders correctly with children', () => {
    render(<Card>Hello World</Card>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('applies default card styling classes', () => {
    render(<Card>Test Card</Card>);
    const card = screen.getByText('Test Card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('rounded-lg');
    expect(card).toHaveClass('border');
    expect(card).toHaveClass('bg-neutral-50');
    expect(card).toHaveClass('shadow-sm');
    expect(card).toHaveClass('dark:border-neutral-800');
    expect(card).toHaveClass('dark:bg-neutral-900');
    expect(card).toHaveClass('dark:text-neutral-50');
  });

  it('applies additional custom class names', () => {
    render(<Card className="p-8 bg-blue-100">Custom Card</Card>);
    const card = screen.getByText('Custom Card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('p-8');
    expect(card).toHaveClass('bg-blue-100');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Card ref={ref}>Card with Ref</Card>);
    const card = screen.getByText('Card with Ref');
    expect(ref).toHaveBeenCalledWith(card);
  });

  it('renders with other valid HTML attributes', () => {
    render(<Card id="my-card" data-testid="card-element">Attributed Card</Card>);
    const card = screen.getByTestId('card-element');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('id', 'my-card');
  });
});
