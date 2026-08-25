import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

interface Consignment {
  id: number;
  reference: string;
  date: string;
  border_point_id: number;
  direction: string;
  quantity: number;
  unit: string;
  status: string;
}

export const MyRecords: React.FC = () => {
  const [records, setRecords] = useState<Consignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/consignments').then(res => {
      setRecords(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Records</h1>
      {records.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Reference</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Direction</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Unit</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td className="border p-2">{record.reference}</td>
                <td className="border p-2">{record.date}</td>
                <td className="border p-2">{record.direction}</td>
                <td className="border p-2">{record.quantity}</td>
                <td className="border p-2">{record.unit}</td>
                <td className="border p-2">{record.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
