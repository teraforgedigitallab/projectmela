import React from "react";
import PropTypes from "prop-types";

const GenderTabs = ({ options, selected, onSelect, label = "Gender" }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-black mb-1">{label}</label>
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={`px-4 py-2 rounded-md transition-colors
            ${selected === option
              ? "bg-iconbg text-primary"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-primary hover:text-white hover:border-primary"}
          `}
          onClick={() => onSelect(option)}
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

GenderTabs.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  label: PropTypes.string,
};

export default GenderTabs;