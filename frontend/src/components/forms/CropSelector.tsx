import React, { useState, useEffect } from 'react';
import { cropsApi } from '../../api/crops';

interface Crop {
  id: number;
  name: string;
  crop_id: number;
}

interface CropSelectorProps {
  onChange: (crop: Crop) => void;
}

export const CropSelector: React.FC<CropSelectorProps> = ({ onChange }) => {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [crops, setCrops] = useState<{ id: number; name: string; category_id: number }[]>([]);
  const [products, setProducts] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    cropsApi.categories().then(res => setCategories(res.data));
  }, []);

  const onCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = Number(e.target.value);
    const res = await cropsApi.crops();
    const filtered = res.data.filter((c: any) => c.category_id === categoryId);
    setCrops(filtered);
  };

  const onCropChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cropId = Number(e.target.value);
    const res = await cropsApi.products(cropId);
    setProducts(res.data);
  };

  const onProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const product = products.find((p) => p.id === Number(e.target.value));
    if (product) {
      onChange({ id: product.id, name: product.name, crop_id: 0 });
    }
  };

  return (
    <div>
      <label>Category</label>
      <select onChange={onCategoryChange}>
        <option value="">Select category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
      <label>Crop</label>
      <select onChange={onCropChange}>
        <option value="">Select crop</option>
        {crops.map((crop) => (
          <option key={crop.id} value={crop.id}>{crop.name}</option>
        ))}
      </select>
      <label>Product</label>
      <select onChange={onProductChange}>
        <option value="">Select product</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </div>
  );
};
