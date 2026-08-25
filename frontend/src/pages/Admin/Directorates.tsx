import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';

interface Directorate {
  id: number;
  name: string;
  code: string;
}

export const Directorates: React.FC = () => {
  const [items, setItems] = useState<Directorate[]>([]);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const load = () => api.get('/directorates').then(res => setItems(res.data));
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/directorates', { name, code });
    setName('');
    setCode('');
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Directorates</h2>
      <form onSubmit={add} className="mb-4 space-x-2">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="border p-2" required />
        <input value={code} onChange={e => setCode(e.target.value)} placeholder="Code" className="border p-2" required />
        <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded">Add</button>
      </form>
      <table className="w-full border">
        <thead><tr className="bg-gray-100"><th className="border p-2">Name</th><th className="border p-2">Code</th><th className="border p-2">Actions</th></tr></thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.code}</td>
              <td className="border p-2">
                <Link to={`/my-records?directorate_id=${item.id}`} className="text-blue-600 hover:underline">View Records</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
