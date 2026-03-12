import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Building2, IndianRupee, ArrowRight } from 'lucide-react';
import { City, Property } from '../types';
import { CityCard, PropertyCard } from '../components/Cards';

const Home = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [searchParams, setSearchParams] = useState({ city: '', type: '', budget: '' });
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

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
      .then(data => setCities(data.slice(0, 8)));

    fetch('/api/properties')
      .then(res => res.json())
      .then(data => setFeaturedProperties(data.slice(0, 6)));
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchParams.city) params.append('city', searchParams.city);
    if (searchParams.type) params.append('type', searchParams.type);
    if (searchParams.budget) {
      const [min, max] = searchParams.budget.split('-');
      if (min) params.append('minPrice', min);
      if (max) params.append('maxPrice', max);
    }
    navigate(`/browse?${params.toString()}`);
  };

  const budgetCategories = [
    { label: '₹20L – ₹40L', value: '2000000-4000000', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    { label: '₹40L – ₹70L', value: '4000000-7000000', color: 'bg-blue-50 text-blue-700 border-blue-100' },
    { label: '₹70L – ₹1Cr', value: '7000000-10000000', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
    { label: '₹1Cr – ₹1.5Cr', value: '10000000-15000000', color: 'bg-purple-50 text-purple-700 border-purple-100' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=1920"
            alt="Modern Indian Home"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-900/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Find Your Perfect <span className="text-primary-400">Mid-Budget</span> Home Across India
            </h1>
            <p className="text-lg text-slate-100 mb-10 max-w-lg">
              Discover affordable and mid-range properties in 20+ cities. 
              From cozy apartments to spacious villas, your dream home is just a search away.
            </p>

            <form onSubmit={handleSearch} className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-4 py-3 border-r border-slate-100">
                <MapPin className="h-5 w-5 text-primary-500 mr-3" />
                <select 
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-700 font-medium"
                  value={searchParams.city}
                  onChange={e => setSearchParams({...searchParams, city: e.target.value})}
                >
                  <option value="">Select City</option>
                  {cities.map(city => <option key={city.id} value={city.name}>{city.name}</option>)}
                </select>
              </div>
              <div className="flex-1 flex items-center px-4 py-3 border-r border-slate-100">
                <Building2 className="h-5 w-5 text-primary-500 mr-3" />
                <select 
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-700 font-medium"
                  value={searchParams.type}
                  onChange={e => setSearchParams({...searchParams, type: e.target.value})}
                >
                  <option value="">Property Type</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Independent House">Independent House</option>
                  <option value="Builder Floor">Builder Floor</option>
                  <option value="Plot">Plot</option>
                </select>
              </div>
              <div className="flex-1 flex items-center px-4 py-3">
                <IndianRupee className="h-5 w-5 text-primary-500 mr-3" />
                <select 
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-700 font-medium"
                  value={searchParams.budget}
                  onChange={e => setSearchParams({...searchParams, budget: e.target.value})}
                >
                  <option value="">Budget Range</option>
                  <option value="2000000-4000000">₹20L - ₹40L</option>
                  <option value="4000000-7000000">₹40L - ₹70L</option>
                  <option value="7000000-10000000">₹70L - ₹1Cr</option>
                  <option value="10000000-15000000">₹1Cr - ₹1.5Cr</option>
                </select>
              </div>
              <button type="submit" className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors flex items-center justify-center">
                <Search className="h-5 w-5 mr-2" />
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Budget Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Browse by Budget</h2>
            <p className="text-slate-500">Find homes that fit your financial plan perfectly.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {budgetCategories.map((cat) => (
              <Link
                key={cat.label}
                to={`/browse?minPrice=${cat.value.split('-')[0]}&maxPrice=${cat.value.split('-')[1]}`}
                className={`p-8 rounded-2xl border ${cat.color} hover:shadow-lg transition-all text-center group`}
              >
                <div className="text-2xl font-display font-bold mb-2">{cat.label}</div>
                <div className="flex items-center justify-center text-sm font-bold uppercase tracking-wider opacity-70 group-hover:opacity-100">
                  View Homes <ArrowRight className="h-4 w-4 ml-2" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cities */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Featured Cities</h2>
              <p className="text-slate-500">Explore properties in India's most vibrant urban centers.</p>
            </div>
            <Link to="/cities" className="text-primary-600 font-bold flex items-center hover:underline">
              View All Cities <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {cities.map(city => (
              <CityCard key={city.id} city={city} count={50} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Featured Properties</h2>
              <p className="text-slate-500">Handpicked mid-budget homes for your consideration.</p>
            </div>
            <Link to="/browse" className="text-primary-600 font-bold flex items-center hover:underline">
              Browse All <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map(property => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                onSave={handleSave}
                isSaved={savedIds.includes(property.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
