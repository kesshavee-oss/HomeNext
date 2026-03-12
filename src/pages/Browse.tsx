import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, X, Search, MapPin, Building2, IndianRupee, Bed, Check } from 'lucide-react';
import { Property, City } from '../types';
import { PropertyCard } from '../components/Cards';

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    amenities: searchParams.get('amenities')?.split(',') || [] as string[],
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetch(`/api/user/${userData.id}/saved`)
        .then(res => res.json())
        .then((data: Property[]) => setSavedIds(data.map(p => p.id)));
    }

    fetch('/api/cities')
      .then(res => res.json())
      .then(data => setCities(data));
  }, []);

  const handleSave = async (propertyId: number) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('/api/user/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, propertyId })
      });
      if (response.ok) {
        setSavedIds(prev => 
          prev.includes(propertyId) 
            ? prev.filter(id => id !== propertyId) 
            : [...prev, propertyId]
        );
      }
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(searchParams);
    fetch(`/api/properties?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setProperties(data);
        setLoading(false);
      });
  }, [searchParams]);

  const applyFilters = () => {
    const newParams = new URLSearchParams();
    if (filters.city) newParams.set('city', filters.city);
    if (filters.type) newParams.set('type', filters.type);
    if (filters.minPrice) newParams.set('minPrice', filters.minPrice);
    if (filters.maxPrice) newParams.set('maxPrice', filters.maxPrice);
    if (filters.bedrooms) newParams.set('bedrooms', filters.bedrooms);
    if (filters.amenities.length > 0) newParams.set('amenities', filters.amenities.join(','));
    setSearchParams(newParams);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setFilters({
      city: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      amenities: [],
    });
    setSearchParams(new URLSearchParams());
  };

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const amenitiesList = ["Parking", "Garden", "Gym", "Swimming Pool", "Security"];

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Browse Homes</h1>
            <p className="text-slate-500">{properties.length} properties found matching your criteria</p>
          </div>
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="md:hidden flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar (Desktop) */}
          <aside className="hidden md:block w-72 shrink-0 space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-display font-bold text-slate-900">Filters</h2>
                <button onClick={resetFilters} className="text-xs font-bold text-primary-600 hover:underline">Reset All</button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                  <select 
                    className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                    value={filters.city}
                    onChange={e => setFilters({...filters, city: e.target.value})}
                  >
                    <option value="">All Cities</option>
                    {cities.map(city => <option key={city.id} value={city.name}>{city.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Property Type</label>
                  <select 
                    className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                    value={filters.type}
                    onChange={e => setFilters({...filters, type: e.target.value})}
                  >
                    <option value="">All Types</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Independent House">Independent House</option>
                    <option value="Builder Floor">Builder Floor</option>
                    <option value="Plot">Plot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Budget Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                      value={filters.minPrice}
                      onChange={e => setFilters({...filters, minPrice: e.target.value})}
                    />
                    <input 
                      type="number" 
                      placeholder="Max" 
                      className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500"
                      value={filters.maxPrice}
                      onChange={e => setFilters({...filters, maxPrice: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Bedrooms</label>
                  <div className="grid grid-cols-5 gap-1">
                    {['1', '2', '3', '4', '5+'].map(num => (
                      <button
                        key={num}
                        onClick={() => setFilters({...filters, bedrooms: num.replace('+', '')})}
                        className={`py-2 text-xs font-bold rounded-lg border transition-colors ${
                          filters.bedrooms === num.replace('+', '') 
                            ? 'bg-primary-600 border-primary-600 text-white' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-primary-500'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Amenities</label>
                  <div className="space-y-2">
                    {amenitiesList.map(amenity => (
                      <label key={amenity} className="flex items-center space-x-2 cursor-pointer group">
                        <div 
                          onClick={() => toggleAmenity(amenity)}
                          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                            filters.amenities.includes(amenity) ? 'bg-primary-600 border-primary-600' : 'bg-slate-50 border-slate-300 group-hover:border-primary-500'
                          }`}
                        >
                          {filters.amenities.includes(amenity) && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <span className="text-sm text-slate-600">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={applyFilters}
                  className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Property Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-slate-200 h-96 rounded-2xl" />
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map(property => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    onSave={handleSave}
                    isSaved={savedIds.includes(property.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 mb-2">No properties found</h3>
                <p className="text-slate-500 mb-6">Try adjusting your filters to find what you're looking for.</p>
                <button 
                  onClick={resetFilters}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-700 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-slate-900">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
              {/* Same filter content as sidebar */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                <select 
                  className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm"
                  value={filters.city}
                  onChange={e => setFilters({...filters, city: e.target.value})}
                >
                  <option value="">All Cities</option>
                  {cities.map(city => <option key={city.id} value={city.name}>{city.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Property Type</label>
                <select 
                  className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm"
                  value={filters.type}
                  onChange={e => setFilters({...filters, type: e.target.value})}
                >
                  <option value="">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Independent House">Independent House</option>
                  <option value="Builder Floor">Builder Floor</option>
                  <option value="Plot">Plot</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Min Price</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm"
                    value={filters.minPrice}
                    onChange={e => setFilters({...filters, minPrice: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Max Price</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm"
                    value={filters.maxPrice}
                    onChange={e => setFilters({...filters, maxPrice: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Amenities</label>
                <div className="grid grid-cols-2 gap-2">
                  {amenitiesList.map(amenity => (
                    <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                      <div 
                        onClick={() => toggleAmenity(amenity)}
                        className={`w-5 h-5 rounded border flex items-center justify-center ${
                          filters.amenities.includes(amenity) ? 'bg-primary-600 border-primary-600' : 'bg-slate-50 border-slate-300'
                        }`}
                      >
                        {filters.amenities.includes(amenity) && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span className="text-sm text-slate-600">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button 
                onClick={resetFilters}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-white transition-colors"
              >
                Reset
              </button>
              <button 
                onClick={applyFilters}
                className="flex-2 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Browse;
