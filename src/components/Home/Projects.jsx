import { useEffect, useState } from 'react';
import { collection, where, query, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { FaFilter, FaSearch } from 'react-icons/fa';

import ProjectCard from './ProjectCard';
import FilterModal from './FilterModal';
import Pagination from './Pagination';
import { db } from '../../firebaseConfig/firebase.js';
import { getPriceRating, getChipColorFromStatus } from '../../utils/function.jsx';

const Projects = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [displayedJobs, setDisplayedJobs] = useState([]);
  const [filters, setFilters] = useState({
    projectStatus: [],
    projectRoles: [],
    techSkills: [],
    projectBudget: [],
    minXP: [],
    isPaidOnly: false
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(8);

  const matchesBudgetFilter = (budget, filterValue) => {
    switch (filterValue) {
      case "FREE":
        return budget < 1;
      case "$":
        return budget > 0 && budget <= 10000;
      case "$$":
        return budget > 10000 && budget <= 50000;
      case "$$$":
        return budget > 50000 && budget <= 75000;
      case "$$$$":
        return budget > 75000;
      default:
        return true;
    }
  };

  const matchesXPFilter = (xp, filterValue) => {
    switch (filterValue) {
      case "0":
        return xp === 0;
      case "1 - 10":
        return xp > 0 && xp <= 10;
      case "10 - 50":
        return xp > 10 && xp <= 50;
      case "50+":
        return xp > 50;
      default:
        return true;
    }
  };

  const applyFilters = () => {
    // Start with all jobs
    let filtered = [...jobs];

    // Apply search filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(job => 
        job.jobTitle.toLowerCase().includes(term) || 
        job.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Project Status Filter
    if (filters.projectStatus.length > 0) {
      filtered = filtered.filter(job =>
        (filters.projectStatus.includes("Ongoing") && job.status === "Ongoing") ||
        (filters.projectStatus.includes("Open") && job.status === "Pending")
      );
    }

    // Project Roles Filter
    if (filters.projectRoles.length > 0) {
      filtered = filtered.filter(job =>
        filters.projectRoles.includes(job.projectType)
      );
    }

    // Tech Skills Filter
    if (filters.techSkills.length > 0) {
      filtered = filtered.filter(job =>
        job.tags.some(tag => filters.techSkills.includes(tag))
      );
    }

    // Project Budget Filter
    if (filters.projectBudget.length > 0) {
      filtered = filtered.filter(job =>
        filters.projectBudget.some(budget => matchesBudgetFilter(job.budget, budget))
      );
    }

    // Min XP Filter
    if (filters.minXP.length > 0) {
      filtered = filtered.filter(job =>
        filters.minXP.some(xp => matchesXPFilter(job.minPoints, xp))
      );
    }

    // Paid Only Filter
    if (filters.isPaidOnly) {
      filtered = filtered.filter(job => job.budget > 0);
    }

    setFilteredJobs(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Update displayed jobs when filtered jobs or current page changes
  useEffect(() => {
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    setDisplayedJobs(filteredJobs.slice(indexOfFirstJob, indexOfLastJob));
  }, [filteredJobs, currentPage, jobsPerPage]);

  // Fetch jobs from Firebase
  useEffect(() => {
    const projectsRef = collection(db, "Projects");

    const unsubscribe = onSnapshot(
      query(projectsRef, where("status", "in", ["Pending", "Ongoing"])),
      (querySnapshot) => {
        const jobsData = querySnapshot.docs
          .map((doc) => ({
            jobID: doc.id,
            jobTitle: doc.data().projectTitle,
            tags: doc.data().techStack || [],
            points: doc.data().points || 0,
            minPoints: doc.data().minXP || 0,
            isPromoted: doc.data().isStickPostonTop > 0,
            chipColor: getChipColorFromStatus(doc.data().status),
            priceRating: getPriceRating(doc.data().budget),
            isStickPostonTop: doc.data().isStickPostonTop,
            status: doc.data().status,
            budget: doc.data().budget,
            projectType: doc.data().projectType || "Updates / Modifications",
          }));

        jobsData.sort((a, b) => b.isStickPostonTop - a.isStickPostonTop);
        setJobs(jobsData);
        setFilteredJobs(jobsData);
      }
    );

    return () => unsubscribe();
  }, []);

  // Effect to apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [filters, jobs, searchTerm]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  // Count active filters
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

  // Calculate total pages
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-center mb-6">Browse Jobs</h2>
          <p className="text-center text-gray-600 mb-10 max-w-3xl mx-auto">
            Find the perfect tech project that matches your skills and experience level. From web development to mobile apps and more.
          </p>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-8">
            <form onSubmit={handleSearch} className="w-full md:w-2/3 lg:w-1/2">
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search by keyword or tag..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
                <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FaSearch size={20} />
                </button>
              </div>
            </form>
            
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition-colors"
            >
              <FaFilter size={20} className="mr-2" />
              Filter
              {getActiveFiltersCount() > 0 && (
                <span className="ml-1.5 bg-white text-indigo-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>
          </div>
        </motion.div>
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {displayedJobs.length > 0 ? (
            displayedJobs.map((job, index) => (
              <motion.div
                key={job.jobID}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ProjectCard {...job} />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg p-8 text-center col-span-1 md:col-span-2 lg:col-span-2"
            >
              <h3 className="text-xl font-semibold mb-2">No Projects Found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more results.</p>
            </motion.div>
          )}
        </div>
        
        {/* Pagination */}
        {filteredJobs.length > 0 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      
      {/* Filter Modal */}
      {isFilterModalOpen && (
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      )}
    </section>
  );
};

export default Projects;