import React from 'react';
import { Link } from 'react-router-dom';
import { NationalDashboard } from '../components/dashboards/NationalDashboard';

export const Dashboard: React.FC = () => {
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">National Dashboard</h1>
        <div className="space-x-2">
          <Link to="/new-consignment" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            New Consignment
          </Link>
          <Link to="/my-records" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            My Records
          </Link>
          <Link to="/reports" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
            Reports
          </Link>
          <Link to="/analytics" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
            Analytics
          </Link>
          <Link to="/admin" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
            Admin
          </Link>
        </div>
      </div>
      <NationalDashboard />
    </div>
  );
};
