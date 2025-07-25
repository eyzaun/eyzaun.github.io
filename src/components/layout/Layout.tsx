import React from 'react';
import Header from '../Header';
import Footer from '../Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 px-6 md:px-12 lg:px-24 xl:px-32">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
