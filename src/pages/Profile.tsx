import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Heart, Calendar, MessageSquare, Settings, LogOut } from 'lucide-react';
import { Property, User as UserType, Visit, ContactRequest } from '../types';
import { PropertyCard } from '../components/Cards';

const Profile = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [activeTab, setActiveTab] = useState<'saved' | 'visits' | 'requests'>('saved');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);

    fetch(`/api/user/${userData.id}/saved`)
      .then(res => res.json())
      .then(data => setSavedProperties(data));
  }, [navigate]);

  const handleSave = async (propertyId: number) => {
    if (!user) return;

    try {
      const response = await fetch('/api/user/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, propertyId })
      });
      if (response.ok) {
        setSavedProperties(prev => prev.filter(p => p.id !== propertyId));
      }
    } catch (error) {
      console.error('Error unsaving property:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 text-center border-b border-slate-100">
                <div className="relative inline-block mb-4">
                  <img 
                    src={`https://i.pravatar.cc/150?u=${user.email}`} 
                    alt={user.name} 
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary-50"
                  />
                  <div className="absolute bottom-0 right-0 bg-primary-600 p-1.5 rounded-full border-2 border-white text-white">
                    <Settings className="h-4 w-4" />
                  </div>
                </div>
                <h2 className="text-xl font-display font-bold text-slate-900">{user.name}</h2>
                <p className="text-sm text-slate-500 uppercase tracking-wider font-bold mt-1">{user.role}</p>
              </div>
              <div className="p-4 space-y-1">
                <button 
                  onClick={() => setActiveTab('saved')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'saved' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Heart className="h-5 w-5" />
                  <span>Saved Properties</span>
                </button>
                <button 
                  onClick={() => setActiveTab('visits')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'visits' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Calendar className="h-5 w-5" />
                  <span>Scheduled Visits</span>
                </button>
                <button 
                  onClick={() => setActiveTab('requests')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeTab === 'requests' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Contact Requests</span>
                </button>
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-slate-600">
                  <Mail className="h-4 w-4 text-primary-500" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-600">
                  <Phone className="h-4 w-4 text-primary-500" />
                  <span className="text-sm">+91 98765 43210</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm min-h-[600px] p-8">
              {activeTab === 'saved' && (
                <div>
                  <h2 className="text-2xl font-display font-bold text-slate-900 mb-8">Saved Properties</h2>
                  {savedProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {savedProperties.map(property => (
                        <PropertyCard 
                          key={property.id} 
                          property={property} 
                          isSaved={true} 
                          onSave={handleSave}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart className="h-10 w-10 text-slate-300" />
                      </div>
                      <h3 className="text-xl font-display font-bold text-slate-900 mb-2">No saved properties</h3>
                      <p className="text-slate-500 mb-8">Start browsing and save properties you like!</p>
                      <button 
                        onClick={() => navigate('/browse')}
                        className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors"
                      >
                        Browse Homes
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'visits' && (
                <div>
                  <h2 className="text-2xl font-display font-bold text-slate-900 mb-8">Scheduled Visits</h2>
                  <div className="text-center py-20">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Calendar className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-slate-900 mb-2">No scheduled visits</h3>
                    <p className="text-slate-500">You haven't scheduled any property visits yet.</p>
                  </div>
                </div>
              )}

              {activeTab === 'requests' && (
                <div>
                  <h2 className="text-2xl font-display font-bold text-slate-900 mb-8">Contact Requests</h2>
                  <div className="text-center py-20">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageSquare className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-slate-900 mb-2">No contact requests</h3>
                    <p className="text-slate-500">Your inquiries to agents will appear here.</p>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
