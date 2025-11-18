import React from 'react';
import { Outlet } from 'react-router-dom';
import CajeroSidebar from '../components/CajeroSidebar';

export default function CajeroLayout() {
  return (
    <div className="d-flex">
      <CajeroSidebar />

      <div
        className="flex-grow-1 p-4 bg-light"
        style={{
          minHeight: "100vh",
          marginLeft: "250px",   // ✔ igual que el sidebar
          width: "calc(100% - 250px)", // ✔ elimina el espacio muerto
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
