import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { LuMapPin, LuCoins } from "react-icons/lu";
import { FaFilter, FaGithub, FaLinkedin, FaInstagram, FaGlobe } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { Pagination, ProfileBanner } from "../components";
import { Button, InputField } from "../ui";

// Custom Filter Modal Component
const CustomFilterModal = ({
  isOpen,
  onClose,
  filterOptions,
  currentFilters,
  onApply,
  positions,
  allSkills,
}) => {
  const [tempFilters, setTempFilters] = useState(currentFilters);
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillSearch, setSkillSearch] = useState("");

  // Update filteredSkills to handle the new object format
  const filteredSkills = useMemo(
    () =>
      allSkills.filter((skill) =>
        skill.label.toLowerCase().includes(skillSearch.toLowerCase())
      ),
    [allSkills, skillSearch]
  );

  useEffect(() => {
    setTempFilters(currentFilters);
    setSelectedPosition(currentFilters.position || "");
    setSelectedSkills(currentFilters.skills ? [currentFilters.skills] : []);
  }, [currentFilters, isOpen]);

  const handleChange = (id, value) => {
    setTempFilters((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handlePositionSelect = (position) => {
    setSelectedPosition(position);
    handleChange("position", position);
  };

  const handleSkillSelect = (skill) => {
    if (!selectedSkills.includes(skill.value)) {
      const newSkills = [...selectedSkills, skill.value];
      setSelectedSkills(newSkills);
      handleChange("skills", skill.value);
    }
    setSkillSearch("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSelectedSkills((prev) =>
      prev.filter((skill) => skill !== skillToRemove)
    );
    handleChange("skills", "");
  };

  const handleReset = () => {
    const resetFilters = {
      country: "",
      state: "",
      city: "",
      position: "",
      skills: "",
    };
    setTempFilters(resetFilters);
    setSelectedPosition("");
    setSelectedSkills([]);
    onApply(resetFilters);
  };

  const handleApply = () => {
    onApply(tempFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
      <div className="min-h-screen px-4 text-center">
        {/* Background overlay */}
        <div className="fixed inset-0" onClick={onClose}></div>

        {/* Modal container */}
        <div className="inline-block w-full max-w-2xl my-8 text-left align-middle transition-all transform">
          <div className="relative bg-white rounded-sm shadow-2xl">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Filter Profiles
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none p-2"
                >
                  <span className="sr-only">Close</span>✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="space-y-8">
                {/* Location Filters */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 mb-4">Location</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filterOptions.map((option) => (
                      <div key={option.id} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {option.label}
                        </label>
                        <select
                          value={tempFilters[option.id] || ""}
                          onChange={(e) =>
                            handleChange(option.id, e.target.value)
                          }
                          className="block w-full rounded-sm border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm py-2.5"
                        >
                          {option.options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Position Filter */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 mb-4">Position</h4>
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-sm">
                    {positions.map((position) => (
                      <button
                        key={position}
                        onClick={() => handlePositionSelect(position)}
                        className={`px-4 py-2 rounded-full text-sm transition-all ${
                          selectedPosition === position
                            ? "bg-primary text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {position}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skills Filter */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 mb-4">Skills</h4>
                  <div className="relative">
                    <input
                      type="text"
                      value={skillSearch}
                      onChange={(e) => setSkillSearch(e.target.value)}
                      placeholder="Search skills..."
                      className="block w-full rounded-sm border-gray-300 shadow-sm focus:border-primary focus:ring-primary text-sm p-2"
                    />
                    {skillSearch && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-sm shadow-lg max-h-60 overflow-y-auto">
                        {filteredSkills.map((skill) => (
                          <button
                            key={skill.value}
                            onClick={() => handleSkillSelect(skill)}
                            className="block w-full px-4 py-3 text-sm text-left hover:bg-gray-50 transition-colors"
                          >
                            {skill.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 p-3 bg-gray-50 rounded-sm">
                      {selectedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-primary text-white shadow-sm"
                        >
                          {skill}
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-2 hover:text-gray-200 focus:outline-none"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-end bg-gray-50 rounded-b-xl">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary w-full sm:w-auto"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-4 py-2.5 text-sm font-medium text-white bg-primary border border-transparent rounded-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary w-full sm:w-auto"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom Modal Component for User Details
const CustomUserModal = ({ user, onClose, show }) => {
  if (!show) return null;

  const fullName = user
    ? `${user.FirstName || ""} ${user.LastName || ""}`
    : "User Profile";

  const socials = user
    ? [
        user.ResumeLink && {
          name: "Resume",
          url: user.ResumeLink,
          icon: <IoDocumentTextOutline size={22} />,
        },
        user.GithubLink && {
          name: "GitHub",
          url: user.GithubLink,
          icon: <FaGithub size={20} />,
        },
        user.LinkedinLink && {
          name: "LinkedIn",
          url: user.LinkedinLink,
          icon: <FaLinkedin size={20} />,
        },
        user.InstagramLink && {
          name: "Instagram",
          url: user.InstagramLink,
          icon: <FaInstagram size={20} />,
        },
        user.websiteUrl && {
          name: "Website",
          url: user.websiteUrl,
          icon: <FaGlobe size={20} />,
        },
      ].filter(Boolean)
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-sm shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-bold">{fullName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {user ? (
            <>
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className="w-32 h-32 mx-auto md:mx-0 flex-shrink-0">
                  <img
                    src={
                      user.profilePic || "/assets/images/resume/placeholder.jpg"
                    }
                    alt={fullName}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div className="flex-grow">
                  <p className="text-gray-600 font-medium">
                    {user.Designation}
                  </p>

                  <div className="flex items-center mt-2">
                    <LuCoins className="text-yellow-500 mr-2" />
                    <span>{user.XP || "0"} XP</span>
                  </div>

                  <div className="flex items-center mt-2">
                    <LuMapPin className="text-gray-500 mr-2" />
                    <span>
                      {[
                        user.normalizedCity,
                        user.normalizedState,
                        user.normalizedCountry,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>

                  {user.educationalQualification && (
                    <div className="mt-2">
                      <span className="font-medium">Education: </span>
                      <span>
                        {user.educationalQualification}
                        {user.educationalInstitute &&
                          ` - ${user.educationalInstitute}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Links */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Connect</h3>
                {socials.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {socials.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
                      >
                        <span className="mr-2">{social.icon}</span>
                        {social.name}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No social links available</p>
                )}
              </div>

              {/* About */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">About</h3>
                {user.AboutMe ? (
                  <p className="text-gray-700">{user.AboutMe}</p>
                ) : (
                  <p className="text-gray-500">No information available</p>
                )}
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Skills</h3>
                {user.Skills && user.Skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.Skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No skills listed</p>
                )}
              </div>

              {/* Experience */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Experience</h3>
                {user.MyExperience ? (
                  <p className="text-gray-700">{user.MyExperience}</p>
                ) : (
                  <p className="text-gray-500">
                    No experience information available
                  </p>
                )}
              </div>

              {/* Past Projects */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Past Projects</h3>
                {user.PastProjects ? (
                  <p className="text-gray-700">{user.PastProjects}</p>
                ) : (
                  <p className="text-gray-500">
                    No past projects information available
                  </p>
                )}
              </div>

              {/* Website */}
              {/* <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Website</h3>
                {user.websiteUrl ? (
                  <a
                    href={user.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {user.websiteUrl}
                  </a>
                ) : (
                  <p className="text-gray-500">No website available</p>
                )}
              </div> */}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">User information not available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function to normalize location strings (trim and proper case)
const normalizeLocation = (location) => {
  if (!location || typeof location !== "string") return "";

  return location
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const BrowseProfiles = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({
    country: "",
    state: "",
    city: "",
    position: "",
    skills: "",
  });

  const usersPerPage = 10;

  // Fetch all users from Firestore once with normalized location data
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "Users"));

        const fetchedUsers = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const normalizedCountry = normalizeLocation(data.country);
          const normalizedState = normalizeLocation(data.state);
          const normalizedCity = normalizeLocation(data.city);

          fetchedUsers.push({
            id: doc.id,
            ...data,
            // Keep original data for backwards compatibility
            country: data.country?.trim() || "",
            state: data.state?.trim() || "",
            city: data.city?.trim() || "",
            // Add normalized data for consistent filtering and display
            normalizedCountry,
            normalizedState,
            normalizedCity,
          });
        });

        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
        setTotalPages(Math.ceil(fetchedUsers.length / usersPerPage));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  const positions = useMemo(
    () =>
      Array.from(
        new Set(users.map((u) => u.Designation).filter(Boolean))
      ).sort(),
    [users]
  );

  // Dynamically generate unique skills from users
  const allSkills = useMemo(() => {
    const skillSet = new Set();
    users.forEach((user) => {
      if (Array.isArray(user.Skills)) {
        user.Skills.forEach((skill) => skillSet.add(skill));
      }
    });
    return Array.from(skillSet)
      .sort()
      .map((skill) => ({ value: skill, label: skill }));
  }, [users]);

  // Filter options with normalized and deduplicated locations
  const filterOptions = useMemo(() => {
    // Use normalized location data and create a Map to handle deduplication
    const countryMap = new Map();
    const stateMap = new Map();
    const cityMap = new Map();

    users.forEach((user) => {
      if (user.normalizedCountry) {
        countryMap.set(
          user.normalizedCountry.toLowerCase(),
          user.normalizedCountry
        );
      }
      if (user.normalizedState) {
        stateMap.set(user.normalizedState.toLowerCase(), user.normalizedState);
      }
      if (user.normalizedCity) {
        cityMap.set(user.normalizedCity.toLowerCase(), user.normalizedCity);
      }
    });

    // Convert Maps to sorted arrays
    const uniqueCountries = Array.from(countryMap.values()).sort();
    const uniqueStates = Array.from(stateMap.values()).sort();
    const uniqueCities = Array.from(cityMap.values()).sort();

    return [
      {
        id: "country",
        label: "Country",
        type: "select",
        options: [
          { value: "", label: "All Countries" },
          ...uniqueCountries.map((c) => ({ value: c, label: c })),
        ],
      },
      {
        id: "state",
        label: "State",
        type: "select",
        options: [
          { value: "", label: "All States" },
          ...uniqueStates.map((s) => ({ value: s, label: s })),
        ],
      },
      {
        id: "city",
        label: "City",
        type: "select",
        options: [
          { value: "", label: "All Cities" },
          ...uniqueCities.map((c) => ({ value: c, label: c })),
        ],
      },
    ];
  }, [users]);

  // Apply filters and search using normalized location data
  useEffect(() => {
    if (users.length > 0) {
      let result = [...users];

      // Apply search filter
      if (searchTerm.trim() !== "") {
        const searchLower = searchTerm.toLowerCase();
        result = result.filter((user) => {
          const fullName = `${user.FirstName || ""} ${
            user.LastName || ""
          }`.toLowerCase();
          const designation = (user.Designation || "").toLowerCase();
          return (
            fullName.includes(searchLower) || designation.includes(searchLower)
          );
        });
      }

      // Apply location filters using normalized data
      if (filters.country) {
        result = result.filter(
          (user) => user.normalizedCountry === filters.country
        );
      }

      if (filters.state) {
        result = result.filter(
          (user) => user.normalizedState === filters.state
        );
      }

      if (filters.city) {
        result = result.filter((user) => user.normalizedCity === filters.city);
      }

      // Apply position filter
      if (filters.position) {
        result = result.filter((user) => user.Designation === filters.position);
      }

      // Apply skills filter
      if (filters.skills) {
        result = result.filter((user) => {
          if (!user.Skills) return false;
          return user.Skills.includes(filters.skills);
        });
      }

      setFilteredUsers(result);
      setTotalPages(Math.ceil(result.length / usersPerPage));
      setCurrentPage(1);
    }
  }, [users, searchTerm, filters]);

  // Get current page of users
  const getCurrentPageUsers = () => {
    const startIndex = (currentPage - 1) * usersPerPage;
    return filteredUsers.slice(startIndex, startIndex + usersPerPage);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter handler
  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
  };

  // Modal handler
  const handleShowMore = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileBanner
        title="Browse Profiles"
        subtitle="Discover talented professionals and connect with them for your projects."
        breadcrumbs={[
          { name: "Home", href: "/" },
          { name: "Projects", href: "/projects" },
        ]}
      />

      <div className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Search and Filter */}
          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <InputField
                type="text"
                placeholder="Search by name or title..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full"
              />
            </div>

            <button
              onClick={() => setShowFilter(true)}
              className="bg-primary text-white px-6 py-2 rounded-sm flex items-center justify-center hover:bg-primary/90 transition-colors h-10"
            >
              <FaFilter size={20} className="mr-2" />
              Filter
            </button>
          </div>

          {/* Custom Filter Modal */}
          <CustomFilterModal
            isOpen={showFilter}
            onClose={() => setShowFilter(false)}
            filterOptions={filterOptions}
            currentFilters={filters}
            onApply={handleFilterApply}
            positions={positions}
            allSkills={allSkills}
          />

          {/* Custom User Modal */}
          <CustomUserModal
            user={selectedUser}
            onClose={() => setShowModal(false)}
            show={showModal}
          />

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {filteredUsers.length === 0 ? (
                <div className="bg-white rounded-sm shadow-md p-8 text-center">
                  <h3 className="text-xl font-medium text-gray-800 mb-2">
                    No profiles found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {getCurrentPageUsers().map((user) => {
                    const fullName = `${user.FirstName || ""} ${
                      user.LastName || ""
                    }`;
                    const location = [
                      user.normalizedCity,
                      user.normalizedState,
                      user.normalizedCountry,
                    ]
                      .filter(Boolean)
                      .join(", ");

                    return (
                      <div
                        key={user.id}
                        className="bg-white rounded-sm shadow-md p-6 flex flex-col md:flex-row gap-6"
                      >
                        <div className="w-28 h-28 mx-auto md:mx-0 flex-shrink-0">
                          <img
                            src={
                              user.profilePic ||
                              "/assets/images/resume/placeholder.jpg"
                            }
                            alt={fullName}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-800 hover:text-primary transition-colors">
                                <Link to="#">{fullName}</Link>
                              </h3>
                              <span className="text-gray-600">
                                {user.Designation}
                              </span>
                            </div>
                            <Button
                              variant="outlined"
                              size="sm"
                              className="mt-2 md:mt-0 text-sm px-3 py-1 hover:bg-primary hover:text-white"
                              onClick={() => handleShowMore(user)}
                            >
                              Show More
                            </Button>
                          </div>

                          <ul className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                            <li className="flex items-center">
                              <LuCoins className="text-yellow-500 mr-2" />
                              <span>{user.XP || "0"} XP</span>
                            </li>
                            {location && (
                              <li className="flex items-center">
                                <LuMapPin className="mr-2" />
                                {location}
                              </li>
                            )}
                          </ul>

                          {user.Skills && user.Skills.length > 0 && (
                            <div className="mb-4">
                              <ul className="flex flex-wrap gap-2">
                                {user.Skills.slice(0, 5).map((skill, index) => (
                                  <li
                                    key={index}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                  >
                                    {skill}
                                  </li>
                                ))}
                                {user.Skills.length > 5 && (
                                  <li className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                    +{user.Skills.length - 5} more
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}

                          <p className="text-gray-600 text-sm line-clamp-2">
                            {user.AboutMe || "No description available."}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseProfiles;
