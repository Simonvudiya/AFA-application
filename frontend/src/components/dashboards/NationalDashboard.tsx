import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { BarChart } from '../charts/BarChart';
import { KenyaBorderMap } from '../maps/KenyaBorderMap';

interface Summary {
  totalTransactions: number;
  totalVolume: number;
  imports: number;
  exports: number;
  borderActivity: any[];
  topCrops: { name: string; volume: number }[];
}

export const NationalDashboard: React.FC = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [directorateData, setDirectorateData] = useState<{ directorate: string; volume: number }[]>([]);

  useEffect(() => {
    api.get('/reports/national/summary').then(res => setSummary(res.data));
    api.get('/analytics/directorate-volumes').then(res => setDirectorateData(res.data));
  }, []);

  if (!summary) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3>Total Transactions</h3>
          <p className="text-2xl font-bold">{summary.totalTransactions}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3>Total Crop Volume</h3>
          <p className="text-2xl font-bold">{summary.totalVolume} MT</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3>Imports</h3>
          <p className="text-2xl font-bold">{summary.imports} MT</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3>Exports</h3>
          <p className="text-2xl font-bold">{summary.exports} MT</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h4 className="font-semibold">By Directorate</h4>
          <BarChart data={directorateData} xKey="directorate" yKey="volume" />
        </div>
        <div className="bg-white p-4 rounded shadow h-96">
          <KenyaBorderMap borderData={summary.borderActivity} />
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h4 className="font-semibold">Top Crops</h4>
        <table className="w-full">
          <thead><tr><th>Crop</th><th>Volume (MT)</th></tr></thead>
          <tbody>
            {summary.topCrops.map((crop) => (
              <tr key={crop.name}><td>{crop.name}</td><td>{crop.volume}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
