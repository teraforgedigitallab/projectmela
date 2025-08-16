import { useEffect, useState } from "react";
import { collection, where, query, onSnapshot } from "firebase/firestore";
import {
  FaFilter,
  FaSearch,
  FaTag,
  FaDollarSign,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";
import { MdStars } from "react-icons/md";
import { Link, useLocation, useParams } from "react-router-dom";
import { FilterModal, Pagination } from "../components";
import { ProfileBanner } from "../components";
import { db } from "../firebaseConfig/firebase.js";
import { getAuth } from "firebase/auth";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { getPriceRating, getChipColorFromStatus, getDisplayStatus } from "../utils/function.jsx";
import { StatusBadge } from "../ui";

const ProjectCard = ({
  jobID,
  bookmarkedJobIDs = [],
  setBookmarkedJobIDs,
  jobTitle,
  tags = [],
  minPoints,
  priceRating,
  status,
  projectType = "General Project",
  about = "",
  points,
  isPromoted,
}) => {
  // const [jobData, setJobData] = useState(undefined);
  const { id } = useParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const isBookmarked = bookmarkedJobIDs.includes(jobID);
  const [jobData, setJobData] = useState(null);

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const jobDoc = doc(db, "Projects", id);
        const jobSnapshot = await getDoc(jobDoc);

        if (jobSnapshot.exists()) {
          setJobData(jobSnapshot.data());
        } else {
          setJobData(null);
        }
      } catch (error) {
        setJobData(null);
      } finally {
      }
    };

    fetchJobData();
  }, [id]);

  const handleBookmark = async () => {
    setIsProcessing(true);
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, "Users", user.email);
    try {
      const userDoc = await getDoc(userDocRef);
      let bookmarks =
        userDoc.exists() && userDoc.data().bookmarks
          ? userDoc.data().bookmarks
          : [];
      if (isBookmarked) {
        bookmarks = bookmarks.filter((b) => b.jobID !== jobID);
      } else {
        bookmarks = [
          ...bookmarks,
          {
            jobID,
            jobTitle,
            projectType,
          },
        ];
      }
      await updateDoc(userDocRef, { bookmarks });
      setBookmarkedJobIDs(bookmarks.map((b) => b.jobID));
    } catch (error) {
      console.log("Error updating bookmarks:", error);
    }
    setIsProcessing(false);
  };

  // Price indicator
  const renderPriceRating = (rating) => {
    if (rating === 0)
      return <span className="text-gray-500 font-medium">FREE</span>;
    const activeColor = "text-primary";
    const inactiveColor = "text-primary/20";
    return (
      <div className="flex items-center">
        {Array.from({ length: 4 }).map((_, i) => (
          <FaDollarSign
            key={i}
            className={`h-4 w-4 ${i < rating ? activeColor : inactiveColor}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-sm hover:shadow-lg p-10 pt-15 flex flex-col gap-4 md:gap-0 md:flex-row items-start md:items-center justify-between relative">
      {isPromoted && (
        <div className="absolute left-0 top-0 z-20">
          <span className="featured-ribbon">FEATURED</span>
        </div>
      )}

      {/* Left: Logo and content */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1 ">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="absolute top-4 right-4 z-10">
            {/* Bookmark Button */}
            <button
              onClick={handleBookmark}
              className="text-primary transition duration-300 cursor-pointer"
              aria-label={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
              disabled={isProcessing}
            >
              {isBookmarked ? (
                <FaBookmark size={22} className="text-primary" />
              ) : (
                <FaRegBookmark size={22} />
              )}
            </button>
          </div>

          <div className="flex items-start justify-between gap-4 mb-2">
            {/* Title and Status */}
            <div className="flex-1 min-w-0">
              <h4 className="text-md font-semibold text-gray-900 mb-1 break-words">
                <Link
                  to={`/project-detail/${jobID}`}
                  className="hover:text-primary transition"
                >
                  {jobTitle}
                </Link>
              </h4>
              <StatusBadge status={getDisplayStatus(status)} />
            </div>
            {/* Min XP and Apply */}
            <div className="flex items-center gap-2 flex-shrink-0 ml-4">
              <div className="bg-primary/5 text-primary px-3 py-2 rounded flex items-center gap-1 text-xs font-medium">
                <span>Min XP:</span>
                <span className="font-bold">{minPoints}</span>
              </div>
              <Link
                to={`/project-detail/${jobID}`}
                className="px-5 py-1.5 rounded font-semibold text-sm capitalize bg-primary text-white hover:bg-primary-hover transition duration-300 shadow-sm ease-in-out text-center"
              >
                Apply
              </Link>
            </div>
          </div>

          {/* About */}
          <hr className="my-4 border-gray-400" />

          {/* Tabs: Skills, Price, XP */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Project Type */}
            <span className="rounded-sm bg-primary/5 px-2 py-1 text-xs text-primary font-bold">
              {about || projectType}
            </span>

            {/* Price */}
            <div className="bg-primary/5 text-primary px-3 py-1 rounded flex items-center gap-1 text-xs font-medium">
              {renderPriceRating(priceRating)}
            </div>

            {/* Project XP */}
            <div className="flex items-center gap-1 relative group">
              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 bg-black text-white text-xs rounded-sm px-3 py-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-30 text-center shadow-lg">
                Earn XP points by doing projects, More points you have bigger
                projects you can apply for
              </div>
              <MdStars className="text-warning" size={18} />
              <span className="font-medium text-xs text-primary">
                {points || 0} XP
              </span>
            </div>
          </div>

          {/* Tech Skills */}
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.length > 0 ? (
              <>
                {tags.slice(0, 8).map((tag, idx) => (
                  <span
                    key={tag}
                    className="bg-primary/5 text-gray-700 px-2 py-0.5 rounded text-xs font-medium flex gap-2"
                  >
                    <FaTag className="text-gray-700 mt-0.5" />
                    {tag}
                  </span>
                ))}
                {tags.length > 8 && (
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium">
                    +{tags.length - 8}
                  </span>
                )}
              </>
            ) : (
              <span className="text-gray-400">No Skills</span>
            )}
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
  const [bookmarkedJobIDs, setBookmarkedJobIDs] = useState([]);
  const [filters, setFilters] = useState({
    projectStatus: [],
    projectRoles: [],
    techSkills: [],
    projectBudget: [],
    minXP: [],
    isPaidOnly: false,
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.jobTitle.toLowerCase().includes(term) ||
          job.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    }
    if (filters.projectStatus.length > 0) {
      filtered = filtered.filter(
        (job) =>
          (filters.projectStatus.includes("Ongoing") &&
            job.status === "Ongoing") ||
          (filters.projectStatus.includes("Open") && job.status === "Pending")
      );
    }
    if (filters.projectRoles.length > 0) {
      filtered = filtered.filter((job) =>
        filters.projectRoles.includes(job.projectType)
      );
    }
    if (filters.techSkills.length > 0) {
      filtered = filtered.filter((job) =>
        job.tags.some((tag) => filters.techSkills.includes(tag))
      );
    }
    if (filters.projectBudget.length > 0) {
      filtered = filtered.filter((job) =>
        filters.projectBudget.some((budget) =>
          matchesBudgetFilter(job.budget, budget)
        )
      );
    }
    if (filters.minXP.length > 0) {
      filtered = filtered.filter((job) =>
        filters.minXP.some((xp) => matchesXPFilter(job.minPoints, xp))
      );
    }
    if (filters.isPaidOnly) {
      filtered = filtered.filter((job) => job.budget > 0);
    }
    setFilteredJobs(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    setDisplayedJobs(filteredJobs.slice(indexOfFirstJob, indexOfLastJob));
  }, [filteredJobs, currentPage, jobsPerPage]);

  // Fetch bookmarks on mount
  useEffect(() => {
    const fetchBookmarks = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
      const userDocRef = doc(db, "Users", user.email);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists() && userDoc.data().bookmarks) {
        setBookmarkedJobIDs(userDoc.data().bookmarks.map((b) => b.jobID));
      }
    };
    fetchBookmarks();
  }, []);

  useEffect(() => {
    const projectsRef = collection(db, "Projects");
    const unsubscribe = onSnapshot(
      query(projectsRef, where("status", "in", ["Pending", "Ongoing"])),
      (querySnapshot) => {
        const jobsData = querySnapshot.docs.map((doc) => ({
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
  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
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

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const location = useLocation();
  const isHome = location.pathname === "/";

  const jobsToDisplay = isHome ? jobs.slice(0, 6) : displayedJobs;

  return (
    <section className="find-job section pb-12 bg-gray-100 min-h-screen">
      {location.pathname === "/projects" && (
        <ProfileBanner
          title="Browse Recent Projects"
          subtitle="Business plan draws on a wide range of knowledge from different business disciplines. Business draws on a wide range of different business."
          breadcrumbs={[
            { name: "Home", href: "/" },
            { name: "Projects", href: "/projects" },
          ]}
        />
      )}

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Search and Filter Bar */}
        {!isHome && (
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
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
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
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobsToDisplay.length > 0 ? (
            jobsToDisplay.map((job) => (
              <ProjectCard
                key={job.jobID}
                {...job}
                bookmarkedJobIDs={bookmarkedJobIDs}
                setBookmarkedJobIDs={setBookmarkedJobIDs}
              />
            ))
          ) : (
            <div className="bg-white rounded-sm p-8 text-center col-span-1 md:col-span-2">
              <h3 className="text-xl font-semibold mb-2">No Projects Found</h3>
              <p className="text-gray-600">
                Try adjusting your filters to see more results.
              </p>
            </div>
          )}
        </div>

        {/* See More button for home page */}
        {isHome && jobs.length > 6 && (
          <div className="flex justify-end mt-8">
            <Link
              to="/projects"
              className="px-6 py-3 text-primary font-semibold"
            >
              See More Projects
            </Link>
          </div>
        )}

        {/* Pagination */}
        {!isHome && filteredJobs.length > 0 && (
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
      {!isHome && isFilterModalOpen && (
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
