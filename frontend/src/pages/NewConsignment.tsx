import React from 'react';
import { useForm } from 'react-hook-form';
import { useOffline } from '../hooks/useOffline';
import { api } from '../api/client';
import { CropSelector } from '../components/forms/CropSelector';
import { BorderPointSelector } from '../components/forms/BorderPointSelector';

interface FormData {
  direction: string;
  quantity: number;
  unit: string;
  vehicleReg?: string;
  traderCompany?: string;
  remarks?: string;
  cropProductId?: number;
}

export const NewConsignment: React.FC = () => {
  const { isOnline, saveOffline } = useOffline();
  const { register, handleSubmit, setValue } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (isOnline) {
      await api.post('/consignments', data);
    } else {
      await saveOffline('consignments', data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <BorderPointSelector disabled />

      <CropSelector onChange={(crop) => setValue('cropProductId', crop.id)} />

      <div>
        <label>Direction</label>
        <select {...register('direction')}>
          <option value="Import into Kenya">Import into Kenya</option>
          <option value="Export from Kenya">Export from Kenya</option>
          <option value="Transit">Transit</option>
          <option value="Re-export">Re-export</option>
        </select>
      </div>

      <div>
        <label>Quantity</label>
        <input type="number" step="0.01" {...register('quantity', { valueAsNumber: true })} />
        <select {...register('unit')}>
          <option value="kg">kg</option>
          <option value="tonnes">tonnes</option>
          <option value="bags">bags</option>
          <option value="crates">crates</option>
          <option value="boxes">boxes</option>
          <option value="bales">bales</option>
          <option value="litres">litres</option>
          <option value="pieces">pieces</option>
          <option value="other">other</option>
        </select>
      </div>

      <div>
        <label>Vehicle Registration</label>
        <input {...register('vehicleReg')} />
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {isOnline ? 'Submit' : 'Save Offline'}
      </button>

      {!isOnline && <p className="text-yellow-600">You are offline. Record will sync later.</p>}
    </form>
  );
};
