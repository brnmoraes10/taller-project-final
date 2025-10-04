import React from 'react';
import AlumnoSidebar from '../components/AlumnoSidebar';

export default function AlumnoLayout({ children }) {
  return (
    <div className="d-flex">
      <AlumnoSidebar />
      <div className="flex-grow-1 p-4 bg-light" style={{ minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  );
}
