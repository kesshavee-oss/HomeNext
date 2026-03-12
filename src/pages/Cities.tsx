import React, { useState, useEffect } from 'react';
import { City } from '../types';
import { CityCard } from '../components/Cards';
import { Search, MapPin } from 'lucide-react';

const Cities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cities')
      .then(res => res.json())
      .then(data => {
        setCities(data);
        setLoading(false);
      });
  }, []);

  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Explore Cities</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Find your dream home in any of these 20+ vibrant Indian cities. 
            Each city offers a unique blend of culture, opportunity, and affordable living.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search for a city..." 
              className="w-full bg-white border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 shadow-sm focus:ring-primary-500 focus:border-primary-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-[4/5] bg-slate-200 rounded-2xl" />
            ))}
          </div>
        ) : filteredCities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredCities.map(city => (
              <CityCard key={city.id} city={city} count={50} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-display font-bold text-slate-900 mb-2">No cities found</h3>
            <p className="text-slate-500">We couldn't find any city matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cities;
