import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="d-flex">
      <AdminSidebar />

      <div
        className="flex-grow-1 p-4 bg-light"
        style={{
          minHeight: "100vh",
          marginLeft: "250px",   // ✔ coincide con el ancho del sidebar
          width: "calc(100% - 250px)", // ✔ evita espacio en blanco
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}

