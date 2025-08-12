import React, { useState } from "react";
import {
  FaUniversity,
  FaNetworkWired,
  FaUtensils,
  FaFireExtinguisher,
} from "react-icons/fa";

import { IoSettingsOutline, IoLayersOutline,IoHomeOutline, IoSearchOutline,  } from "react-icons/io5";

const categories = [
  { icon: <IoSettingsOutline />, title: "Technical Support" },
  { icon: <IoLayersOutline />, title: "Business Development" },
  { icon: <IoHomeOutline />, title: "Real Estate Business" },
  { icon: <IoSearchOutline />, title: "Share Maeket Analysis" },
  { icon: <FaUniversity />, title: "Finance & Banking Service" },
  { icon: <FaNetworkWired />, title: "IT & Networking Sevices" },
  { icon: <FaUtensils />, title: "Restaurant Services" },
  { icon: <FaFireExtinguisher />, title: "Defence & Fire Service" },
];

const CategoryCard = ({ icon, title, hovered, onMouseEnter, onMouseLeave }) => (
  <div
    className={`flex flex-col items-center justify-center cursor-pointer bg-white border border-dashed border-gray-400 rounded-sm min-h-[180px] min-w-[200px] m-2 transition-all duration-300 ${
      hovered ? "shadow-xl -translate-y-1" : ""
    }`}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <div className="bg-primary/10 rounded-sm w-14 h-14 flex items-center justify-center mb-3">
      <span className="text-primary text-2xl">{icon}</span>
    </div>
    <div className="text-heading font-medium text-base text-center leading-tight mt-1">
      {title}
    </div>
  </div>
);

const JobCategory = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary text-white rounded-sm px-5 py-2 text-sm font-semibold mb-4 shadow">
            PROJECT CATEGORY
          </div>
          <h2 className="text-heading font-bold text-2xl md:text-3xl text-center mb-2">
            Choose Your Desire Category
          </h2>
          <div className="w-16 h-1 bg-primary rounded mb-4" />
          <p className="text-body text-base text-center max-w-xl mx-auto opacity-85 mb-2">
            There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.
          </p>
        </div>
        <div className="bg-white rounded-sm shadow-lg p-6 md:p-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <CategoryCard
                key={cat.title}
                icon={cat.icon}
                title={cat.title}
                hovered={hovered === idx}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobCategory;