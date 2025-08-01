import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaClock, FaAward, FaTag, FaBriefcase, FaDollarSign } from 'react-icons/fa';

const ProjectCard = ({
  jobID,
  jobTitle,
  tags = [],
  points,
  minPoints,
  isPromoted,
  chipColor,
  priceRating,
  status,
  projectType = "General Project",
  budget
}) => {
  const renderPriceRating = (rating) => {
    if (rating === 0) return <span className="text-gray-500 font-medium">FREE</span>;
    const activeColor = "text-green-600";
    const inactiveColor = "text-gray-200";
    return (
      <div className="flex">
        {Array.from({ length: 4 }).map((_, i) => (
          <FaDollarSign key={i} className={`h-4 w-4 ${i < rating ? activeColor : inactiveColor}`} />
        ))}
      </div>
    );
  };

  const statusStyles = {
    "Ongoing": "bg-amber-100 text-amber-800 border border-amber-200",
    "Open": "bg-green-100 text-green-800 border border-green-200",
    "Pending": "bg-green-100 text-green-800 border border-green-200",
    "Completed": "bg-blue-100 text-blue-800 border border-blue-200"
  };

  const statusLabel = status === "Pending" ? "Open" : status;
  const statusStyle = statusStyles[statusLabel] || "bg-gray-100 text-gray-800 border border-gray-200";

  const getCompanyLogo = () => {
    const firstChar = jobTitle.charAt(0).toLowerCase();
    const colors = [
      'bg-red-100 text-red-800',
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-yellow-100 text-yellow-800',
      'bg-indigo-100 text-indigo-800',
    ];
    const colorIndex = (firstChar.charCodeAt(0) - 97) % colors.length;
    const selectedColor = colors[colorIndex >= 0 ? colorIndex : 0];
    return (
      <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg ${selectedColor}`}>
        {firstChar.toUpperCase()}
      </div>
    );
  };

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 transition-all hover:shadow-md relative
        sm:p-5 overflow-hidden"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {isPromoted && (
        <div className="absolute top-0 right-0 mt-4 mr-5 z-10 sm:mt-4 sm:mr-5">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-sm border border-blue-200">
            FEATURED
          </span>
        </div>
      )}
      <div className="flex justify-between items-center mb-4 flex-col sm:flex-row gap-3 sm:gap-0">
        <div className="flex items-center w-full sm:w-auto">
          {getCompanyLogo()}
          <div className="ml-4">
            <h3 className="font-semibold text-base md:text-lg text-gray-900 line-clamp-1">{jobTitle}</h3>
            <div className="flex items-center mt-1">
              <FaBriefcase size={14} className="text-gray-500 mr-1.5" />
              <span className="text-sm text-gray-600">
                {projectType}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end md:mt-8">
          <span className={`text-sm px-2.5 py-1 rounded-full font-medium ${statusStyle}`}>
            {statusLabel}
          </span>
          <Link
            to={`/project-detail/${jobID}`}
            className="ml-3 bg-blue-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap flex items-center"
          >
            Apply
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5-5 5M5 12h13" />
            </svg>
          </Link>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.slice(0, 3).map((tag, index) => (
          <span key={index} className="bg-gray-50 text-gray-700 text-sm px-3 py-1 rounded-md border border-gray-200 flex items-center">
            <FaTag size={12} className="mr-1.5 text-gray-500" />
            {tag}
          </span>
        ))}
        {tags.length > 3 && (
          <span className="bg-gray-50 text-gray-700 text-sm px-3 py-1 rounded-md border border-gray-200">
            +{tags.length - 3} more
          </span>
        )}
      </div>
      <div className="flex items-center justify-between text-gray-600 pt-1 border-t border-gray-100 flex-col sm:flex-row gap-2 sm:gap-0">
        <div className="flex items-center space-x-5 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center">
            <FaClock size={16} className="mr-1.5 text-blue-500" />
            <span className="text-sm">Min XP: <span className="font-medium text-gray-800">{minPoints}</span></span>
          </div>
          <div className="flex items-center">
            <FaAward size={16} className="mr-1.5 text-amber-500" />
            <span className="text-sm"><span className="font-medium text-gray-800">{points}</span> Points</span>
          </div>
        </div>
        <div className="text-sm font-medium w-full sm:w-auto flex justify-end sm:justify-start">
          {renderPriceRating(priceRating)}
        </div>
      </div>
    </motion.div>
  );
};

ProjectCard.propTypes = {
  jobID: PropTypes.string.isRequired,
  jobTitle: PropTypes.string.isRequired,
  tags: PropTypes.array,
  points: PropTypes.number,
  minPoints: PropTypes.number,
  isPromoted: PropTypes.bool,
  chipColor: PropTypes.string,
  priceRating: PropTypes.number,
  status: PropTypes.string,
  projectType: PropTypes.string,
  budget: PropTypes.number
};

export default ProjectCard;