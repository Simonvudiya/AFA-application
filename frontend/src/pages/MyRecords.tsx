import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

interface Consignment {
  id: number;
  reference: string;
  date: string;
  border_point_id: number;
  direction: string;
  quantity: number;
  unit: string;
  status: string;
  officer_name: string | null;
}

export const MyRecords: React.FC = () => {
  const [records, setRecords] = useState<Consignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const borderPointId = searchParams.get('border_point_id');
  const directorateId = searchParams.get('directorate_id');
  const departmentId = searchParams.get('department_id');

  useEffect(() => {
    const params = new URLSearchParams();
    if (borderPointId) params.set('border_point_id', borderPointId);
    if (directorateId) params.set('directorate_id', directorateId);
    if (departmentId) params.set('department_id', departmentId);

    const url = `/consignments${params.toString() ? `?${params.toString()}` : ''}`;
    api.get(url).then(res => {
      setRecords(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [borderPointId, directorateId, departmentId]);

  const getFilterLabel = () => {
    if (borderPointId) return `Border Point ID: ${borderPointId}`;
    if (directorateId) return `Directorate ID: ${directorateId}`;
    if (departmentId) return `Department ID: ${departmentId}`;
    if (user?.border_point_id) return `My Station (Border Point ${user.border_point_id})`;
    if (user?.directorate_id) return `My Directorate (${user.directorate_id})`;
    return 'All Records';
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Records</h1>
      <p className="mb-4 text-gray-600">Showing: {getFilterLabel()}</p>
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
              <th className="border p-2">Officer</th>
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
                <td className="border p-2">{record.officer_name || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
