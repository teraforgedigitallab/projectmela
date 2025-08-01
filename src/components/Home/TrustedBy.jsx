import React from 'react';
import { motion } from 'framer-motion';

const TrustedBy = () => {
  const companies = [
    { name: 'Bellmonte Industries', logo: '/assets/images/trusted-by/client-01.png' },
    { name: 'Saral Home', logo: '/assets/images/trusted-by/client-02.png' },
    { name: 'Multiplier AI', logo: '/assets/images/trusted-by/client-03.png' },
    { name: 'Step App', logo: '/assets/images/trusted-by/client-04.png' },
    { name: 'Amaara Herbs', logo: '/assets/images/trusted-by/client-05.png' },
    { name: 'A', logo: '/assets/images/trusted-by/client-06.png' },
    { name: 'Faber', logo: '/assets/images/trusted-by/client-07.png' },
    { name: 'Neon World', logo: '/assets/images/trusted-by/client-08.png' },
    { name: 'Ucan', logo: '/assets/images/trusted-by/client-09.png' },
    { name: 'Bellmonte Industries', logo: '/assets/images/trusted-by/client-01.png' }
  ];

  return (
    <section className="py-10 sm:py-16 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col items-center">
          <motion.span
            className="text-lg sm:text-xl text-primary italic font-light mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Trusted by
          </motion.span>
          <div className="w-full">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-x-4 gap-y-8 items-center justify-items-center">
              {companies.map((company, index) => (
                <motion.div
                  key={index}
                  className="grayscale hover:grayscale-0 transition-all duration-300 flex items-center justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                >
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-8 sm:h-10 md:h-12 w-auto object-contain max-w-[90px]"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;