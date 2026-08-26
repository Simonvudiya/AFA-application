import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export const Admin: React.FC = () => {
  const location = useLocation();
  const tabs = [
    { path: '/admin/directorates', label: 'Directorates' },
    { path: '/admin/departments', label: 'Departments' },
    { path: '/admin/crops', label: 'Crops' },
    { path: '/admin/border-points', label: 'Border Points' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin</h1>
      <div className="flex space-x-4 mb-4 border-b">
        {tabs.map(tab => (
          <Link
            key={tab.path}
            to={tab.path}
            className={`pb-2 px-4 ${location.pathname === tab.path ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <Outlet />
    </div>
  );
};
