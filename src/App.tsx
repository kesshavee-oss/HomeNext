import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header, Footer } from './components/Layout';
import Home from './pages/Home';
import Browse from './pages/Browse';
import PropertyDetails from './pages/PropertyDetails';
import ScheduleVisit from './pages/ScheduleVisit';
import ContactAgent from './pages/ContactAgent';
import BudgetHomes from './pages/BudgetHomes';
import Profile from './pages/Profile';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Cities from './pages/Cities';
import About from './pages/About';

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isLogin = location.pathname === '/login';

  if (isAdmin || isLogin) return <>{children}</>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/schedule-visit" element={<ScheduleVisit />} />
          <Route path="/contact-agent" element={<ContactAgent />} />
          <Route path="/budget-homes" element={<BudgetHomes />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/cities" element={<Cities />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}
