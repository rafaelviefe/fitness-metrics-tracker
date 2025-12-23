import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly with default variant and size', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: 'Click Me' });
    expect(button).toBeInTheDocument();
    // Check specific default classes
    expect(button).toHaveClass(
      'bg-neutral-900 text-neutral-50 hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90'
    );
    expect(button).toHaveClass('h-10 px-4 py-2');
    expect(button).toHaveClass('inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50');
  });

  it('renders with a custom variant (destructive)', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(
      'bg-red-600 text-neutral-50 hover:bg-red-600/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90'
    );
  });

  it('renders with a custom size (lg)', () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole('button', { name: 'Large Button' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('h-11 rounded-md px-8');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Test Click</Button>);
    const button = screen.getByRole('button', { name: 'Test Click' });

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when the disabled prop is true', () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled Button
      </Button>
    );
    const button = screen.getByRole('button', { name: 'Disabled Button' });

    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:pointer-events-none disabled:opacity-50');

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders custom children', () => {
    render(
      <Button>
        <span>Custom Icon</span>
        <span>Text</span>
      </Button>
    );
    expect(screen.getByText('Custom Icon')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('applies additional custom class names', () => {
    render(<Button className="custom-class">Custom Class</Button>);
    const button = screen.getByRole('button', { name: 'Custom Class' });
    expect(button).toHaveClass('custom-class');
  });
});
