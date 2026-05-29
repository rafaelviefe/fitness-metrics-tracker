import * as React from 'react';
import { cn } from '@/lib/utils';

// Context for ToggleGroup to share state with its items
interface ToggleGroupContextType {
  value: string | undefined; // 'single' type implies a single string or undefined
  onValueChange: ((itemValue: string) => void) | undefined;
}

const ToggleGroupContext = React.createContext<ToggleGroupContextType | undefined>(undefined);

// ToggleGroup component
interface ToggleGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  type: 'single'; // Currently only 'single' is supported as per task
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ className, type, value, onValueChange, children, ...props }, ref) => {
    const contextValue = React.useMemo(() => ({
      value,
      onValueChange,
    }), [value, onValueChange]);

    return (
      <ToggleGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn('flex gap-1', className)} // Minimal styling for layout
          {...props}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    );
  }
);
ToggleGroup.displayName = 'ToggleGroup';

// ToggleGroupItem component
interface ToggleGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ className, value, onClick, children, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext);

    if (context === undefined) {
      throw new Error('ToggleGroupItem must be used within a ToggleGroup');
    }

    const isSelected = context.value === value;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      // Only call onValueChange if the item is not already selected or if context.onValueChange is provided
      if (!isSelected && context.onValueChange) {
        context.onValueChange(value);
      }
      onClick?.(event); // Propagate original onClick if provided
    };

    return (
      <button
        ref={ref}
        className={cn(
          'px-4 py-2 rounded-md text-sm font-medium transition-colors',
          isSelected
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600',
          className
        )}
        onClick={handleClick}
        aria-pressed={isSelected}
        {...props}
      >
        {children}
      </button>
    );
  }
);
ToggleGroupItem.displayName = 'ToggleGroupItem';

export { ToggleGroup, ToggleGroupItem };
