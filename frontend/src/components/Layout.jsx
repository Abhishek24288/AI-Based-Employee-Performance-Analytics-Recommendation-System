import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import AICopilot from './AICopilot';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-950 font-sans relative">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
      <AICopilot />
    </div>
  );
};

export default Layout;
