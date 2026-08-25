import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';

interface Department {
  id: number;
  name: string;
  directorate_id: number;
  directorate_name: string;
}

export const Departments: React.FC = () => {
  const [items, setItems] = useState<Department[]>([]);
  const [directorates, setDirectorates] = useState<{ id: number; name: string }[]>([]);
  const [name, setName] = useState('');
  const [directorateId, setDirectorateId] = useState('');

  const load = () => Promise.all([
    api.get('/departments').then(res => setItems(res.data)),
    api.get('/directorates').then(res => setDirectorates(res.data)),
  ]);
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/departments', { name, directorate_id: parseInt(directorateId, 10) });
    setName('');
    setDirectorateId('');
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Departments</h2>
      <form onSubmit={add} className="mb-4 space-x-2">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="border p-2" required />
        <select value={directorateId} onChange={e => setDirectorateId(e.target.value)} className="border p-2" required>
          <option value="">Select Directorate</option>
          {directorates.map(dir => (
            <option key={dir.id} value={dir.id}>{dir.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded">Add</button>
      </form>
      <table className="w-full border">
        <thead><tr className="bg-gray-100"><th className="border p-2">Name</th><th className="border p-2">Directorate</th><th className="border p-2">Actions</th></tr></thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.directorate_name}</td>
              <td className="border p-2">
                <Link to={`/my-records?directorate_id=${item.directorate_id}`} className="text-blue-600 hover:underline">View Records</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
