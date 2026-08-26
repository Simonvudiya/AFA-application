import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

interface Summary {
  totalTransactions: number;
  totalVolume: number;
  imports: number;
  exports: number;
  borderActivity: any[];
  topCrops: { name: string; volume: number }[];
}

export const Dashboard: React.FC = () => {
  const { user: _user } = useAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/reports/national/summary'),
      api.get('/consignments').then(res => res.data.slice(0, 5)),
    ]).then(([sumRes, recRes]) => {
      setSummary(sumRes.data);
      setRecent(recRes);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="space-x-2">
          <Link to="/new-consignment" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">New Consignment</Link>
          <Link to="/my-records" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">My Records</Link>
          <Link to="/reports" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">Reports</Link>
          <Link to="/analytics" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">Analytics</Link>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3>Total Transactions</h3>
          <p className="text-2xl font-bold">{summary?.totalTransactions || 0}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3>Total Crop Volume</h3>
          <p className="text-2xl font-bold">{(summary?.totalVolume || 0).toFixed(2)} MT</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3>Imports</h3>
          <p className="text-2xl font-bold">{(summary?.imports || 0).toFixed(2)} MT</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3>Exports</h3>
          <p className="text-2xl font-bold">{(summary?.exports || 0).toFixed(2)} MT</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-semibold mb-2">Recent Consignments</h3>
        {recent.length > 0 ? (
          <table className="w-full">
            <thead><tr className="bg-gray-100"><th className="border p-2">Reference</th><th className="border p-2">Date</th><th className="border p-2">Status</th><th className="border p-2">Quantity</th></tr></thead>
            <tbody>
              {recent.map((r: any) => (
                <tr key={r.id}>
                  <td className="border p-2">{r.reference}</td>
                  <td className="border p-2">{r.date}</td>
                  <td className="border p-2">{r.status}</td>
                  <td className="border p-2">{r.quantity} {r.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No recent consignments.</p>
        )}
      </div>
    </div>
  );
};
