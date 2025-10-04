import React from 'react';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 bg-light" style={{ minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  );
}
