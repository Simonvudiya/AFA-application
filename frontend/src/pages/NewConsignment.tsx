import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { CropSelector } from '../components/forms/CropSelector';
import { BorderPointSelector } from '../components/forms/BorderPointSelector';

interface FormData {
  border_point_id: number;
  crop_product_id: number;
  crop_id: number;
  directorate_id?: number;
  department_id?: number;
  direction: string;
  quantity: number;
  unit: string;
  country_origin?: string;
  country_destination?: string;
  vehicle_reg?: string;
  trader_company?: string;
  transporter?: string;
  permit_number?: string;
  packaging_type?: string;
  no_of_packages?: number;
  purpose?: string;
  variety?: string;
  inspection_status?: string;
  remarks?: string;
  gps_coordinates?: string;
  time_of_entry?: string;
}

export const NewConsignment: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ reference: string; id: number } | null>(null);
  const [directorateName, setDirectorateName] = useState('');
  const [departmentName, setDepartmentName] = useState('');
  const { register, handleSubmit, control, setValue, watch, reset } = useForm<FormData>({
    defaultValues: {
      border_point_id: (user as any)?.border_point_id || undefined,
      direction: 'Import into Kenya',
    },
  });

  useEffect(() => {
    const bpId = (user as any)?.border_point_id;
    if (bpId) {
      setValue('border_point_id', bpId);
    }
  }, [user, setValue]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setError('');
    try {
      const res = await api.post('/consignments', data);
      setSuccess({ reference: res.data.reference, id: res.data.id });
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to submit consignment');
    } finally {
      setSubmitting(false);
    }
  };

  const cropId = watch('crop_id');

  useEffect(() => {
    if (cropId) {
      api.get(`/crops`).then(res => {
        const crop = res.data.find((c: any) => c.id === cropId);
        if (crop) {
          setDirectorateName(crop.directorate_name || '');
          setDepartmentName(crop.department_name || '');
        }
      }).catch(() => {});
    }
  }, [cropId]);

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded p-6 text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-2">Submission Successful</h2>
          <p className="text-green-700 mb-4">Consignment {success.reference} has been recorded successfully.</p>
          <div className="flex justify-center space-x-3">
            <button onClick={() => navigate(`/my-records`)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Go to My Records</button>
            <button onClick={() => { setSuccess(null); reset(); }} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add Another Consignment</button>
            <button onClick={() => navigate('/dashboard')} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">Go to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">New Consignment</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">A. Border Point Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="border_point_id"
              control={control}
              rules={{ required: 'Border point is required' }}
              render={({ field }) => (
                <BorderPointSelector
                  value={field.value}
                  onChange={(bpId) => field.onChange(bpId)}
                />
              )}
            />
            <div>
              <label className="block text-sm font-medium">Direction</label>
              <select {...register('direction', { required: 'Direction is required' })} className="mt-1 w-full border rounded p-2">
                <option value="Import into Kenya">Import into Kenya</option>
                <option value="Export from Kenya">Export from Kenya</option>
                <option value="Transit">Transit</option>
                <option value="Re-export">Re-export</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Date</label>
              <input type="date" {...register('time_of_entry')} className="mt-1 w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Time</label>
              <input type="time" {...register('time_of_entry')} className="mt-1 w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Country of Origin</label>
              <input {...register('country_origin')} className="mt-1 w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Country of Destination</label>
              <input {...register('country_destination')} className="mt-1 w-full border rounded p-2" />
            </div>
          </div>
        </section>

        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">B. Crop Classification</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="crop_product_id"
              control={control}
              rules={{ required: 'Crop product is required' }}
              render={({ field }) => (
                <CropSelector onChange={(crop) => { field.onChange(crop.id); setValue('crop_id', crop.crop_id || crop.id); }} />
              )}
            />
            <div>
              <label className="block text-sm font-medium">Directorate</label>
              <input value={directorateName} readOnly className="mt-1 w-full border rounded p-2 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium">Department</label>
              <input value={departmentName} readOnly className="mt-1 w-full border rounded p-2 bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium">Variety</label>
              <input {...register('variety')} className="mt-1 w-full border rounded p-2" />
            </div>
          </div>
        </section>

        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">C. Consignment Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Quantity</label>
              <div className="flex space-x-2 mt-1">
                <input type="number" step="0.01" {...register('quantity', { valueAsNumber: true, required: 'Quantity is required', min: 0 })} className="border rounded p-2 flex-1" />
                <select {...register('unit', { required: 'Unit is required' })} className="border rounded p-2">
                  <option value="">Unit</option>
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
            </div>
            <div>
              <label className="block text-sm font-medium">Packaging Type</label>
              <select {...register('packaging_type')} className="mt-1 w-full border rounded p-2">
                <option value="">Select packaging</option>
                <option value="bags">Bags</option>
                <option value="crates">Crates</option>
                <option value="boxes">Boxes</option>
                <option value="bales">Bales</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Number of Packages</label>
              <input type="number" {...register('no_of_packages', { valueAsNumber: true })} className="mt-1 w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Purpose / Use</label>
              <input {...register('purpose')} className="mt-1 w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Vehicle Registration</label>
              <input {...register('vehicle_reg')} className="mt-1 w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Transporter</label>
              <input {...register('transporter')} className="mt-1 w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Trader / Company</label>
              <input {...register('trader_company')} className="mt-1 w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Permit / Certificate Number</label>
              <input {...register('permit_number')} className="mt-1 w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">Inspection Status</label>
              <select {...register('inspection_status')} className="mt-1 w-full border rounded p-2">
                <option value="">Select status</option>
                <option value="pending">Pending</option>
                <option value="cleared">Cleared</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium">Remarks</label>
              <textarea {...register('remarks')} className="mt-1 w-full border rounded p-2" rows={3} />
            </div>
          </div>
        </section>

        <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50 w-full md:w-auto">
          {submitting ? 'Submitting...' : 'Submit Consignment'}
        </button>
      </form>
    </div>
  );
};
