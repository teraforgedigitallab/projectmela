import React from "react";

const brands = [
  { name: 'Bellmonte Industries', logo: '/assets/images/trusted-by/client-01.png' },
  { name: 'Saral Home', logo: '/assets/images/trusted-by/client-02.png' },
  { name: 'Multiplier AI', logo: '/assets/images/trusted-by/client-03.png' },
  { name: 'Step App', logo: '/assets/images/trusted-by/client-04.png' },
  { name: 'Amaara Herbs', logo: '/assets/images/trusted-by/client-05.png' },
  { name: 'A', logo: '/assets/images/trusted-by/client-06.png' },
  { name: 'Faber', logo: '/assets/images/trusted-by/client-07.png' },
  { name: 'Neon World', logo: '/assets/images/trusted-by/client-08.png' },
  { name: 'Ucan', logo: '/assets/images/trusted-by/client-09.png' }
];

const TrustedBy = () => (
  <section className="bg-gray-100 pb-20">
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
        {brands.map((brand, idx) => (
          <img
            key={idx}
            src={brand.logo}
            alt={brand.name}
            className="h-8 opacity-90 hover:opacity-100 hover:brightness-0 transition-brightness duration-300"
            draggable="false"
          />
        ))}
      </div>
    </div>
  </section>
);

export default TrustedBy;