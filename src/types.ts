export interface City {
  id: number;
  name: string;
  image: string;
}

export interface Property {
  id: number;
  name: string;
  city_id: number;
  city_name: string;
  locality: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  amenities: string;
  image: string;
  description: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Visit {
  id: number;
  user_id: number;
  user_name: string;
  property_id: number;
  property_name: string;
  visit_date: string;
  visit_time: string;
  message: string;
  status: 'pending' | 'approved' | 'cancelled';
}

export interface ContactRequest {
  id: number;
  user_id?: number;
  property_id: number;
  property_name: string;
  name: string;
  email: string;
  mobile: string;
  message: string;
  created_at: string;
}
