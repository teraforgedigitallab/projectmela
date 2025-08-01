import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import Badge from "./Badge";

const SkillsMultiSelect = ({
  options,
  selectedSkills,
  setSelectedSkills,
  label = "Skills",
  placeholder = "Search or select skills...",
  maxSkills = 20,
}) => {
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const inputRef = useRef();

  const filteredOptions = options.filter(
    (skill) =>
      skill.toLowerCase().includes(search.toLowerCase()) &&
      !selectedSkills.includes(skill)
  );

  const handleSelect = (skill) => {
    if (selectedSkills.length < maxSkills) {
      setSelectedSkills([...selectedSkills, skill]);
      setSearch("");
      inputRef.current.focus();
    }
  };

  const handleRemove = (skill) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-black mb-1">{label}</label>
      <div className="relative">
        <div
          className="flex flex-wrap gap-2 mb-2"
          aria-label="Selected skills"
        >
          {selectedSkills.map((skill) => (
            <Badge
              key={skill}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded flex items-center"
            >
              {skill}
              <button
                type="button"
                className="ml-2 text-blue-500 hover:text-red-500 focus:outline-none"
                onClick={() => handleRemove(skill)}
                aria-label={`Remove ${skill}`}
              >
                &times;
              </button>
            </Badge>
          ))}
        </div>
        <input
          ref={inputRef}
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary transition"
          placeholder={placeholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setDropdownOpen(true);
          }}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setTimeout(() => setDropdownOpen(false), 100)}
        />
        {dropdownOpen && filteredOptions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded shadow max-h-60 overflow-y-auto mt-1">
            {filteredOptions.map((skill) => (
              <li
                key={skill}
                className="px-4 py-2 cursor-pointer hover:bg-blue-50"
                onMouseDown={() => handleSelect(skill)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSelect(skill);
                }}
              >
                {skill}
              </li>
            ))}
          </ul>
        )}
        {selectedSkills.length >= maxSkills && (
          <div className="text-xs text-red-500 mt-1">
            You can select up to {maxSkills} skills.
          </div>
        )}
      </div>
    </div>
  );
};

SkillsMultiSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedSkills: PropTypes.arrayOf(PropTypes.string).isRequired,
  setSelectedSkills: PropTypes.func.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  maxSkills: PropTypes.number,
};

export default SkillsMultiSelect;