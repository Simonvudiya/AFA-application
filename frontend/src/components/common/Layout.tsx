import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4 text-xl font-bold">AFA CBIRS</div>
        <nav className="space-y-2 p-4">
          <Link to="/dashboard" className="block hover:bg-gray-700 p-2 rounded">Dashboard</Link>
          <Link to="/new-consignment" className="block hover:bg-gray-700 p-2 rounded">New Consignment</Link>
          <Link to="/my-records" className="block hover:bg-gray-700 p-2 rounded">My Records</Link>
          <Link to="/reports" className="block hover:bg-gray-700 p-2 rounded">Reports</Link>
          <Link to="/analytics" className="block hover:bg-gray-700 p-2 rounded">Analytics</Link>
          <Link to="/admin" className="block hover:bg-gray-700 p-2 rounded">Admin</Link>
        </nav>
      </aside>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};
