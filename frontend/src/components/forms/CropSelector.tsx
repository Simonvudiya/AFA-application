import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';

export interface Crop {
  id: number;
  name: string;
  crop_id: number;
  directorate_name?: string;
  department_name?: string;
}

interface CropSelectorProps {
  onChange: (crop: Crop) => void;
}

export const CropSelector: React.FC<CropSelectorProps> = ({ onChange }) => {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [crops, setCrops] = useState<{ id: number; name: string; category_id: number; directorate_name?: string; department_name?: string }[]>([]);
  const [products, setProducts] = useState<{ id: number; name: string; crop_id: number }[]>([]);

  useEffect(() => {
    api.get('/crops/categories').then(res => setCategories(res.data));
  }, []);

  const onCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = Number(e.target.value);
    const res = await api.get('/crops');
    const filtered = res.data.filter((c: any) => c.category_id === categoryId);
    setCrops(filtered);
    setProducts([]);
  };

  const onCropChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cropId = Number(e.target.value);
    const res = await api.get('/crops/products', { params: { cropId } });
    setProducts(res.data);
    const crop = crops.find((c) => c.id === cropId);
    if (crop) {
      onChange({ id: 0, name: '', crop_id: crop.id, directorate_name: crop.directorate_name, department_name: crop.department_name });
    }
  };

  const onProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const product = products.find((p) => p.id === Number(e.target.value));
    if (product) {
      onChange({ id: product.id, name: product.name, crop_id: product.crop_id });
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium">Category</label>
      <select onChange={onCategoryChange} className="mt-1 w-full border rounded p-2">
        <option value="">Select category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <label className="block text-sm font-medium mt-2">Crop</label>
      <select onChange={onCropChange} className="mt-1 w-full border rounded p-2">
        <option value="">Select crop</option>
        {crops.map((crop) => (
          <option key={crop.id} value={crop.id}>{crop.name}</option>
        ))}
      </select>
      <label className="block text-sm font-medium mt-2">Product</label>
      <select onChange={onProductChange} className="mt-1 w-full border rounded p-2">
        <option value="">Select product</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </div>
  );
};
