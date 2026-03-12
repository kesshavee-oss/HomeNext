import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, Heart } from 'lucide-react';
import { Property, City } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PropertyCard = ({ property, onSave, isSaved }: { property: Property, onSave?: (id: number) => void, isSaved?: boolean, key?: React.Key }) => {
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(price / 100000).toFixed(2)} L`;
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 card-hover group">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.image}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-primary-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
            {property.type}
          </span>
        </div>
        <button 
          onClick={(e) => {
            e.preventDefault();
            onSave?.(property.id);
          }}
          className={cn(
            "absolute top-4 right-4 p-2 rounded-full shadow-sm transition-colors",
            isSaved ? "bg-red-500 text-white" : "bg-white/90 backdrop-blur-sm text-slate-400 hover:text-red-500"
          )}
        >
          <Heart className={cn("h-5 w-5", isSaved && "fill-current")} />
        </button>
        <div className="absolute bottom-4 left-4">
          <span className="bg-primary-600 text-white text-sm font-bold px-4 py-1.5 rounded-lg shadow-md">
            {formatPrice(property.price)}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-display font-bold text-slate-900 mb-1 line-clamp-1">{property.name}</h3>
        <div className="flex items-center text-slate-500 text-sm mb-4">
          <MapPin className="h-4 w-4 mr-1 text-primary-500" />
          <span className="line-clamp-1">{property.locality}, {property.city_name}</span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 py-4 border-y border-slate-100 mb-5">
          <div className="flex flex-col items-center">
            <Bed className="h-4 w-4 text-slate-400 mb-1" />
            <span className="text-xs font-medium text-slate-600">{property.bedrooms || '-'} BHK</span>
          </div>
          <div className="flex flex-col items-center">
            <Bath className="h-4 w-4 text-slate-400 mb-1" />
            <span className="text-xs font-medium text-slate-600">{property.bathrooms || '-'} Bath</span>
          </div>
          <div className="flex flex-col items-center">
            <Maximize className="h-4 w-4 text-slate-400 mb-1" />
            <span className="text-xs font-medium text-slate-600">{property.area} sqft</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link 
            to={`/property/${property.id}`}
            className="flex-1 text-center py-2.5 rounded-xl border border-primary-600 text-primary-600 text-sm font-bold hover:bg-primary-50 transition-colors"
          >
            View Details
          </Link>
          <Link 
            to={`/contact-agent?propertyId=${property.id}`}
            className="flex-1 text-center py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition-colors"
          >
            Contact Agent
          </Link>
        </div>
      </div>
    </div>
  );
};

export const CityCard = ({ city, count }: { city: City, count: number, key?: React.Key }) => {
  return (
    <Link 
      to={`/browse?city=${city.name}`}
      className="relative aspect-[4/5] rounded-2xl overflow-hidden group card-hover"
    >
      <img
        src={city.image}
        alt={city.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
      <div className="absolute bottom-6 left-6 right-6">
        <h3 className="text-2xl font-display font-bold text-white mb-1">{city.name}</h3>
        <p className="text-slate-200 text-sm mb-4">{count} Available Homes</p>
        <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-white bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg group-hover:bg-primary-600 transition-colors">
          Browse Homes
        </span>
      </div>
    </Link>
  );
};
