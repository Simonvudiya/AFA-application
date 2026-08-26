import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';

interface BorderPoint {
  id: number;
  name: string;
  code: string;
  county: string;
  country: string;
}

interface BorderPointSelectorProps {
  value?: number;
  onChange?: (bpId: number) => void;
  disabled?: boolean;
}

export const BorderPointSelector: React.FC<BorderPointSelectorProps> = ({ value, onChange, disabled }) => {
  const [points, setPoints] = useState<BorderPoint[]>([]);

  useEffect(() => {
    api.get('/border-points').then(res => setPoints(res.data));
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium">Border Point</label>
      <select
        disabled={disabled}
        value={value || ''}
        onChange={(e) => {
          const bpId = Number(e.target.value);
          if (bpId) onChange?.(bpId);
        }}
        className="mt-1 w-full border rounded p-2"
      >
        <option value="">Select border point</option>
        {points.map((bp) => (
          <option key={bp.id} value={bp.id}>{bp.name} ({bp.code}) - {bp.county}</option>
        ))}
      </select>
    </div>
  );
};
