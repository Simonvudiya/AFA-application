import React from 'react';

export const BarChart: React.FC<{ data: any[]; xKey: string; yKey: string }> = ({ data, xKey, yKey }) => {
  return (
    <div>
      {data.map((item) => (
        <div key={item[xKey]} className="flex justify-between">
          <span>{item[xKey]}</span>
          <span>{item[yKey]}</span>
        </div>
      ))}
    </div>
  );
};
