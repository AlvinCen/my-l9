
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import ContentWithAds from './ContentWithAds';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-grow p-4 md:p-6 lg:p-8">
        <ContentWithAds>
          <Outlet />
        </ContentWithAds>
      </main>
    </div>
  );
};

export default Layout;
