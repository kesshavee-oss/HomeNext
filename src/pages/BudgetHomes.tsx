import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IndianRupee, ArrowRight } from 'lucide-react';
import { Property } from '../types';
import { PropertyCard } from '../components/Cards';

const BudgetHomes = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
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

    fetch('/api/properties')
      .then(res => res.json())
      .then(data => {
        setProperties(data);
        setLoading(false);
      });
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

  const budgetSegments = [
    { title: 'Homes under ₹40L', min: 2000000, max: 4000000 },
    { title: 'Homes under ₹70L', min: 4000000, max: 7000000 },
    { title: 'Homes under ₹1Cr', min: 7000000, max: 10000000 },
    { title: 'Homes under ₹1.5Cr', min: 10000000, max: 15000000 },
  ];

  const getPropertiesByBudget = (min: number, max: number) => {
    return properties.filter(p => p.price >= min && p.price <= max).slice(0, 4);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Budget Homes</h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Explore our handpicked collection of properties categorized by budget to help you find your dream home within your financial reach.
          </p>
        </div>

        {loading ? (
          <div className="space-y-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-8 bg-slate-200 w-48 mb-6 rounded" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map(j => <div key={j} className="h-72 bg-slate-200 rounded-2xl" />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-20">
            {budgetSegments.map(segment => {
              const segmentProperties = getPropertiesByBudget(segment.min, segment.max);
              if (segmentProperties.length === 0) return null;

              return (
                <section key={segment.title}>
                  <div className="flex justify-between items-end mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary-600 p-2 rounded-lg text-white">
                        <IndianRupee className="h-5 w-5" />
                      </div>
                      <h2 className="text-2xl font-display font-bold text-slate-900">{segment.title}</h2>
                    </div>
                    <a 
                      href={`/browse?minPrice=${segment.min}&maxPrice=${segment.max}`}
                      className="text-primary-600 font-bold flex items-center hover:underline"
                    >
                      View All <ArrowRight className="h-4 w-4 ml-2" />
                    </a>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {segmentProperties.map(property => (
                      <PropertyCard 
                        key={property.id} 
                        property={property} 
                        onSave={handleSave}
                        isSaved={savedIds.includes(property.id)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetHomes;
