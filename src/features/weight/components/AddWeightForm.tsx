import * as React from 'react';

interface AddWeightFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AddWeightForm: React.FC<AddWeightFormProps> = ({ className, ...props }) => {
  return (
    <div className={className} {...props}>
      {/* This will be the form for adding weight records */}
      <p>Add Weight Form Placeholder</p>
    </div>
  );
};
