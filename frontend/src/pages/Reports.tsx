import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

export const Reports: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    api.get('/reports/national/summary').then(res => setSummary(res.data));
  }, []);

  if (!summary) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="grid grid-cols-4 gap-4 mb-6">
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
      <div className="bg-white p-4 rounded shadow">
        <h4 className="font-semibold">Top Crops</h4>
        <table className="w-full">
          <thead><tr><th>Crop</th><th>Volume (MT)</th></tr></thead>
          <tbody>
            {summary.topCrops.map((crop: any, idx: number) => (
              <tr key={idx}><td>{crop.name}</td><td>{crop.volume}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
