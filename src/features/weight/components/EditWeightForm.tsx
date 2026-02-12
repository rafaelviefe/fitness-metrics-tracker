import * as React from 'react';
import { WeightRecord } from '../types';

interface EditWeightFormProps {
  record: WeightRecord;
}

export const EditWeightForm: React.FC<EditWeightFormProps> = ({ record }) => {
  return (
    <div>
      Edit Form for {record.id}
    </div>
  );
};
