import React from 'react';
import AlumnoSidebar from '../components/AlumnoSidebar';
import { Outlet } from 'react-router-dom';

export default function AlumnoLayout() {
  return (
    <div className="d-flex">
      <AlumnoSidebar />
      <div className="flex-grow-1 p-4 bg-light" style={{ minHeight: '100vh' }}>
        <Outlet /> 
      </div>
    </div>
  );
}
