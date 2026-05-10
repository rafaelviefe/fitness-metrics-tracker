import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { Input } from './Input';

describe('Input', () => {
  it('renders correctly with default type (text) and classes', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
    expect(input.type).toBe('text');
    // Check some default classes
    expect(input).toHaveClass('flex');
    expect(input).toHaveClass('h-10');
    expect(input).toHaveClass('w-full');
    expect(input).toHaveClass('rounded-md');
    expect(input).toHaveClass('border');
    expect(input).toHaveClass('px-3');
    expect(input).toHaveClass('py-2');
    expect(input).not.toHaveClass('border-red-500'); // No error class by default
  });

  it('renders with a custom type (number)', () => {
    render(<Input type="number" data-testid="number-input" />);
    const input = screen.getByTestId('number-input') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.type).toBe('number');
  });

  it('handles onChange events', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} data-testid="test-input" />);
    const input = screen.getByTestId('test-input') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'new value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input.value).toBe('new value'); // React Testing Library updates the value for input elements
  });

  it('displays placeholder text', () => {
    render(<Input placeholder="Search..." />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('is disabled when the disabled prop is true', () => {
    render(
      <Input disabled data-testid="disabled-input" />
    );
    const input = screen.getByTestId('disabled-input') as HTMLInputElement;

    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:cursor-not-allowed disabled:opacity-50');
  });

  it('applies additional custom class names', () => {
    render(<Input className="custom-border custom-padding" data-testid="custom-class-input" />);
    const input = screen.getByTestId('custom-class-input');
    expect(input).toHaveClass('custom-border');
    expect(input).toHaveClass('custom-padding');
    // Ensure default classes are still present
    expect(input).toHaveClass('h-10');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} data-testid="ref-input" />);
    const input = screen.getByTestId('ref-input');
    expect(ref.current).toBe(input);
    expect(ref.current?.tagName).toBe('INPUT');
  });

  it('renders with a predefined value', () => {
    render(<Input value="Initial Value" readOnly data-testid="value-input" />);
    const input = screen.getByTestId('value-input') as HTMLInputElement;
    expect(input.value).toBe('Initial Value');
  });

  it('should handle type="file" without issues', () => {
    render(<Input type="file" data-testid="file-input" />);
    const input = screen.getByTestId('file-input') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.type).toBe('file');
    // Specific classes for file input are present
    expect(input).toHaveClass('file:border-0');
    expect(input).toHaveClass('file:bg-transparent');
  });

  it('applies the id prop to the input element', () => {
    render(<Input id="my-unique-input" data-testid="id-input" />);
    const input = screen.getByTestId('id-input');
    expect(input).toHaveAttribute('id', 'my-unique-input');
  });

  it('applies error styling when isError prop is true', () => {
    render(<Input isError data-testid="error-input" />);
    const input = screen.getByTestId('error-input');
    expect(input).toHaveClass('border-red-500');
    expect(input).toHaveClass('focus-visible:ring-red-500/50');
    // Ensure default border is overridden or not present
    expect(input).not.toHaveClass('border-neutral-200'); // Tailwind merge should handle this correctly
  });

  it('does not apply error styling when isError prop is false', () => {
    render(<Input isError={false} data-testid="no-error-input" />);
    const input = screen.getByTestId('no-error-input');
    expect(input).not.toHaveClass('border-red-500');
    expect(input).not.toHaveClass('focus-visible:ring-red-500');
    expect(input).toHaveClass('border-neutral-200');
  });

  it('does not apply error styling when isError prop is undefined', () => {
    render(<Input data-testid="undefined-error-input" />); // isError is undefined by default
    const input = screen.getByTestId('undefined-error-input');
    expect(input).not.toHaveClass('border-red-500');
    expect(input).not.toHaveClass('focus-visible:ring-red-500');
    expect(input).toHaveClass('border-neutral-200');
  });
});
