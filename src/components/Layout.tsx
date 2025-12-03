
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import ContentWithAds from './ContentWithAds';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-grow p-4 md:p-6 lg:p-8">
        <ContentWithAds>
          <Outlet />
        </ContentWithAds>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
