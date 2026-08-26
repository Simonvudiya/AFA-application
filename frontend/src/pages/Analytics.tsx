import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { BarChart } from '../components/charts/BarChart';

export const Analytics: React.FC = () => {
  const [directorateData, setDirectorateData] = useState<{ directorate: string; volume: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    border_point_id: '',
    crop_id: '',
  });

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.border_point_id) params.set('border_point_id', filters.border_point_id);
    if (filters.crop_id) params.set('crop_id', filters.crop_id);
    api.get(`/analytics/directorate-volumes${params.toString() ? `?${params.toString()}` : ''}`).then(res => {
      setDirectorateData(res.data.value || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filters]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-semibold mb-2">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Border Point ID</label>
            <input type="number" value={filters.border_point_id} onChange={e => setFilters({...filters, border_point_id: e.target.value})} className="mt-1 w-full border rounded p-2" placeholder="ID" />
          </div>
          <div>
            <label className="block text-sm font-medium">Crop ID</label>
            <input type="number" value={filters.crop_id} onChange={e => setFilters({...filters, crop_id: e.target.value})} className="mt-1 w-full border rounded p-2" placeholder="ID" />
          </div>
        </div>
      </div>
      {loading ? (
        <div>Loading analytics...</div>
      ) : (
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold">Directorate Volumes</h4>
          {directorateData.length > 0 ? (
            <BarChart data={directorateData} xKey="directorate" yKey="volume" />
          ) : (
            <p className="text-gray-500 mt-4">No analytics data available. Submit consignments to see analytics.</p>
          )}
        </div>
      )}
    </div>
  );
};
