import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sideTestimonialSigninData, sideTestimonialListJobData } from '../../data/data';

const Testimonials = () => {
  const [activeTab, setActiveTab] = useState('freelancers');
  const [testimonials, setTestimonials] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Set testimonials based on the active tab
    if (activeTab === 'freelancers') {
      setTestimonials(sideTestimonialSigninData);
    } else {
      setTestimonials(sideTestimonialListJobData);
    }
    
    // Reset index when changing tabs
    setActiveIndex(0);
  }, [activeTab]);

  useEffect(() => {
    // Auto-rotate testimonials every 5 seconds
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <motion.div 
      className="container mx-auto bg-white rounded-lg shadow-sm border border-gray-200 px-8 py-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-6">What People Say</h3>
      
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          className={`py-2 px-4 font-medium transition-colors ${activeTab === 'freelancers' ? 'border-b-2 border-primary text-primary' : 'text-gray-600 hover:text-gray-900'}`}
          onClick={() => setActiveTab('freelancers')}
        >
          Freelancers
        </button>
        <button 
          className={`py-2 px-4 font-medium transition-colors ${activeTab === 'clients' ? 'border-b-2 border-primary text-primary' : 'text-gray-600 hover:text-gray-900'}`}
          onClick={() => setActiveTab('clients')}
        >
          Clients
        </button>
      </div>
      
      {testimonials.length > 0 && (
        <div className="relative overflow-hidden">
          <div 
            className="transition-all duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            <div className="flex">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/images/resume/avatar.png';
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.designation}, {testimonial.institution}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full mx-1 transition-colors ${activeIndex === index ? 'bg-primary' : 'bg-gray-300'}`}
                onClick={() => setActiveIndex(index)}
              ></button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Testimonials;