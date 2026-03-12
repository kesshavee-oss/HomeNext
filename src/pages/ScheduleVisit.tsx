import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MessageSquare, User, Mail, Phone, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Property } from '../types';

const ScheduleVisit = () => {
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    date: '',
    time: '',
    message: ''
  });

  useEffect(() => {
    if (propertyId) {
      fetch(`/api/properties/${propertyId}`)
        .then(res => res.json())
        .then(data => {
          setProperty(data);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [propertyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const response = await fetch('/api/visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id || 1, // Default to user 1 if not logged in for demo
        propertyId: propertyId,
        ...formData
      })
    });

    if (response.ok) {
      setSubmitted(true);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" /></div>;

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-12 rounded-3xl border border-slate-200 shadow-xl text-center max-w-md w-full">
          <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-4">Request Sent!</h2>
          <p className="text-slate-500 mb-8">
            Your visit request for <strong>{property?.name}</strong> has been sent successfully. 
            Our agent will contact you shortly to confirm.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-primary-600 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-primary-600 p-8 text-white">
            <h1 className="text-2xl font-display font-bold mb-2">Schedule a Property Visit</h1>
            <p className="text-primary-100">Experience your future home in person.</p>
          </div>

          <div className="p-8">
            {property && (
              <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-2xl mb-8 border border-slate-100">
                <img src={property.image} alt={property.name} className="w-20 h-20 rounded-xl object-cover" referrerPolicy="no-referrer" />
                <div>
                  <div className="text-sm font-bold text-slate-900">{property.name}</div>
                  <div className="text-xs text-slate-500">{property.locality}, {property.city_name}</div>
                  <div className="text-sm font-bold text-primary-600 mt-1">₹{(property.price / 100000).toFixed(2)} L</div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      className="w-full bg-slate-50 border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <input 
                      type="email" 
                      required
                      className="w-full bg-slate-50 border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <input 
                      type="tel" 
                      required
                      className="w-full bg-slate-50 border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Mobile number"
                      value={formData.mobile}
                      onChange={e => setFormData({...formData, mobile: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <input 
                      type="date" 
                      required
                      className="w-full bg-slate-50 border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:ring-primary-500 focus:border-primary-500"
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Time</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                    <input 
                      type="time" 
                      required
                      className="w-full bg-slate-50 border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:ring-primary-500 focus:border-primary-500"
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Message (Optional)</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                  <textarea 
                    rows={4}
                    className="w-full bg-slate-50 border-slate-200 rounded-xl py-3 pl-12 pr-4 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Any specific requirements or questions?"
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
              >
                Request Visit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleVisit;
