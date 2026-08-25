import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/common/Layout';
import { useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { NewConsignment } from './pages/NewConsignment';
import { MyRecords } from './pages/MyRecords';
import { Reports } from './pages/Reports';
import { Analytics } from './pages/Analytics';
import { Admin } from './pages/Admin';
import { Directorates } from './pages/Admin/Directorates';
import { Departments } from './pages/Admin/Departments';
import { Crops } from './pages/Admin/Crops';
import { BorderPoints } from './pages/Admin/BorderPoints';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="new-consignment" element={<NewConsignment />} />
        <Route path="my-records" element={<MyRecords />} />
        <Route path="reports" element={<Reports />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="admin" element={<Admin />}>
          <Route index element={<Navigate to="directorates" />} />
          <Route path="directorates" element={<Directorates />} />
          <Route path="departments" element={<Departments />} />
          <Route path="crops" element={<Crops />} />
          <Route path="border-points" element={<BorderPoints />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
