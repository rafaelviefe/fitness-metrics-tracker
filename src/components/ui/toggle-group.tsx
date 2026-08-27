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

// Replicating Button types to mirror styling without direct import for atomicity
type ToggleGroupItemVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

type ToggleGroupItemSize = 'default' | 'sm' | 'lg' | 'icon';

// ToggleGroupItem component
interface ToggleGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  variant?: ToggleGroupItemVariant; // New prop for styling
  size?: ToggleGroupItemSize;       // New prop for styling
}

const toggleItemBaseClasses =
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-950 dark:focus-visible:ring-neutral-300 ' +
  'disabled:pointer-events-none disabled:opacity-50';

const toggleItemSizeClasses: Record<ToggleGroupItemSize, string> = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
};

// Styles for when an item is NOT selected, based on variant
const toggleItemUnselectedVariantClasses: Record<ToggleGroupItemVariant, string> = {
  // Refined default unselected style to align with a secondary button appearance.
  default:
    'bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80',
  destructive:
    'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900',
  outline:
    'border border-neutral-200 bg-white hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50',
  secondary:
    'bg-neutral-100 text-neutral-900 hover:bg-neutral-100/80 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-800/80',
  ghost:
    'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50',
  link: 'text-gray-900 underline-offset-4 hover:underline dark:text-gray-50',
};

// Styles for when an item IS selected. These are generally strong/primary and override unselected variants.
const toggleItemSelectedClasses =
  'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-800 ' +
  'focus-visible:ring-blue-600'; // Specific ring color for selected state

const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ className, value, onClick, children, variant = 'default', size = 'default', ...props }, ref) => {
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

    const classes = cn(
      toggleItemBaseClasses,
      toggleItemSizeClasses[size],
      isSelected
        ? toggleItemSelectedClasses
        : toggleItemUnselectedVariantClasses[variant],
      className
    );

    return (
      <button
        ref={ref}
        className={classes}
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
