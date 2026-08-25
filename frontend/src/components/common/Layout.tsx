import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export const Layout: React.FC = () => {
  const location = useLocation();
  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/new-consignment', label: 'New Consignment' },
    { to: '/my-records', label: 'My Records' },
    { to: '/reports', label: 'Reports' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/admin', label: 'Admin' },
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4 text-xl font-bold">AFA CBIRS</div>
        <nav className="space-y-2 p-4">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`block hover:bg-gray-700 p-2 rounded ${location.pathname === link.to ? 'bg-gray-700 font-semibold' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};
