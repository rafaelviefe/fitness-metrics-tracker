import * as React from 'react';
import { useState } from 'react';
import { WeightRecord } from '../types';

interface EditWeightFormProps {
  record: WeightRecord;
  onSave: (updatedRecord: WeightRecord) => void;
  onCancel: () => void;
}

export const EditWeightForm: React.FC<EditWeightFormProps> = ({ record, onSave, onCancel }) => {
  // Helper to format an ISO date string to "YYYY-MM-DDTHH:mm" for datetime-local input
  const formatIsoToDateTimeLocal = (isoDateString: string): string => {
    const date = new Date(isoDateString);
    // toISOString returns UTC time. We need to convert it to local time for datetime-local input.
    // Manually construct the string to avoid timezone issues with toLocaleString which can vary.
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [editedWeight, setEditedWeight] = useState<string>(record.weight.toString());
  const [editedDate, setEditedDate] = useState<string>(formatIsoToDateTimeLocal(record.date));
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      Edit Form for {record.id}
      <p>Initial Weight: {editedWeight}</p>
      <p>Initial Date: {editedDate}</p>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};
