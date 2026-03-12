import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, Heart, Share2, Calendar, Phone, CheckCircle2, ArrowLeft, Building2 } from 'lucide-react';
import { Property } from '../types';

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Check if property is saved
      fetch(`/api/user/${userData.id}/saved`)
        .then(res => res.json())
        .then((saved: Property[]) => {
          setIsSaved(saved.some(p => p.id === Number(id)));
        });
    }

    fetch(`/api/properties/${id}`)
      .then(res => res.json())
      .then(data => {
        setProperty(data);
        setLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('/api/user/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, propertyId: Number(id) })
      });
      if (response.ok) {
        setIsSaved(!isSaved);
      }
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(price / 100000).toFixed(2)} L`;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" /></div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center">Property not found</div>;

  const amenities = property.amenities.split(',').map(a => a.trim()).filter(a => a);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Gallery Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-primary-600 mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to results
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">{property.name}</h1>
              <div className="flex items-center text-slate-500">
                <MapPin className="h-4 w-4 mr-1 text-primary-500" />
                <span>{property.locality}, {property.city_name}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              <button 
                onClick={handleSave}
                className={`p-2.5 rounded-xl border transition-colors ${isSaved ? 'bg-red-50 border-red-200 text-red-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
              </button>
              <div className="text-right ml-4">
                <div className="text-3xl font-display font-bold text-primary-600">{formatPrice(property.price)}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Price</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[600px]">
            <div className="md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden shadow-lg">
              <img src={property.image} alt={property.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md">
              <img src={`https://picsum.photos/seed/${property.id}-2/800/600`} alt="Interior 1" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md">
              <img src={`https://picsum.photos/seed/${property.id}-3/800/600`} alt="Interior 2" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md">
              <img src={`https://picsum.photos/seed/${property.id}-4/800/600`} alt="Interior 3" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md relative group cursor-pointer">
              <img src={`https://picsum.photos/seed/${property.id}-5/800/600`} alt="Interior 4" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-slate-900/40 flex flex-col items-center justify-center group-hover:bg-slate-900/60 transition-colors">
                <span className="text-white font-display font-bold text-2xl">+12</span>
                <span className="text-white/80 text-xs font-bold uppercase tracking-widest">View Gallery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Key Features */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-display font-bold text-slate-900 mb-6">Property Overview</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-50 p-2.5 rounded-xl text-primary-600">
                    <Bed className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{property.bedrooms || '-'}</div>
                    <div className="text-xs text-slate-500">Bedrooms</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-50 p-2.5 rounded-xl text-primary-600">
                    <Bath className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{property.bathrooms || '-'}</div>
                    <div className="text-xs text-slate-500">Bathrooms</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-50 p-2.5 rounded-xl text-primary-600">
                    <Maximize className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{property.area}</div>
                    <div className="text-xs text-slate-500">Sq Ft</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-50 p-2.5 rounded-xl text-primary-600">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{property.type}</div>
                    <div className="text-xs text-slate-500">Property Type</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-display font-bold text-slate-900 mb-6">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {amenities.map(amenity => (
                  <div key={amenity} className="flex items-center space-x-2 text-slate-600">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm font-medium">{amenity}</span>
                  </div>
                ))}
                {amenities.length === 0 && <p className="text-slate-400 text-sm">No specific amenities listed.</p>}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-display font-bold text-slate-900 mb-4">Description</h2>
              <p className="text-slate-600 leading-relaxed">
                {property.description}
              </p>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg sticky top-24">
              <h3 className="text-lg font-display font-bold text-slate-900 mb-6">Interested in this property?</h3>
              <div className="space-y-4">
                <Link 
                  to={`/contact-agent?propertyId=${property.id}`}
                  className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold hover:bg-primary-700 transition-colors flex items-center justify-center"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Agent
                </Link>
                <Link 
                  to={`/schedule-visit?propertyId=${property.id}`}
                  className="w-full bg-white border-2 border-primary-600 text-primary-600 py-4 rounded-xl font-bold hover:bg-primary-50 transition-colors flex items-center justify-center"
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Schedule Visit
                </Link>
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100">
                <div className="flex items-center space-x-4">
                  <img 
                    src="https://i.pravatar.cc/150?u=agent" 
                    alt="Agent" 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-900">Rajesh Kumar</div>
                    <div className="text-xs text-slate-500">Senior Property Consultant</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
