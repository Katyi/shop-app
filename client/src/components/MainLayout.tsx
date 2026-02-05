import { Outlet } from 'react-router-dom';
import Header from './header/Header';
import Announcement from './announcement/Announcement';
import Footer from './footer/Footer';

const MainLayout = () => {
  return (
    <div className="app-container">
      <Announcement />
      <Header />
      <main>
        {/* Outlet is where child pages will be rendered */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
