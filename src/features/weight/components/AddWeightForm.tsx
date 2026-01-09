import * as React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface AddWeightFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AddWeightForm: React.FC<AddWeightFormProps> = ({ className, ...props }) => {
  const [weight, setWeight] = useState<string>('');

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value);
  };

  return (
    <div className={className} {...props}>
      <Input
        placeholder="Enter weight in kg"
        type="number"
        step="0.1"
        value={weight}
        onChange={handleWeightChange}
      />
      <Button>Add Weight</Button>
    </div>
  );
};
