import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react'; // Import React
import { Card } from './Card';
import { Button } from './Button'; // Import Button

describe('Card', () => {
  it('renders correctly with default classes and children', () => {
    render(<Card>Card Content</Card>);
    const cardElement = screen.getByText('Card Content');
    expect(cardElement).toBeInTheDocument();

    // Check for default styling classes
    expect(cardElement).toHaveClass('rounded-lg');
    expect(cardElement).toHaveClass('border');
    expect(cardElement).toHaveClass('bg-card'); // Assuming bg-card is a defined utility or default
    expect(cardElement).toHaveClass('text-card-foreground'); // Assuming text-card-foreground is a defined utility
    expect(cardElement).toHaveClass('shadow-sm');
    expect(cardElement).toHaveClass('p-6');
  });

  it('applies additional custom class names', () => {
    render(<Card className="custom-bg-red-500 extra-padding">Custom Card</Card>);
    const cardElement = screen.getByText('Custom Card');
    expect(cardElement).toBeInTheDocument();
    expect(cardElement).toHaveClass('custom-bg-red-500');
    expect(cardElement).toHaveClass('extra-padding');
    // Ensure default classes are still present
    expect(cardElement).toHaveClass('rounded-lg');
    expect(cardElement).toHaveClass('p-6');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Ref Card</Card>);
    expect(ref.current).toBeInTheDocument();
    expect(ref.current).toHaveTextContent('Ref Card');
  });

  it('passes through arbitrary DOM props', () => {
    render(<Card data-testid="test-card" id="myCard">Prop Card</Card>);
    const cardElement = screen.getByTestId('test-card');
    expect(cardElement).toBeInTheDocument();
    expect(cardElement).toHaveAttribute('id', 'myCard');
  });

  it('renders complex children', () => {
    render(
      <Card>
        <h1>Title</h1>
        <p>A paragraph of text.</p>
        <Button>Action</Button>
      </Card>
    );
    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
    expect(screen.getByText('A paragraph of text.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });
});
