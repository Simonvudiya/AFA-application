import React, { useEffect, useState } from 'react';
import { api } from '../../api/client';

interface Crop {
  id: number;
  name: string;
  category_id: number;
}

export const Crops: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const load = async () => {
    const [cropsRes, catRes] = await Promise.all([
      api.get('/crops'),
      api.get('/crops/categories'),
    ]);
    setCrops(cropsRes.data);
    setCategories(catRes.data);
  };
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/crops', { name, category_id: Number(categoryId) });
    setName('');
    setCategoryId('');
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Crops</h2>
      <form onSubmit={add} className="mb-4 space-x-2">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Crop name" className="border p-2" required />
        <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="border p-2" required>
          <option value="">Select category</option>
          {categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded">Add</button>
      </form>
      <table className="w-full border">
        <thead><tr className="bg-gray-100"><th className="border p-2">Name</th><th className="border p-2">Category</th></tr></thead>
        <tbody>
          {crops.map(crop => (
            <tr key={crop.id}>
              <td className="border p-2">{crop.name}</td>
              <td className="border p-2">{categories.find(c => c.id === crop.category_id)?.name || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
