import * as React from 'react';

// Placeholder for cn utility (combine class names with tw-merge compatibility)
// If src/lib/utils.ts with cn is not available, this local cn will be used.
const cn = (...classNames: (string | boolean | undefined | null)[]) => {
  return classNames.filter(Boolean).join(' ');
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border bg-neutral-50 text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-50',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export { Card };
