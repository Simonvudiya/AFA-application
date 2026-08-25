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
  value?: BorderPoint;
  onChange?: (bp: BorderPoint) => void;
  disabled?: boolean;
}

export const BorderPointSelector: React.FC<BorderPointSelectorProps> = ({ value, onChange, disabled }) => {
  const [points, setPoints] = useState<BorderPoint[]>([]);

  useEffect(() => {
    api.get('/border-points').then(res => setPoints(res.data));
  }, []);

  return (
    <select
      disabled={disabled}
      value={value?.id || ''}
      onChange={(e) => {
        const bp = points.find((p) => p.id === Number(e.target.value));
        onChange?.(bp!);
      }}
    >
      <option value="">Select border point</option>
      {points.map((bp) => (
        <option key={bp.id} value={bp.id}>{bp.name} ({bp.code})</option>
      ))}
    </select>
  );
};
