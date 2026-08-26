import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Layout: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/new-consignment', label: 'New Consignment', icon: '➕' },
    { to: '/my-records', label: 'My Records', icon: '📋' },
    { to: '/reports', label: 'Reports', icon: '📈' },
    { to: '/analytics', label: 'Analytics', icon: '📉' },
    { to: '/admin', label: 'Admin', icon: '⚙️' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">AFA CBIRS</div>
        <nav className="flex-1 space-y-1 p-4">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center space-x-2 hover:bg-gray-700 p-2 rounded ${location.pathname === link.to ? 'bg-gray-700 font-semibold' : ''}`}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <div className="text-sm text-gray-300 mb-2">{user?.full_name || user?.email}</div>
          <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300">Logout</button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <div className="text-gray-600 text-sm">
            {location.pathname === '/dashboard' && 'Dashboard'}
            {location.pathname === '/new-consignment' && 'New Consignment'}
            {location.pathname === '/my-records' && 'My Records'}
            {location.pathname.startsWith('/consignments') && 'Consignment Details'}
            {location.pathname === '/reports' && 'Reports'}
            {location.pathname === '/analytics' && 'Analytics'}
            {location.pathname.startsWith('/admin') && 'Administration'}
          </div>
          <div className="text-sm text-gray-500">AFA Border Enforcement Platform</div>
        </header>
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
