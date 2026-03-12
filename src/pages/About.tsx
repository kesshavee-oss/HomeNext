import React from 'react';
import { CheckCircle2, Users, Home, Shield, Award, Target } from 'lucide-react';

const About = () => {
  const stats = [
    { label: 'Properties', value: '10,000+', icon: Home },
    { label: 'Happy Families', value: '5,000+', icon: Users },
    { label: 'Cities Covered', value: '20+', icon: Target },
    { label: 'Expert Agents', value: '500+', icon: Award },
  ];

  const values = [
    {
      title: 'Transparency',
      description: 'We believe in clear, honest communication about property details, pricing, and legal status.',
      icon: Shield
    },
    {
      title: 'Affordability',
      description: 'Our primary focus is the mid-budget segment, ensuring quality housing is accessible to everyone.',
      icon: CheckCircle2
    },
    {
      title: 'Customer First',
      description: 'Your dream home is our priority. We provide personalized support throughout your journey.',
      icon: Users
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-primary-600 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -ml-48 -mt-48 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full -mr-48 -mb-48 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Redefining Home Search in <span className="text-primary-200">India</span>
          </h1>
          <p className="text-xl text-primary-50 max-w-3xl mx-auto leading-relaxed">
            HomeNest India was founded with a simple mission: to make mid-budget home buying transparent, 
            efficient, and accessible for every Indian family.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center card-hover">
                <div className="bg-primary-50 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-600">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-display font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">Our Mission & Vision</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                In a market often dominated by luxury developments, we saw a gap. Millions of hardworking 
                Indians were looking for quality homes between ₹20 Lakhs and ₹1.5 Crore but struggled with 
                unreliable listings and lack of transparency.
              </p>
              <p className="text-slate-600 mb-8 leading-relaxed">
                HomeNest India was built to bridge this gap. We curate the best mid-budget properties, 
                verify every listing, and connect you with professional agents who understand your needs.
              </p>
              <div className="space-y-4">
                {['Verified Listings Only', 'No Hidden Charges', 'Expert Legal Guidance', 'End-to-End Support'].map(item => (
                  <div key={item} className="flex items-center space-x-3 text-slate-900 font-bold">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000" 
                  alt="Modern Office" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
                <div className="text-primary-600 font-display font-bold text-2xl mb-1">10+ Years</div>
                <div className="text-slate-500 text-sm">Of Real Estate Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold mb-4">Our Core Values</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">The principles that guide everything we do at HomeNest India.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-400">
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-display font-bold mb-4">{value.title}</h3>
                <p className="text-slate-400 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-primary-50 p-12 rounded-[3rem] border border-primary-100">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">Ready to find your dream home?</h2>
            <p className="text-slate-600 mb-10 max-w-2xl mx-auto">
              Join thousands of families who found their perfect mid-budget home with HomeNest India.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/browse" className="w-full sm:w-auto bg-primary-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200">
                Browse Properties
              </a>
              <a href="/contact-agent" className="w-full sm:w-auto bg-white border-2 border-primary-600 text-primary-600 px-8 py-4 rounded-xl font-bold hover:bg-primary-50 transition-all">
                Contact an Agent
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
