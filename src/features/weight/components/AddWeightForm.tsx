import * as React from 'react';
import { Input } from '@/components/ui/Input'; // Import Input component

interface AddWeightFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AddWeightForm: React.FC<AddWeightFormProps> = ({ className, ...props }) => {
  return (
    <div className={className} {...props}>
      <Input placeholder="Enter weight in kg" type="number" step="0.1" />
    </div>
  );
};
