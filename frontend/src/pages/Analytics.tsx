import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { BarChart } from '../components/charts/BarChart';

export const Analytics: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    api.get('/analytics/directorate-volumes').then(res => setData(res.data.value || []));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <div className="bg-white p-4 rounded shadow">
        <h4 className="font-semibold">Directorate Volumes</h4>
        <BarChart data={data} xKey="directorate" yKey="volume" />
      </div>
    </div>
  );
};
