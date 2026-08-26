import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

interface Consignment {
  id: number;
  reference: string;
  date: string;
  time_of_entry: string | null;
  border_point_id: number;
  direction: string;
  quantity: number;
  unit: string;
  status: string;
  officer_name: string | null;
  crop_id: number;
  directorate_id: number | null;
  department_id: number | null;
}

export const MyRecords: React.FC = () => {
  const [records, setRecords] = useState<Consignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const borderPointId = user && (user as any).border_point_id ? String((user as any).border_point_id) : searchParams.get('border_point_id');
  const directorateId = searchParams.get('directorate_id');
  const cropProductId = searchParams.get('crop_product_id');
  const statusFilter = searchParams.get('status');
  const search = searchParams.get('search');

  useEffect(() => {
    const params = new URLSearchParams();
    if (borderPointId) params.set('border_point_id', borderPointId);
    if (directorateId) params.set('directorate_id', directorateId);
    if (cropProductId) params.set('crop_product_id', cropProductId);
    if (statusFilter) params.set('status', statusFilter);
    if (search) params.set('search', search);

    const url = `/consignments${params.toString() ? `?${params.toString()}` : ''}`;
    api.get(url).then(res => {
      setRecords(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [borderPointId, directorateId, cropProductId, statusFilter, search]);

  const getFilterLabel = () => {
    if (search) return `Search: "${search}"`;
    if (borderPointId) return `Border Point ID: ${borderPointId}`;
    if (directorateId) return `Directorate ID: ${directorateId}`;
    if (cropProductId) return `Crop Product ID: ${cropProductId}`;
    if (statusFilter) return `Status: ${statusFilter}`;
    const bpId = (user as any)?.border_point_id;
    if (bpId) return `My Station (Border Point ${bpId})`;
    return 'All Records';
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Records</h1>
      <p className="mb-4 text-gray-600">Showing: {getFilterLabel()}</p>
      {records.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No records found.</p>
          <Link to="/new-consignment" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create New Consignment</Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
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
                <th className="border p-2">Actions</th>
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
                  <td className="border p-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      record.status === 'cleared' ? 'bg-green-100 text-green-800' :
                      record.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      record.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="border p-2">{record.officer_name || '-'}</td>
                  <td className="border p-2">
                    <Link to={`/consignments/${record.id}`} className="text-blue-600 hover:underline text-sm">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
