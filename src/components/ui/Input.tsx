import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  isError?: boolean; // New prop for error state
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, id, isError, ...props }, ref) => {
    return (
      <input
        id={id}
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          'dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300',
          // Conditional border styling based on isError prop
          isError
            ? 'border border-red-500 focus-visible:ring-red-500/50'
            : 'border border-neutral-200 dark:border-neutral-800',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
