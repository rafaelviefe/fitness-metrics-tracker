import * as React from 'react';
import { WeightRecord } from '../types';

interface EditWeightFormProps {
  record: WeightRecord;
  onSave: (updatedRecord: WeightRecord) => void;
  onCancel: () => void;
}

export const EditWeightForm: React.FC<EditWeightFormProps> = ({ record, onSave, onCancel }) => {
  return (
    <div>
      Edit Form for {record.id}
    </div>
  );
};
