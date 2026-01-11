import * as React from 'react';
import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface AddWeightFormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

export const AddWeightForm: React.FC<AddWeightFormProps> = ({ className, ...props }) => {
  const [weight, setWeight] = useState<string>('');

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(e.target.value);
  };

  // Prevent default form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle submission logic here (e.g., call a repository method)
    console.log('Submitting weight:', weight);
    setWeight(''); // Clear input after submission
  };

  return (
    <form onSubmit={handleSubmit} className={className} {...props}>
      <Input
        placeholder="Enter weight in kg"
        type="number"
        step="0.1"
        value={weight}
        onChange={handleWeightChange}
        className="mb-2"
      />
      <Button type="submit">Add Weight</Button>
    </form>
  );
};
