import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheck, FaChevronDown } from 'react-icons/fa';
import { IoSearch } from 'react-icons/io5';
import { skillOptions, projectRoleTypeData } from '../data/data';

const FilterModal = ({ isOpen, onClose, filters, onFilterChange }) => {
  const [activeTab, setActiveTab] = useState('status');
  const [showTabsMobile, setShowTabsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleCheckboxChange = (type, value, checked) => {
    let updated = [...filters[type]];
    if (checked) {
      if (!updated.includes(value)) updated.push(value);
    } else {
      updated = updated.filter(item => item !== value);
    }
    onFilterChange({ ...filters, [type]: updated });
  };

  const handlePaidOnlyChange = (e) => {
    onFilterChange({ ...filters, isPaidOnly: e.target.checked });
  };

  const handleClearFilters = () => {
    onFilterChange({
      projectStatus: [],
      projectRoles: [],
      techSkills: [],
      projectBudget: [],
      minXP: [],
      isPaidOnly: false
    });
  };

  const handleApplyFilters = () => {
    onClose();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    count += filters.projectStatus.length;
    count += filters.projectRoles.length;
    count += filters.techSkills.length;
    count += filters.projectBudget.length;
    count += filters.minXP.length;
    if (filters.isPaidOnly) count++;
    return count;
  };

  const filterTabs = [
    { id: 'status', label: 'Status', count: filters.projectStatus.length },
    { id: 'roles', label: 'Project Type', count: filters.projectRoles.length },
    { id: 'skills', label: 'Tech Skills', count: filters.techSkills.length },
    { id: 'budget', label: 'Budget', count: filters.projectBudget.length },
    { id: 'experience', label: 'Experience', count: filters.minXP.length },
  ];

  const CustomCheckbox = ({ id, value, checked, onChange, label }) => (
    <label htmlFor={id} className="flex items-center p-2 hover:bg-gray-50 rounded-sm cursor-pointer">
      <input
        type="checkbox"
        id={id}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div className={`h-5 w-5 rounded flex items-center justify-center border ${checked ? 'bg-primary' : 'border-gray-300'}`}>
        {checked && <FaCheck size={14} className="text-white" />}
      </div>
      <span className="ml-3 text-gray-700">{label}</span>
    </label>
  );

  const filteredSkills = skillOptions.filter(skill =>
    skill.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 rounded-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white w-full h-full rounded-sm sm:shadow-xl sm:w-[95%] sm:max-w-xl sm:h-[90vh] flex flex-col"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header - Fixed */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 bg-white">
            <h3 className="text-lg font-semibold text-gray-900">Filter Projects</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Mobile Tabs - Fixed */}
          <div className="flex-shrink-0 sm:hidden border-b border-gray-200 bg-white">
            <button
              className="flex items-center justify-between w-full p-4 text-left"
              onClick={() => setShowTabsMobile(!showTabsMobile)}
            >
              <div className="flex items-center">
                <span className="font-medium">
                  {filterTabs.find(tab => tab.id === activeTab)?.label || 'Filter'}
                </span>
                {getActiveFiltersCount() > 0 && (
                  <span className="ml-2 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </div>
              <FaChevronDown
                size={20}
                className={`transition-transform ${showTabsMobile ? 'rotate-180' : ''}`}
              />
            </button>
            {showTabsMobile && (
              <motion.div
                className="border-t border-gray-200 bg-gray-50"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {filterTabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`flex items-center justify-between w-full py-3 px-4 text-left ${activeTab === tab.id ? 'bg-gray-100 text-primary font-medium' : 'text-gray-700'
                      }`}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setShowTabsMobile(false);
                    }}
                  >
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Desktop Tabs - Fixed */}
          <div className="hidden sm:flex flex-shrink-0 border-b border-gray-200 bg-white sticky top-0 z-10">
            {filterTabs.map(tab => (
              <button
                key={tab.id}
                className={`py-3 px-4 relative whitespace-nowrap ${activeTab === tab.id ? 'text-primary font-medium' : 'text-gray-600'
                  }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="absolute top-2 right-1 bg-primary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    layoutId="activetab"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="p-4 sm:p-5 space-y-4">
                {/* Status Tab */}
                {activeTab === 'status' && (
                  <div className="space-y-1">
                    <CustomCheckbox
                      id="status-open"
                      value="Open"
                      checked={filters.projectStatus.includes("Open")}
                      onChange={e => handleCheckboxChange('projectStatus', "Open", e.target.checked)}
                      label="Open"
                    />
                    <CustomCheckbox
                      id="status-ongoing"
                      value="Ongoing"
                      checked={filters.projectStatus.includes("Ongoing")}
                      onChange={e => handleCheckboxChange('projectStatus', "Ongoing", e.target.checked)}
                      label="Ongoing"
                    />
                  </div>
                )}

                {/* Roles Tab */}
                {activeTab === 'roles' && (
                  <div className="space-y-1">
                    {projectRoleTypeData.map(role => (
                      <CustomCheckbox
                        key={role}
                        id={`role-${role}`}
                        value={role}
                        checked={filters.projectRoles.includes(role)}
                        onChange={e => handleCheckboxChange('projectRoles', role, e.target.checked)}
                        label={role}
                      />
                    ))}
                  </div>
                )}

                {/* Skills Tab */}
                {activeTab === 'skills' && (
                  <div className="relative">
                    {/* Search Bar - Fixed at top */}
                    <div className="sticky top-0 left-0 right-0 bg-white pt-1 pb-3 z-30">
                      <div className="relative">
                        <IoSearch
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          type="text"
                          placeholder="Search skills..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Skills List - Scrollable */}
                    <div className="mt-2 space-y-1">
                      {filteredSkills.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No skills found</p>
                      ) : (
                        filteredSkills.map(skill => (
                          <CustomCheckbox
                            key={skill}
                            id={`skill-${skill}`}
                            value={skill}
                            checked={filters.techSkills.includes(skill)}
                            onChange={e => handleCheckboxChange('techSkills', skill, e.target.checked)}
                            label={skill}
                          />
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Budget Tab */}
                {activeTab === 'budget' && (
                  <div className="space-y-2">
                    <CustomCheckbox
                      id="budget-free"
                      value="FREE"
                      checked={filters.projectBudget.includes("FREE")}
                      onChange={e => handleCheckboxChange('projectBudget', "FREE", e.target.checked)}
                      label="Free"
                    />
                    <CustomCheckbox
                      id="budget-low"
                      value="$"
                      checked={filters.projectBudget.includes("$")}
                      onChange={e => handleCheckboxChange('projectBudget', "$", e.target.checked)}
                      label="$ (₹0 - ₹10,000)"
                    />
                    <CustomCheckbox
                      id="budget-medium"
                      value="$$"
                      checked={filters.projectBudget.includes("$$")}
                      onChange={e => handleCheckboxChange('projectBudget', "$$", e.target.checked)}
                      label="$$ (₹10,000 - ₹50,000)"
                    />
                    <CustomCheckbox
                      id="budget-high"
                      value="$$$"
                      checked={filters.projectBudget.includes("$$$")}
                      onChange={e => handleCheckboxChange('projectBudget', "$$$", e.target.checked)}
                      label="$$$ (₹50,000 - ₹75,000)"
                    />
                    <CustomCheckbox
                      id="budget-highest"
                      value="$$$$"
                      checked={filters.projectBudget.includes("$$$$")}
                      onChange={e => handleCheckboxChange('projectBudget', "$$$$", e.target.checked)}
                      label="$$$$ (₹75,000+)"
                    />
                    <div className="pt-3 border-t border-gray-200 mt-2">
                      <CustomCheckbox
                        id="paid-only"
                        checked={filters.isPaidOnly}
                        onChange={handlePaidOnlyChange}
                        label="Paid Projects Only"
                      />
                    </div>
                  </div>
                )}

                {/* Experience Tab */}
                {activeTab === 'experience' && (
                  <div className="space-y-2">
                    <CustomCheckbox
                      id="xp-none"
                      value="0"
                      checked={filters.minXP.includes("0")}
                      onChange={e => handleCheckboxChange('minXP', "0", e.target.checked)}
                      label="No Experience (0 XP)"
                    />
                    <CustomCheckbox
                      id="xp-beginner"
                      value="1 - 10"
                      checked={filters.minXP.includes("1 - 10")}
                      onChange={e => handleCheckboxChange('minXP', "1 - 10", e.target.checked)}
                      label="Beginner (1 - 10 XP)"
                    />
                    <CustomCheckbox
                      id="xp-intermediate"
                      value="10 - 50"
                      checked={filters.minXP.includes("10 - 50")}
                      onChange={e => handleCheckboxChange('minXP', "10 - 50", e.target.checked)}
                      label="Intermediate (10 - 50 XP)"
                    />
                    <CustomCheckbox
                      id="xp-advanced"
                      value="50+"
                      checked={filters.minXP.includes("50+")}
                      onChange={e => handleCheckboxChange('minXP', "50+", e.target.checked)}
                      label="Advanced (50+ XP)"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="flex-shrink-0 flex justify-between items-center p-4 sm:p-5 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleClearFilters}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              Clear all
            </button>
            <button
              onClick={handleApplyFilters}
              className="bg-primary text-white px-4 py-2 rounded-sm hover:bg-primary-hover transition-colors font-medium"
            >
              Apply Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

FilterModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    projectStatus: PropTypes.array,
    projectRoles: PropTypes.array,
    techSkills: PropTypes.array,
    projectBudget: PropTypes.array,
    minXP: PropTypes.array,
    isPaidOnly: PropTypes.bool
  }),
  onFilterChange: PropTypes.func.isRequired
};

export default FilterModal;