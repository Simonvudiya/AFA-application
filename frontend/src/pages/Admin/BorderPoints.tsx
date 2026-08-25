import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';

interface BorderPoint {
  id: number;
  name: string;
  code: string;
  county: string;
  country: string;
  latitude: number;
  longitude: number;
  directorates: string[];
}

export const BorderPoints: React.FC = () => {
  const [items, setItems] = useState<BorderPoint[]>([]);

  const load = () => api.get('/border-points').then(res => setItems(res.data));
  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Border Points</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Code</th>
            <th className="border p-2">County</th>
            <th className="border p-2">Country</th>
            <th className="border p-2">Latitude</th>
            <th className="border p-2">Longitude</th>
            <th className="border p-2">Directorates</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.code}</td>
              <td className="border p-2">{item.county}</td>
              <td className="border p-2">{item.country}</td>
              <td className="border p-2">{item.latitude}</td>
              <td className="border p-2">{item.longitude}</td>
              <td className="border p-2">{item.directorates.join(', ')}</td>
              <td className="border p-2">
                <Link to={`/my-records?border_point_id=${item.id}`} className="text-blue-600 hover:underline">View Records</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
