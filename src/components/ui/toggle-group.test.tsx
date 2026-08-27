import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToggleGroup, ToggleGroupItem } from './toggle-group';
import * as React from 'react'; // For createRef

describe('ToggleGroup', () => {
  it('renders correctly with children', () => {
    render(
      <ToggleGroup type="single" value="option-1" onValueChange={vi.fn()}>
        <ToggleGroupItem value="option-1">Option 1</ToggleGroupItem>
        <ToggleGroupItem value="option-2">Option 2</ToggleGroupItem>
      </ToggleGroup>
    );

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('throws error if ToggleGroupItem is used outside ToggleGroup', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ToggleGroupItem value="isolated">Isolated</ToggleGroupItem>)).toThrow(
      'ToggleGroupItem must be used within a ToggleGroup'
    );
    consoleErrorSpy.mockRestore(); // Restore after the test
  });

  describe('type="single"', () => {
    it('initializes with the correct selected value and default styling', () => {
      render(
        <ToggleGroup type="single" value="option-2" onValueChange={vi.fn()}>
          <ToggleGroupItem value="option-1">Option 1</ToggleGroupItem>
          <ToggleGroupItem value="option-2">Option 2</ToggleGroupItem>
          <ToggleGroupItem value="option-3">Option 3</ToggleGroupItem>
        </ToggleGroup>
      );

      const option1 = screen.getByText('Option 1');
      const option2 = screen.getByText('Option 2');
      const option3 = screen.getByText('Option 3');

      expect(option1).not.toHaveAttribute('aria-pressed', 'true');
      expect(option2).toHaveAttribute('aria-pressed', 'true');
      expect(option3).not.toHaveAttribute('aria-pressed', 'true');

      // Check styling for selected/unselected with default variant and size
      // Unselected default should now have secondary button styling
      expect(option1).toHaveClass('bg-neutral-100');
      expect(option1).toHaveClass('text-neutral-900');
      expect(option2).toHaveClass('bg-blue-600'); // Selected background
      expect(option3).toHaveClass('bg-neutral-100');
      expect(option3).toHaveClass('text-neutral-900');
      expect(option1).toHaveClass('h-10 px-4 py-2'); // Default size
      expect(option2).toHaveClass('h-10 px-4 py-2'); // Default size
    });

    it('applies custom variant to unselected item', () => {
      render(
        <ToggleGroup type="single" value="option-1" onValueChange={vi.fn()}>
          <ToggleGroupItem value="option-1">Option 1</ToggleGroupItem>
          <ToggleGroupItem value="option-2" variant="destructive">Option 2</ToggleGroupItem>
        </ToggleGroup>
      );
      const option2 = screen.getByText('Option 2');
      expect(option2).not.toHaveAttribute('aria-pressed', 'true');
      expect(option2).toHaveClass('bg-red-50'); // Destructive unselected background
    });

    it('applies custom size to items', () => {
      render(
        <ToggleGroup type="single" value="option-1" onValueChange={vi.fn()}>
          <ToggleGroupItem value="option-1" size="sm">Option 1</ToggleGroupItem>
          <ToggleGroupItem value="option-2" size="lg">Option 2</ToggleGroupItem>
        </ToggleGroup>
      );
      const option1 = screen.getByText('Option 1');
      const option2 = screen.getByText('Option 2');

      expect(option1).toHaveClass('h-9 px-3'); // sm size
      expect(option2).toHaveClass('h-11 px-8'); // lg size
    });

    it('selected item overrides variant background and text color', () => {
      render(
        <ToggleGroup type="single" value="option-1" onValueChange={vi.fn()}>
          <ToggleGroupItem value="option-1" variant="destructive">Option 1</ToggleGroupItem>
          <ToggleGroupItem value="option-2">Option 2</ToggleGroupItem>
        </ToggleGroup>
      );
      const option1 = screen.getByText('Option 1');

      expect(option1).toHaveAttribute('aria-pressed', 'true');
      expect(option1).toHaveClass('bg-blue-600'); // Selected state overrides destructive variant
      expect(option1).toHaveClass('text-white'); // Selected state overrides destructive variant
      expect(option1).not.toHaveClass('bg-red-50');
    });

    it('calls onValueChange with the new value when a different item is clicked', () => {
      const handleValueChange = vi.fn();
      render(
        <ToggleGroup type="single" value="option-1" onValueChange={handleValueChange}>
          <ToggleGroupItem value="option-1">Option 1</ToggleGroupItem>
          <ToggleGroupItem value="option-2">Option 2</ToggleGroupItem>
        </ToggleGroup>
      );

      const option2 = screen.getByText('Option 2');
      fireEvent.click(option2);

      expect(handleValueChange).toHaveBeenCalledTimes(1);
      expect(handleValueChange).toHaveBeenCalledWith('option-2');
    });

    it('does not call onValueChange when the already selected item is clicked', () => {
      const handleValueChange = vi.fn();
      render(
        <ToggleGroup type="single" value="option-1" onValueChange={handleValueChange}>
          <ToggleGroupItem value="option-1">Option 1</ToggleGroupItem>
          <ToggleGroupItem value="option-2">Option 2</ToggleGroupItem>
        </ToggleGroup>
      );

      const option1 = screen.getByText('Option 1');
      fireEvent.click(option1); // Clicking the already selected item

      expect(handleValueChange).not.toHaveBeenCalled();
    });

    it('applies custom class names to ToggleGroup', () => {
      render(
        <ToggleGroup type="single" value="option-1" onValueChange={vi.fn()} className="custom-group-class" data-testid="toggle-group">
          <ToggleGroupItem value="option-1">Option 1</ToggleGroupItem>
        </ToggleGroup>
      );
      const groupElement = screen.getByTestId('toggle-group');
      expect(groupElement).toHaveClass('custom-group-class');
      expect(groupElement).toHaveClass('flex'); // Default class
    });

    it('applies custom class names to ToggleGroupItem', () => {
      render(
        <ToggleGroup type="single" value="option-1" onValueChange={vi.fn()}>
          <ToggleGroupItem value="option-1" className="custom-item-class" data-testid="toggle-item">Option 1</ToggleGroupItem>
        </ToggleGroup>
      );
      const itemElement = screen.getByTestId('toggle-item');
      expect(itemElement).toHaveClass('custom-item-class');
      expect(itemElement).toHaveClass('rounded-md'); // Default class
    });

    it('forwards ref to ToggleGroup', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <ToggleGroup type="single" value="option-1" onValueChange={vi.fn()} ref={ref}>
          <ToggleGroupItem value="option-1">Option 1</ToggleGroupItem>
        </ToggleGroup>
      );
      expect(ref.current).toBeInTheDocument();
      expect(ref.current).toHaveTextContent('Option 1');
    });

    it('forwards ref to ToggleGroupItem', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <ToggleGroup type="single" value="option-1" onValueChange={vi.fn()}>
          <ToggleGroupItem value="option-1" ref={ref}>Option 1</ToggleGroupItem>
        </ToggleGroup>
      );
      expect(ref.current).toBeInTheDocument();
      expect(ref.current).toHaveTextContent('Option 1');
    });

    it('should not break if onValueChange is not provided (uncontrolled, though not the primary use case)', () => {
      render(
        <ToggleGroup type="single" value="option-1"> {/* No onValueChange */}
          <ToggleGroupItem value="option-1">Option 1</ToggleGroupItem>
          <ToggleGroupItem value="option-2">Option 2</ToggleGroupItem>
        </ToggleGroup>
      );
      const option2 = screen.getByText('Option 2');
      fireEvent.click(option2);
      // No error should be thrown, and behavior is simply that the UI won't update
      // because `value` prop is still 'option-1'.
      expect(option2).not.toHaveAttribute('aria-pressed', 'true'); // Still not pressed because external state not updated
    });

    it('should handle custom onClick on ToggleGroupItem', () => {
      const handleItemClick = vi.fn();
      const handleValueChange = vi.fn();
      render(
        <ToggleGroup type="single" value="option-1" onValueChange={handleValueChange}>
          <ToggleGroupItem value="option-1">Option 1</ToggleGroupItem>
          <ToggleGroupItem value="option-2" onClick={handleItemClick}>Option 2</ToggleGroupItem>
        </ToggleGroup>
      );
      const option2 = screen.getByText('Option 2');
      fireEvent.click(option2);
      expect(handleItemClick).toHaveBeenCalledTimes(1);
      expect(handleValueChange).toHaveBeenCalledWith('option-2');
    });

    it('should handle custom onClick on ToggleGroupItem even if already selected', () => {
      const handleItemClick = vi.fn();
      const handleValueChange = vi.fn();
      render(
        <ToggleGroup type="single" value="option-1" onValueChange={handleValueChange}>
          <ToggleGroupItem value="option-1" onClick={handleItemClick}>Option 1</ToggleGroupItem>
          <ToggleGroupItem value="option-2">Option 2</ToggleGroupItem>
        </ToggleGroup>
      );
      const option1 = screen.getByText('Option 1');
      fireEvent.click(option1);
      expect(handleItemClick).toHaveBeenCalledTimes(1);
      expect(handleValueChange).not.toHaveBeenCalled(); // But onValueChange should not for already selected
    });
  });
});
