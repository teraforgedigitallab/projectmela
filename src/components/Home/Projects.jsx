import { useEffect, useState } from 'react';
import { collection, where, query, onSnapshot } from 'firebase/firestore';
import { FaFilter, FaSearch, FaTag, FaDollarSign } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import FilterModal from './FilterModal';
import Pagination from './Pagination';
import { db } from '../../firebaseConfig/firebase.js';
import { getPriceRating, getChipColorFromStatus } from '../../utils/function.jsx';

const ProjectCard = ({
  jobID,
  jobTitle,
  tags = [],
  minPoints,
  priceRating,
  status,
  projectType = "General Project",
  about = "",
}) => {
  const getLetterLogo = () => {
    const firstChar = jobTitle?.charAt(0)?.toUpperCase() || 'P';
    // Professional color palette
    const colors = [
      'bg-green-200text-white',
      'bg-blue-200 text-white',
      'bg-yellow-200 text-white',
      'bg-purple-200 text-white',
      'bg-pink-200 text-white',
      'bg-orange-200 text-white',
      'bg-red-200 text-white',
      'bg-indigo-200 text-white',
      'bg-teal-200 text-white',
    ];
    const colorIndex = (firstChar.charCodeAt(0) - 65) % colors.length;
    const selectedColor = colors[colorIndex >= 0 ? colorIndex : 0];
    return (
      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-2xl shadow-sm ${selectedColor}`}>
        {firstChar}
      </div>
    );
  };

  // Status button style
  const statusMap = {
    "Ongoing": { label: "Ongoing", color: "bg-primary text-white" },
    "Pending": { label: "Open", color: "bg-primary text-white" },
    "Open": { label: "Open", color: "bg-primary text-white" },
    "Completed": { label: "Completed", color: "bg-gray-200 text-gray-700" },
    "Intern": { label: "Intern", color: "bg-primary text-white" },
    "Part Time": { label: "Part Time", color: "bg-primary text-white" },
    "Full Time": { label: "Full Time", color: "bg-primary text-white" },
  };
  // Fallback to status text if not mapped
  const statusObj = statusMap[status] || { label: status, color: "bg-primary text-white" };

  // Price indicator
  const renderPriceRating = (rating) => {
    if (rating === 0) return <span className="text-gray-500 font-medium">FREE</span>;
    const activeColor = "text-primary";
    const inactiveColor = "text-primary/20";
    return (
      <div className="flex items-center">
        {Array.from({ length: 4 }).map((_, i) => (
          <FaDollarSign key={i} className={`h-4 w-4 ${i < rating ? activeColor : inactiveColor}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-md hover:shadow-lg p-10 flex flex-col gap-4 md:gap-0 md:flex-row items-start md:items-center justify-between">
      {/* Left: Logo and content */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center justify-center">
          {getLetterLogo()}
        </div>
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Title and Buttons */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <h4 className="text-md font-semibold text-gray-900 mb-0">
              <Link to={`/project-detail/${jobID}`} className="hover:text-primary transition">{jobTitle}</Link>
            </h4>
            {/* Buttons (Apply, Status) */}
            <div className="flex gap-2">
              <span
                className="px-5 py-1.5 rounded bg-white border border-gray-600 text-primary font-semibold text-sm hover:bg-primary hover:text-white transition"
              >
                {statusObj.label}
              </span>

              <Link
                to={`/project-detail/${jobID}`}
                className={`px-5 py-1.5 rounded font-semibold text-sm capitalize ${statusObj.color}`}
              >
                Apply
              </Link>
            </div>
          </div>
          {/* About */}
          <hr className="my-4 border-gray-400" />
          <p className="text-gray-600 mb-4 text-sm line-clamp-2">
            {about || projectType}
          </p>
          {/* Tabs: Skills, Price, XP */}
          <div className="flex flex-wrap gap-2">
            {/* Tech Skills */}
            <div className="bg-primary/5 text-primary px-3 py-1 rounded flex items-center gap-1 text-xs font-medium">
              <FaTag className="text-primary" />
              {tags.length > 0 ? tags.slice(0, 2).join(', ') : "No Skills"}
              {tags.length > 2 && <span className="ml-1 text-primary">+{tags.length - 2}</span>}
            </div>
            {/* Price */}
            <div className="bg-primary/5 text-primary px-3 py-1 rounded flex items-center gap-1 text-xs font-medium">
              {renderPriceRating(priceRating)}
            </div>
            {/* Min XP */}
            <div className="bg-primary/5 text-primary px-3 py-1 rounded flex items-center gap-1 text-xs font-medium">
              <span>Min XP:</span>
              <span className="font-bold">{minPoints}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

  // --- Filtering logic ---
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
    let filtered = [...jobs];
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(job =>
        job.jobTitle.toLowerCase().includes(term) ||
        job.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    if (filters.projectStatus.length > 0) {
      filtered = filtered.filter(job =>
        (filters.projectStatus.includes("Ongoing") && job.status === "Ongoing") ||
        (filters.projectStatus.includes("Open") && job.status === "Pending")
      );
    }
    if (filters.projectRoles.length > 0) {
      filtered = filtered.filter(job =>
        filters.projectRoles.includes(job.projectType)
      );
    }
    if (filters.techSkills.length > 0) {
      filtered = filtered.filter(job =>
        job.tags.some(tag => filters.techSkills.includes(tag))
      );
    }
    if (filters.projectBudget.length > 0) {
      filtered = filtered.filter(job =>
        filters.projectBudget.some(budget => matchesBudgetFilter(job.budget, budget))
      );
    }
    if (filters.minXP.length > 0) {
      filtered = filtered.filter(job =>
        filters.minXP.some(xp => matchesXPFilter(job.minPoints, xp))
      );
    }
    if (filters.isPaidOnly) {
      filtered = filtered.filter(job => job.budget > 0);
    }
    setFilteredJobs(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    setDisplayedJobs(filteredJobs.slice(indexOfFirstJob, indexOfLastJob));
  }, [filteredJobs, currentPage, jobsPerPage]);

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
            location: doc.data().location || "Remote",
            about: doc.data().about || "",
          }));
        jobsData.sort((a, b) => b.isStickPostonTop - a.isStickPostonTop);
        setJobs(jobsData);
        setFilteredJobs(jobsData);
      }
    );
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, jobs, searchTerm]);

  const handleFilterChange = (newFilters) => setFilters(newFilters);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleSearch = (e) => { e.preventDefault(); applyFilters(); };

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

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <section className="find-job section py-12 bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Section Title */}
        <div className="text-center mb-12">
          <span className="inline-block bg-primary text-white px-4 py-1 rounded-full font-semibold text-xs mb-2">HOT JOBS</span>
          <h2 className="text-4xl font-bold mb-3 text-gray-900">Browse Recent Jobs</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form.
          </p>
        </div>
        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-10">
          <form onSubmit={handleSearch} className="w-full md:w-2/3 lg:w-1/2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by keyword or tag..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaSearch size={20} />
              </button>
            </div>
          </form>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="bg-primary text-white px-6 py-3 rounded-sm flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            <FaFilter size={20} className="mr-2" />
            Filter
            {getActiveFiltersCount() > 0 && (
              <span className="ml-1.5 bg-white text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>
        </div>
        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedJobs.length > 0 ? (
            displayedJobs.map((job) => (
              <ProjectCard key={job.jobID} {...job} />
            ))
          ) : (
            <div className="bg-white rounded-sm p-8 text-center col-span-1 md:col-span-2">
              <h3 className="text-xl font-semibold mb-2">No Projects Found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more results.</p>
            </div>
          )}
        </div>
        {/* Pagination */}
        {filteredJobs.length > 0 && (
          <div className="flex justify-center mt-10">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
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