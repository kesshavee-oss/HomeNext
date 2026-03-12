import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Routes, Route, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Map, Building2, Users, Calendar, MessageSquare, 
  Plus, Edit, Trash2, Check, X, ArrowLeft, Home, Search
} from 'lucide-react';
import { City, Property, User, Visit, ContactRequest } from '../types';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Manage Cities', icon: Map, path: '/admin/cities' },
    { name: 'Manage Properties', icon: Building2, path: '/admin/properties' },
    { name: 'Manage Users', icon: Users, path: '/admin/users' },
    { name: 'Manage Visits', icon: Calendar, path: '/admin/visits' },
    { name: 'Contact Requests', icon: MessageSquare, path: '/admin/contacts' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-400 flex flex-col fixed h-full">
        <div className="p-6 border-b border-slate-800">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 p-1 rounded-lg">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-display font-bold text-white">HomeNest <span className="text-primary-500">Admin</span></span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === item.path ? 'bg-primary-600 text-white' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Site</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

const DashboardHome = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  if (!stats) return null;

  const cards = [
    { name: 'Total Cities', value: stats.cities, icon: Map, color: 'bg-blue-500', path: '/admin/cities' },
    { name: 'Total Properties', value: stats.properties, icon: Building2, color: 'bg-emerald-500', path: '/admin/properties' },
    { name: 'Total Users', value: stats.users, icon: Users, color: 'bg-indigo-500', path: '/admin/users' },
    { name: 'Scheduled Visits', value: stats.visits, icon: Calendar, color: 'bg-amber-500', path: '/admin/visits' },
    { name: 'Contact Requests', value: stats.contacts, icon: MessageSquare, color: 'bg-purple-500', path: '/admin/contacts' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-slate-900 mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link 
            key={card.name} 
            to={card.path}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.color} p-3 rounded-xl text-white shadow-lg shadow-${card.color.split('-')[1]}-100`}>
                <card.icon className="h-6 w-6" />
              </div>
              <span className="text-2xl font-display font-bold text-slate-900">{card.value}</span>
            </div>
            <h3 className="text-slate-500 font-medium">{card.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

const AdminVisits = () => {
  const [visits, setVisits] = useState<Visit[]>([]);

  useEffect(() => {
    fetch('/api/admin/visits')
      .then(res => res.json())
      .then(data => setVisits(data));
  }, []);

  const handleStatus = async (id: number, status: string) => {
    await fetch(`/api/admin/visits/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    setVisits(visits.map(v => v.id === id ? { ...v, status: status as any } : v));
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-slate-900 mb-8">Manage Visits</h1>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Property</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visits.map((visit) => (
              <tr key={visit.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-slate-900">{visit.user_name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-600">{visit.property_name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-600">{visit.visit_date}</div>
                  <div className="text-xs text-slate-400">{visit.visit_time}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    visit.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 
                    visit.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => handleStatus(visit.id, 'approved')}
                      className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleStatus(visit.id, 'cancelled')}
                      className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminContacts = () => {
  const [contacts, setContacts] = useState<ContactRequest[]>([]);

  useEffect(() => {
    fetch('/api/admin/contacts')
      .then(res => res.json())
      .then(data => setContacts(data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-slate-900 mb-8">Contact Requests</h1>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Property</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Info</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {contacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-slate-900">{contact.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-600">{contact.property_name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-600">{contact.email}</div>
                  <div className="text-xs text-slate-400">{contact.mobile}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-500 line-clamp-2 max-w-xs">{contact.message}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      navigate('/');
    }
  }, [navigate]);

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<DashboardHome />} />
        <Route path="/visits" element={<AdminVisits />} />
        <Route path="/contacts" element={<AdminContacts />} />
        <Route path="*" element={<div className="p-12 text-center text-slate-400">Feature coming soon...</div>} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboard;
