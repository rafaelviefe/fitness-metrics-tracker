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
        'rounded-lg border bg-card text-card-foreground shadow-sm p-6',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export { Card };
