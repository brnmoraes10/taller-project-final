import React from "react";
import CajeroSidebar from "../components/CajeroSidebar";

const CajeroLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <CajeroSidebar />

      {/* Contenido */}
      <main className="flex-1 p-6 bg-gray-100 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default CajeroLayout;
