import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

export const Reports: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    border_point_id: '',
    crop_id: '',
    direction: '',
    status: '',
  });

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.border_point_id) params.set('border_point_id', filters.border_point_id);
    if (filters.crop_id) params.set('crop_id', filters.crop_id);
    if (filters.direction) params.set('direction', filters.direction);
    if (filters.status) params.set('status', filters.status);
    api.get(`/reports/national/summary${params.toString() ? `?${params.toString()}` : ''}`).then(res => {
      setSummary(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filters]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-semibold mb-2">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium">Border Point</label>
            <input type="number" value={filters.border_point_id} onChange={e => setFilters({...filters, border_point_id: e.target.value})} className="mt-1 w-full border rounded p-2" placeholder="ID" />
          </div>
          <div>
            <label className="block text-sm font-medium">Crop ID</label>
            <input type="number" value={filters.crop_id} onChange={e => setFilters({...filters, crop_id: e.target.value})} className="mt-1 w-full border rounded p-2" placeholder="ID" />
          </div>
          <div>
            <label className="block text-sm font-medium">Direction</label>
            <select value={filters.direction} onChange={e => setFilters({...filters, direction: e.target.value})} className="mt-1 w-full border rounded p-2">
              <option value="">All</option>
              <option value="Import into Kenya">Import</option>
              <option value="Export from Kenya">Export</option>
              <option value="Transit">Transit</option>
              <option value="Re-export">Re-export</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="mt-1 w-full border rounded p-2">
              <option value="">All</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="cleared">Cleared</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3>Total Transactions</h3>
          <p className="text-2xl font-bold">{summary?.totalTransactions || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3>Total Crop Volume</h3>
          <p className="text-2xl font-bold">{summary?.totalVolume?.toFixed(2) || 0} MT</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3>Imports</h3>
          <p className="text-2xl font-bold">{summary?.imports?.toFixed(2) || 0} MT</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3>Exports</h3>
          <p className="text-2xl font-bold">{summary?.exports?.toFixed(2) || 0} MT</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h4 className="font-semibold mb-2">Top Crops</h4>
        {summary?.topCrops?.length > 0 ? (
          <table className="w-full">
            <thead><tr><th>Crop</th><th>Volume (MT)</th></tr></thead>
            <tbody>
              {summary.topCrops.map((crop: any, idx: number) => (
                <tr key={idx}><td>{crop.name}</td><td>{crop.volume.toFixed(2)}</td></tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No crop data available.</p>
        )}
      </div>
    </div>
  );
};
