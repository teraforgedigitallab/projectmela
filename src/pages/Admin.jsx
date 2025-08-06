import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';
import { doc, collection, query, where, onSnapshot, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Components
import { AdminHeader, AdminLogin, AdminNav, TableRow, TableRowUser, StatsCard, SkillsDropdown, SearchBar } from '../components'

import { Modal, ScrollableModal } from '../ui';


// Utilities
import { getCardsData, getStatusClass, getTableHeaders, } from '../utils/function';
import {
    handleProjectLinkClick,
    handleClientLinkClick,
    updateProjectStatus,
    handleApplicationClientClick,
    handleApplicationProjectClick,
    handleApplicationApproval,
} from '../utils/adminDashboardUtils';
import { formatShortDateIndiaStyle } from '../utils/dateFormatting';
import { processAISearch, getSuggestedCandidates } from '../utils/aiLogic';

// Data
import { skillOptions } from '../data/data';

const Admin = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeTab, setActiveTab] = useState('Applications');
    const [activeTabCounter, setActiveTabCounter] = useState(0);

    // Data states
    const [projectRequests, setProjectRequests] = useState([]);
    const [pendingProjects, setPendingProjects] = useState([]);
    const [ongoingProjects, setOngoingProjects] = useState([]);
    const [applications, setApplications] = useState([]);
    const [users, setUsers] = useState([]);

    // UI states
    const [showModal, setShowModal] = useState(false);
    const [showScrollableModal, setShowScrollableModal] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [showSuggestionModal, setShowSuggestionModal] = useState(false);
    const [isModalMinimized, setIsModalMinimized] = useState(false);

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('project');
    const [userSearchBy, setUserSearchBy] = useState('name');
    const [showFilterOption, setShowFilterOption] = useState(false);
    const [showSortTooltip, setShowSortTooltip] = useState(false);
    const [showUserSortTooltip, setShowUserSortTooltip] = useState(false);
    const [showFilterTooltip, setShowFilterTooltip] = useState(false);
    const [sortOption, setSortOption] = useState('');
    const [userSortOption, setUserSortOption] = useState('');
    const [filterOption, setFilterOption] = useState('');

    // Advanced filter states
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedGender, setSelectedGender] = useState('');
    const [minXPFilter, setMinXPFilter] = useState('');
    const [maxXPFilter, setMaxXPFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState([]);
    const [educationFilter, setEducationFilter] = useState([]);

    // AI states
    const [isAISearching, setIsAISearching] = useState(false);
    const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);
    const [aiSearchQuery, setAiSearchQuery] = useState('');
    const [isAIFilterApplied, setIsAIFilterApplied] = useState(false);
    const [projectIdForSuggestion, setProjectIdForSuggestion] = useState('');
    const [suggestedCandidates, setSuggestedCandidates] = useState([]);
    const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);

    // Import the Gemini API Key from environment variables
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(geminiApiKey);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setShowFilterOption(tab === 'Ongoing' || tab === 'Applications');
        clearSort();
        clearFilter();
        setSearchTerm('');
        setActiveTabCounter(prevCount => prevCount + 1);
    };

    // Handle sorting logic
    const handleSort = (sortBy) => {
        setSortOption(sortBy);
        setShowSortTooltip(false);
    };

    const handleUserSort = (sortBy) => {
        setUserSortOption(sortBy);
        setShowUserSortTooltip(false);
    };

    // Handle filtering logic
    const handleFilter = (filterBy) => {
        setFilterOption(filterBy);
        setShowFilterTooltip(false);
    };

    // Clear sorting
    const clearSort = () => {
        setSortOption('');
        setShowSortTooltip(false);
    };

    // Clear filtering
    const clearFilter = () => {
        setFilterOption('');
        setShowFilterTooltip(false);
    };

    const clearAIFilters = () => {
        setSelectedGender('');
        setSelectedSkills([]);
        setMinXPFilter('');
        setMaxXPFilter('');
        setLocationFilter([]);
        setEducationFilter([]);
        setUserSearchTerm('');
        setAiSearchQuery('');
        setIsAIFilterApplied(false);
    };

    // Data fetching for counters
    useEffect(() => {
        if (!isLoggedIn) return;

        // Applications counter
        let applicationsUnsubscribe;
        if (activeTabCounter > 0) {
            applicationsUnsubscribe = onSnapshot(
                query(
                    collection(db, "Applications"),
                    where("isApproved", "==", false),
                    where("isDeleted", "==", false)
                ),
                (snapshot) => setApplications(snapshot.docs)
            );
        }

        // Project Requests counter
        const requestsUnsubscribe = onSnapshot(
            query(
                collection(db, "Projects"),
                where("status", "==", "Unverified")
            ),
            (snapshot) => setProjectRequests(snapshot.docs)
        );

        // Pending Projects counter
        const pendingUnsubscribe = onSnapshot(
            query(
                collection(db, "Projects"),
                where("status", "==", "Pending")
            ),
            (snapshot) => setPendingProjects(snapshot.docs)
        );

        // Ongoing Projects counter
        const ongoingUnsubscribe = onSnapshot(
            query(
                collection(db, "Projects"),
                where("status", "in", ["Ongoing", "Finished"])
            ),
            (snapshot) => setOngoingProjects(snapshot.docs)
        );

        return () => {
            if (applicationsUnsubscribe) applicationsUnsubscribe();
            requestsUnsubscribe();
            pendingUnsubscribe();
            ongoingUnsubscribe();
        };
    }, [isLoggedIn, activeTabCounter]);

    // Generate card stats data
    const cardsData = useMemo(() => {
        return getCardsData(
            applications.length,
            projectRequests.length,
            pendingProjects.length,
            ongoingProjects.length
        );
    }, [applications, projectRequests, pendingProjects, ongoingProjects]);

    // Fetch applications data
    useEffect(() => {
        if (activeTab === 'Applications' && isLoggedIn) {
            const unsubscribe = onSnapshot(
                query(
                    collection(db, "Applications"),
                    where("isApproved", "==", false),
                    where("isDeleted", "==", false)
                ),
                async (applicationsSnapshot) => {
                    const applicationsData = [];

                    for (const appDoc of applicationsSnapshot.docs) {
                        const appData = appDoc.data();

                        // Fetch project data
                        const projectDoc = await getDoc(doc(db, "Projects", appData.projectID));
                        const projectData = projectDoc.data();

                        // Fetch user data
                        const userDoc = await getDoc(doc(db, "Users", appData.ApplicantEmail));
                        const userData = userDoc.data();

                        applicationsData.push({
                            id: appDoc.id,
                            projectName: appData.projectName,
                            clientName: projectData?.name || 'N/A',
                            applicantFullName: [userData?.fullName || ''],
                            date: appData.submittedOn,
                            applicantSkills: userData?.Skills || [],
                            applicantPoints: userData?.XP || 0,
                            status: projectData?.status || 'N/A'
                        });
                    }

                    // Update state with the new data
                    setApplications(applicationsData);
                }
            );

            return () => unsubscribe();
        }
    }, [activeTab, isLoggedIn]);

    // Fetch projects data based on active tab
    useEffect(() => {
        if (!isLoggedIn) return;

        let q;
        switch (activeTab) {
            case "Project Requests":
                q = query(collection(db, "Projects"), where("status", "==", "Unverified"));
                break;
            case "Pending":
                q = query(collection(db, "Projects"), where("status", "==", "Pending"));
                break;
            case "Ongoing":
                q = query(collection(db, "Projects"), where("status", "in", ["Ongoing", "Finished"]));
                break;
            default:
                return;
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const projects = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            switch (activeTab) {
                case "Project Requests":
                    setProjectRequests(projects);
                    break;
                case "Pending":
                    setPendingProjects(projects);
                    break;
                case "Ongoing":
                    setOngoingProjects(projects);
                    break;
                default:
                    return;
            }
        }, (error) => {
            console.error("Error fetching projects: ", error);
        });

        return () => unsubscribe();
    }, [activeTab, isLoggedIn]);

    // Fetch users data
    useEffect(() => {
        if (activeTab === 'Users' && isLoggedIn) {
            const unsubscribe = onSnapshot(collection(db, "Users"), (snapshot) => {
                const usersData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(usersData);
            });

            return () => unsubscribe();
        }
    }, [activeTab, isLoggedIn]);

    // Filter users based on search criteria and filters
    const sortedFilteredUsers = useMemo(() => {
        let filtered = users.filter(user => {
            let searchField;
            switch (userSearchBy) {
                case 'name':
                    searchField = user.fullName;
                    break;
                case 'email':
                    searchField = user.Email;
                    break;
                case 'mobile':
                    searchField = user.Mobile;
                    break;
                default:
                    searchField = user.fullName;
            }

            let isSearchMatch = searchField && searchField.toLowerCase().includes(userSearchTerm.toLowerCase());

            let isManualSkillsMatch = true;
            if (selectedSkills.length > 0) {
                const userSkills = (user.Skills || []).map(skill => skill.toLowerCase());
                isManualSkillsMatch = selectedSkills.every(skill =>
                    userSkills.includes(skill.toLowerCase())
                );
            }

            let isEducationMatch = true;
            if (educationFilter.length > 0) {
                isEducationMatch = educationFilter.some(institute => {
                    const instituteLower = institute.toLowerCase();
                    const userInstitute = (user.EducationalInstitute || '').toLowerCase();
                    return userInstitute.includes(instituteLower) ||
                        instituteLower.includes(userInstitute);
                });
            }

            let isGenderMatch = true;
            if (selectedGender) {
                isGenderMatch = user.Gender === selectedGender;
            }

            let isXPMatch = true;
            if (minXPFilter !== '') {
                isXPMatch = isXPMatch && user.XP >= parseInt(minXPFilter);
            }
            if (maxXPFilter !== '') {
                isXPMatch = isXPMatch && user.XP <= parseInt(maxXPFilter);
            }

            let isLocationMatch = true;
            if (locationFilter.length > 0) {
                isLocationMatch = locationFilter.some(location => {
                    const locationLower = location.toLowerCase();
                    return (
                        user.city?.toLowerCase().includes(locationLower) ||
                        user.state?.toLowerCase().includes(locationLower) ||
                        user.country?.toLowerCase().includes(locationLower)
                    );
                });
            }

            return isSearchMatch && isManualSkillsMatch && isGenderMatch && isXPMatch && isLocationMatch && isEducationMatch;
        });

        // Sort users based on the selected sort option
        if (userSortOption === 'high') {
            filtered.sort((a, b) => b.XP - a.XP); // XP High to Low
        } else if (userSortOption === 'low') {
            filtered.sort((a, b) => a.XP - b.XP); // XP Low to High
        }

        return filtered;
    }, [users, userSearchTerm, userSearchBy, userSortOption, selectedSkills,
        selectedGender, minXPFilter, maxXPFilter, locationFilter, educationFilter]);

    // Filter projects based on search criteria and filters
    const filteredProjects = useMemo(() => {
        let projectsToFilter;

        switch (activeTab) {
            case 'Applications':
                projectsToFilter = applications;
                break;
            case 'Project Requests':
                projectsToFilter = projectRequests;
                break;
            case 'Pending':
                projectsToFilter = pendingProjects;
                break;
            case 'Ongoing':
                projectsToFilter = ongoingProjects;
                break;
            default:
                projectsToFilter = [];
        }

        // Filter out documents where isDeletedByAdmin is true
        projectsToFilter = projectsToFilter.filter(project => !project.isDeletedByAdmin);

        // Apply search filter
        projectsToFilter = projectsToFilter.filter(project => {
            const searchField = searchBy === 'project'
                ? (project.projectName || project.projectTitle)
                : (project.clientName || project.name);
            return searchField?.toLowerCase().includes(searchTerm.toLowerCase());
        });

        // Apply filter for status (Ongoing or Finished)
        if (activeTab === 'Ongoing' && filterOption) {
            projectsToFilter = projectsToFilter.filter(project => project.status === filterOption);
        }

        // Apply filter for status (Pending or Ongoing) for Applications tab
        if (activeTab === 'Applications' && filterOption) {
            projectsToFilter = projectsToFilter.filter(project => project.status === filterOption);
        }

        // Apply sorting for application tab
        if (activeTab === 'Applications' && sortOption) {
            projectsToFilter = projectsToFilter.sort((a, b) => {
                if (sortOption === 'recent') {
                    return b.date - a.date; // Recent to old
                } else if (sortOption === 'old') {
                    return a.date - b.date; // Old to recent
                } else if (sortOption === 'high') {
                    return b.applicantPoints - a.applicantPoints; // Points High to Low
                } else if (sortOption === 'low') {
                    return a.applicantPoints - b.applicantPoints; // Points Low to High
                }
                return 0;
            });
        }

        // Apply sorting for other tabs
        if (['Pending', 'Ongoing', 'Project Requests'].includes(activeTab) && sortOption) {
            projectsToFilter = projectsToFilter.sort((a, b) => {
                if (sortOption === 'recent') {
                    return b.createdAt.seconds - a.createdAt.seconds; // Recent to old
                } else if (sortOption === 'old') {
                    return a.createdAt.seconds - b.createdAt.seconds; // Old to recent
                } else if (sortOption === 'high') {
                    return b.budget - a.budget; // High to low price
                } else if (sortOption === 'low') {
                    return a.budget - b.budget; // Low to high price
                }
                return 0;
            });
        }

        return projectsToFilter;
    }, [activeTab, applications, projectRequests, pendingProjects, ongoingProjects,
        searchTerm, searchBy, sortOption, filterOption]);

    // AI Search handler
    const handleAISearch = async () => {
        const attempts = 3; // Number of attempts
        for (let i = 0; i < attempts; i++) {
            try {
                await processAISearch(
                    aiSearchQuery,
                    setIsAISearching,
                    setIsAIFilterApplied,
                    setSelectedGender,
                    setSelectedSkills,
                    setMinXPFilter,
                    setMaxXPFilter,
                    setLocationFilter,
                    setEducationFilter,
                    handleTabChange,
                    setShowModal
                );
                return; // Exit if successful
            } catch (error) {
                if (i === attempts - 1) { // If last attempt, show error
                    setModalHeading('Error');
                    setModalMessage('Failed to process AI search. Please try again.');
                    setShowModal(true);
                }
            }
        }
    };

    // Get suggestions handler
    const handleGetSuggestions = async () => {
        if (!projectIdForSuggestion) return;

        try {
            setIsFetchingSuggestions(true);
            const candidates = await getSuggestedCandidates(projectIdForSuggestion);
            setSuggestedCandidates(candidates);
            setShowSuggestionModal(true);
            setShowModal(false);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            toast.error('Invalid Project ID');
        } finally {
            setIsFetchingSuggestions(false);
        }
    };

    // Analyze candidates with AI
    const analyzeCandidates = async () => {
        try {
            setIsAIAnalyzing(true);
            // Get project details
            const projectDoc = await getDoc(doc(db, "Projects", projectIdForSuggestion));
            const projectData = projectDoc.data();

            const updatedCandidates = await Promise.all(suggestedCandidates.map(async (candidate) => {
                // Prepare data for AI analysis
                const aiInput = {
                    projectDetails: {
                        description: projectData.description,
                        requirements: projectData.requirements,
                        responsibilities: projectData.responsibilities
                    },
                    candidateDetails: {
                        email: candidate.Email,
                        aboutMe: candidate.AboutMe || '',
                        experience: candidate.MyExperience || '',
                        pastProjects: candidate.PastProjects || '',
                        skills: candidate.Skills || [],
                    }
                };

                // Generate AI analysis using Gemini
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const prompt = `You are an AI recruitment assistant. Analyze the candidate's suitability for the project based on the following information. Provide your response in strict JSON format with exactly two fields: "analysis" (string) and "confidenceScore" (number between 0-1000) Be very meticulous and precise in giving the AI confidence score and it should reflect the difference between one candidate with another be as precise with the score as possible.

        Project Details:
        ${JSON.stringify(aiInput.projectDetails, null, 2)}

        Candidate Details:
        ${JSON.stringify(aiInput.candidateDetails, null, 2)}


        Respond only with a JSON object in this exact format:
        {"analysis": "your detailed analysis here", "confidenceScore": number}`;

                const result = await model.generateContent(prompt);
                const responseText = result.response.text();

                // Clean up the response text to ensure valid JSON
                const cleanResponse = responseText.replace(/```json\n?|\n?```/g, '').trim();

                try {
                    const response = JSON.parse(cleanResponse);
                    return {
                        ...candidate,
                        aiAnalysis: response.analysis,
                        aiConfidence: response.confidenceScore
                    };
                } catch (parseError) {
                    console.error('Error parsing AI response:', parseError);
                    return {
                        ...candidate,
                        aiAnalysis: "Error analyzing candidate",
                        aiConfidence: 0
                    };
                }
            }));

            // Sort candidates by confidence score
            const sortedCandidates = updatedCandidates.sort((a, b) => b.aiConfidence - a.aiConfidence);
            setSuggestedCandidates(sortedCandidates);
        } catch (error) {
            console.error('Error in AI analysis:', error);
            toast.error('Failed to analyze candidates');
        } finally {
            setIsAIAnalyzing(false);
        }
    };

    return (
        <>
            {!isLoggedIn ? (
                <AdminLogin onLoginSuccess={() => setIsLoggedIn(true)} />
            ) : (
                <div className="flex flex-col h-screen bg-gray-100">
                    {/* Header */}
                    <header className="bg-white border-b pt-6">
                        <div className="container mx-auto px-4">
                            <div className="mb-6">
                                <AdminHeader />
                                <AdminNav activeTab={activeTab} handleTabChange={handleTabChange} />
                            </div>
                        </div>
                    </header>

                    {/* Main content */}
                    <main className="flex-grow py-6 overflow-y-auto">
                        <div className="container mx-auto px-4">
                            {/* Stats cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                {cardsData.map((card, index) => (
                                    <StatsCard key={index} {...card} />
                                ))}
                            </div>

                            {/* Search bar */}
                            <div className="mb-4">
                                {activeTab !== 'Users' && (
                                    <div className="flex flex-col space-y-2">
                                        <div className="relative flex items-start">
                                            <SearchBar
                                                placeholder={`Search by ${searchBy}...`}
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                showFilterOptions={showFilterOption}
                                                onClickSortOptions={() => setShowSortTooltip(!showSortTooltip)}
                                                onClickFilterOptions={() => setShowFilterTooltip(!showFilterTooltip)}
                                                showFilterDot={!!filterOption}
                                                showSortDot={!!sortOption}
                                            />

                                            {/* Sort Tooltip */}
                                            {showSortTooltip && (
                                                <div className="absolute top-full mt-2 right-0 bg-white rounded-sm shadow-lg z-10 w-48">
                                                    <div className="flex justify-between items-center p-2 border-b">
                                                        <span className="font-medium">Sort Options</span>
                                                        <button
                                                            className="text-gray-500 hover:text-gray-700"
                                                            onClick={() => setShowSortTooltip(false)}
                                                        >
                                                            <FaTimes size={16} />
                                                        </button>
                                                    </div>
                                                    <div className="p-2 space-y-1">
                                                        {activeTab === 'Applications' ? (
                                                            <>
                                                                <button
                                                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                                                                    onClick={() => handleSort('recent')}
                                                                >
                                                                    Recent to Old
                                                                </button>
                                                                <button
                                                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                                                                    onClick={() => handleSort('old')}
                                                                >
                                                                    Old to Recent
                                                                </button>
                                                                <button
                                                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                                                                    onClick={() => handleSort('high')}
                                                                >
                                                                    Points High to Low
                                                                </button>
                                                                <button
                                                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                                                                    onClick={() => handleSort('low')}
                                                                >
                                                                    Points Low to High
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                                                                    onClick={() => handleSort('recent')}
                                                                >
                                                                    Recent to Old
                                                                </button>
                                                                <button
                                                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                                                                    onClick={() => handleSort('old')}
                                                                >
                                                                    Old to Recent
                                                                </button>
                                                                <button
                                                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                                                                    onClick={() => handleSort('high')}
                                                                >
                                                                    Price High to Low
                                                                </button>
                                                                <button
                                                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                                                                    onClick={() => handleSort('low')}
                                                                >
                                                                    Price Low to High
                                                                </button>
                                                            </>
                                                        )}
                                                        <button
                                                            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded font-medium text-primary"
                                                            onClick={() => clearSort()}
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Filter Tooltip */}
                                            {showFilterTooltip && (
                                                <div className="absolute top-full mt-2 right-0 bg-white rounded-sm shadow-lg z-10 w-48">
                                                    <div className="flex justify-between items-center p-2 border-b">
                                                        <span className="font-medium">Filter Options</span>
                                                        <button
                                                            className="text-gray-500 hover:text-gray-700"
                                                            onClick={() => setShowFilterTooltip(false)}
                                                        >
                                                            <FaTimes size={16} />
                                                        </button>
                                                    </div>
                                                    <div className="p-2 space-y-1">
                                                        {activeTab === 'Applications' ? (
                                                            <>
                                                                <button
                                                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                                                                    onClick={() => handleFilter('Pending')}
                                                                >
                                                                    Pending
                                                                </button>
                                                                <button
                                                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                                                                    onClick={() => handleFilter('Ongoing')}
                                                                >
                                                                    Ongoing
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                                                                    onClick={() => handleFilter('Ongoing')}
                                                                >
                                                                    Ongoing
                                                                </button>
                                                                <button
                                                                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                                                                    onClick={() => handleFilter('Finished')}
                                                                >
                                                                    Finished
                                                                </button>
                                                            </>
                                                        )}
                                                        <button
                                                            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded font-medium text-primary"
                                                            onClick={() => clearFilter()}
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex space-x-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    className="form-radio h-4 w-4 text-primary"
                                                    name="searchBy"
                                                    value="project"
                                                    checked={searchBy === 'project'}
                                                    onChange={() => setSearchBy('project')}
                                                />
                                                <span className="ml-2">Project</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    className="form-radio h-4 w-4 text-primary"
                                                    name="searchBy"
                                                    value="client"
                                                    checked={searchBy === 'client'}
                                                    onChange={() => setSearchBy('client')}
                                                />
                                                <span className="ml-2">Client</span>
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'Users' && (
                                    <div className="space-y-4">
                                        <div className="relative flex items-start">
                                            <SearchBar
                                                placeholder={`Search by ${userSearchBy}...`}
                                                value={userSearchTerm}
                                                onChange={(e) => setUserSearchTerm(e.target.value)}
                                                onClickSortOptions={() => setShowUserSortTooltip(!showUserSortTooltip)}
                                                showSortDot={!!userSortOption}
                                            />

                                            {showUserSortTooltip && (
                                                <div className="absolute top-full mt-2 right-0 bg-white rounded-sm shadow-lg z-10 w-48">
                                                    <div className="flex justify-between items-center p-2 border-b">
                                                        <span className="font-medium">Sort Options</span>
                                                        <button
                                                            className="text-gray-500 hover:text-gray-700"
                                                            onClick={() => setShowUserSortTooltip(false)}
                                                        >
                                                            <FaTimes size={16} />
                                                        </button>
                                                    </div>
                                                    <div className="p-2 space-y-1">
                                                        <button
                                                            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                                                            onClick={() => handleUserSort('low')}
                                                        >
                                                            XP Low to High
                                                        </button>
                                                        <button
                                                            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                                                            onClick={() => handleUserSort('high')}
                                                        >
                                                            XP High to Low
                                                        </button>
                                                        <button
                                                            className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded font-medium text-primary"
                                                            onClick={() => setUserSortOption('')}
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Radio buttons for search criteria */}
                                        <div className="flex space-x-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    className="form-radio h-4 w-4 text-primary"
                                                    name="userSearchBy"
                                                    value="name"
                                                    checked={userSearchBy === 'name'}
                                                    onChange={() => setUserSearchBy('name')}
                                                />
                                                <span className="ml-2">Name</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    className="form-radio h-4 w-4 text-primary"
                                                    name="userSearchBy"
                                                    value="email"
                                                    checked={userSearchBy === 'email'}
                                                    onChange={() => setUserSearchBy('email')}
                                                />
                                                <span className="ml-2">Email</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    className="form-radio h-4 w-4 text-primary"
                                                    name="userSearchBy"
                                                    value="mobile"
                                                    checked={userSearchBy === 'mobile'}
                                                    onChange={() => setUserSearchBy('mobile')}
                                                />
                                                <span className="ml-2">Mobile</span>
                                            </label>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                                <select
                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                                    value={selectedGender}
                                                    onChange={(e) => setSelectedGender(e.target.value)}
                                                >
                                                    <option value="">All</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Non Binary">Non Binary</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">XP Range</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                                        placeholder="Min"
                                                        value={minXPFilter}
                                                        onChange={(e) => setMinXPFilter(e.target.value)}
                                                    />
                                                    <input
                                                        type="number"
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                                        placeholder="Max"
                                                        value={maxXPFilter}
                                                        onChange={(e) => setMaxXPFilter(e.target.value)}
                                                    />
                                                    {(minXPFilter || maxXPFilter) && (
                                                        <button
                                                            className="p-2 bg-gray-200 rounded-md hover:bg-gray-300"
                                                            onClick={() => {
                                                                setMinXPFilter('');
                                                                setMaxXPFilter('');
                                                            }}
                                                        >
                                                            <FaTimes size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                                        placeholder="Type location and press Enter"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && e.target.value.trim()) {
                                                                e.preventDefault();
                                                                const newLocation = e.target.value.trim();
                                                                if (!locationFilter.includes(newLocation)) {
                                                                    setLocationFilter([...locationFilter, newLocation]);
                                                                }
                                                                e.target.value = '';
                                                            }
                                                        }}
                                                    />
                                                    {locationFilter.length > 0 && (
                                                        <button
                                                            className="p-2 bg-gray-200 rounded-md hover:bg-gray-300"
                                                            onClick={() => setLocationFilter([])}
                                                        >
                                                            <FaTimes size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {locationFilter.map((location, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer"
                                                            onClick={() => {
                                                                setLocationFilter(locationFilter.filter((_, i) => i !== index));
                                                            }}
                                                        >
                                                            {location}
                                                            <button className="ml-1.5 text-blue-500 hover:text-blue-700">
                                                                <FaTimes size={10} />
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Educational Institute</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                                                        placeholder="Type institute and press Enter"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && e.target.value.trim()) {
                                                                e.preventDefault();
                                                                const newInstitute = e.target.value.trim();
                                                                if (!educationFilter.includes(newInstitute)) {
                                                                    setEducationFilter([...educationFilter, newInstitute]);
                                                                }
                                                                e.target.value = '';
                                                            }
                                                        }}
                                                    />
                                                    {educationFilter.length > 0 && (
                                                        <button
                                                            className="p-2 bg-gray-200 rounded-md hover:bg-gray-300"
                                                            onClick={() => setEducationFilter([])}
                                                        >
                                                            <FaTimes size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {educationFilter.map((institute, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 cursor-pointer"
                                                            onClick={() => {
                                                                setEducationFilter(educationFilter.filter((_, i) => i !== index));
                                                            }}
                                                        >
                                                            {institute}
                                                            <button className="ml-1.5 text-blue-500 hover:text-blue-700">
                                                                <FaTimes size={10} />
                                                            </button>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                                            <div className="flex items-center">
                                                <SkillsDropdown
                                                    selectedSkills={selectedSkills}
                                                    setSelectedSkills={setSelectedSkills}
                                                    options={skillOptions}
                                                />
                                                {selectedSkills.length > 0 && (
                                                    <button
                                                        className="ml-3 p-2 bg-gray-200 rounded-md hover:bg-gray-300"
                                                        onClick={() => setSelectedSkills([])}
                                                    >
                                                        <FaTimes size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex mt-4 space-x-3">
                                    {activeTab === 'Users' && (
                                        <button
                                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                                            onClick={() => {
                                                setModalHeading('AI Search');
                                                setModalMessage('Describe the candidate you are looking for:');
                                                setShowModal(true);
                                            }}
                                        >
                                            AI Search
                                        </button>
                                    )}

                                    <button
                                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                                        onClick={() => {
                                            setModalHeading('AI Suggestion');
                                            setModalMessage('Enter Project ID:');
                                            setShowModal(true);
                                        }}
                                    >
                                        AI Suggestion
                                    </button>

                                    {isAIFilterApplied && (
                                        <button
                                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
                                            onClick={() => clearAIFilters()}
                                        >
                                            Clear All Filters
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Main Table */}
                            <div className="bg-white rounded-sm shadow-md overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h5 className="font-medium text-gray-700">{activeTab}</h5>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            {getTableHeaders(activeTab)}
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {activeTab === 'Users' && sortedFilteredUsers.map(user => (
                                                <TableRowUser key={user.id} user={user} />
                                            ))}

                                            {activeTab === 'Applications' && filteredProjects.map(app => (
                                                <TableRow
                                                    key={app.id || ''}
                                                    projectId={app.id || ''}
                                                    projectName={app.projectName || ''}
                                                    applicantNames={app.applicantFullName || []}
                                                    clientName={app.clientName || ''}
                                                    date={app.date ? formatShortDateIndiaStyle(app.date) : ''}
                                                    skills={app.applicantSkills || []}
                                                    points={app.applicantPoints || 0}
                                                    status={app.status || 'Unknown'}
                                                    statusClass={getStatusClass(app.status)}
                                                    activeTab={activeTab}
                                                    onMainButtonClick={() => handleApplicationApproval(app.id)}
                                                    onProjectClick={() => handleApplicationProjectClick(app.id, setModalHeading, setModalMessage, setShowScrollableModal)}
                                                    onClientClick={() => handleApplicationClientClick(app.id, setModalHeading, setModalMessage, setShowScrollableModal)}
                                                />
                                            ))}

                                            {activeTab === 'Pending' && filteredProjects.map(project => (
                                                <TableRow
                                                    key={project.id}
                                                    projectId={project.id}
                                                    projectName={project.projectTitle || ''}
                                                    onProjectClick={() => handleProjectLinkClick(project, setModalHeading, setModalMessage, setShowScrollableModal)}
                                                    clientName={project.name || ''}
                                                    onClientClick={() => handleClientLinkClick(project, setModalHeading, setModalMessage, setShowScrollableModal)}
                                                    date={project.createdAt ? formatShortDateIndiaStyle(project.createdAt) : ''}
                                                    budget={project.budget || 0}
                                                    skills={project.techStack || []}
                                                    notifyUser={project.isNotifyPostonEmail || false}
                                                    points={project.points || 0}
                                                    minXP={project.minXP || 0}
                                                    communicationPreference={project.communicationPreference}
                                                    status={project.status || 'Unknown'}
                                                    statusClass={getStatusClass(project.status)}
                                                    activeTab={activeTab}
                                                    moderatorNames={project.moderators || []}
                                                    applicantNames={project.selectedApplicants || []}
                                                    removedApplicantNames={project.removedApplicants || []}
                                                    removedModerators={project.removedModerators || []}
                                                    onMainButtonClick={() => updateProjectStatus(project.id, "Ongoing")}
                                                />
                                            ))}

                                            {activeTab === 'Ongoing' && filteredProjects.map(project => (
                                                <TableRow
                                                    key={project.id || ''}
                                                    projectId={project.id || ''}
                                                    projectName={project.projectTitle || ''}
                                                    onProjectClick={() => handleProjectLinkClick(project, setModalHeading, setModalMessage, setShowScrollableModal)}
                                                    clientName={project.name || ''}
                                                    onClientClick={() => handleClientLinkClick(project, setModalHeading, setModalMessage, setShowScrollableModal)}
                                                    date={project.createdAt ? formatShortDateIndiaStyle(project.createdAt) : ''}
                                                    budget={project.budget || 0}
                                                    skills={project.techStack || []}
                                                    notifyUser={project.isNotifyPostonEmail || false}
                                                    points={project.points || 0}
                                                    minXP={project.minXP || 0}
                                                    communicationPreference={project.communicationPreference}
                                                    status={project.status || 'Unknown'}
                                                    statusClass={getStatusClass(project.status)}
                                                    activeTab={activeTab}
                                                    moderatorNames={project.moderators || []}
                                                    applicantNames={project.selectedApplicants || []}
                                                    removedApplicantNames={project.removedApplicants || []}
                                                    removedModerators={project.removedModerators || []}
                                                    onMainButtonClick={() => updateProjectStatus(project.id, "Finished")}
                                                />
                                            ))}

                                            {activeTab === 'Project Requests' && filteredProjects.map(project => (
                                                <TableRow
                                                    key={project.id || ''}
                                                    projectId={project.id || ''}
                                                    projectName={project.projectTitle || ''}
                                                    onProjectClick={() => handleProjectLinkClick(project, setModalHeading, setModalMessage, setShowScrollableModal)}
                                                    clientName={project.name || ''}
                                                    onClientClick={() => handleClientLinkClick(project, setModalHeading, setModalMessage, setShowScrollableModal)}
                                                    date={project.createdAt ? formatShortDateIndiaStyle(project.createdAt) : ''}
                                                    budget={project.budget || 0}
                                                    skills={project.techStack || []}
                                                    notifyUser={project.isNotifyPostonEmail || false}
                                                    points={project.points || 0}
                                                    minXP={project.minXP || 0}
                                                    communicationPreference={project.communicationPreference}
                                                    status={project.status || 'Unknown'}
                                                    statusClass={getStatusClass(project.status)}
                                                    activeTab={activeTab}
                                                    onMainButtonClick={() => updateProjectStatus(project.id, "Pending")}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* Modals */}
                    {isModalMinimized && (
                        <button
                            className="fixed bottom-4 right-4 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                            onClick={() => setIsModalMinimized(false)}
                            title="Show Suggested Candidates"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                            </svg>
                        </button>
                    )}

                    <Modal
                        show={showModal}
                        onClose={() => setShowModal(false)}
                        heading={modalHeading}
                        body={modalMessage}
                        primaryButtonText={isAISearching ? "Searching..." : "Search"}
                        secondaryButtonText="Cancel"
                        showButtons={true}
                        showInputField={true}
                        inputPlaceholder={
                            modalHeading === 'AI Search'
                                ? "Example: Female candidate who knows React and Firebase and stays in Mumbai"
                                : "Enter Project ID"
                        }
                        inputType="text"
                        onInputChange={(e) =>
                            modalHeading === 'AI Search'
                                ? setAiSearchQuery(e.target.value)
                                : setProjectIdForSuggestion(e.target.value)
                        }
                        onPrimaryClick={
                            modalHeading === 'AI Search'
                                ? handleAISearch
                                : handleGetSuggestions
                        }
                        onSecondaryClick={() => {
                            setShowModal(false);
                            setAiSearchQuery('');
                            setProjectIdForSuggestion('');
                        }}
                    />

                    <ScrollableModal
                        show={showScrollableModal}
                        onClose={() => setShowScrollableModal(false)}
                        heading={modalHeading}
                        body={modalMessage}
                        primaryButtonText="OK"
                        secondaryButtonText="Cancel"
                        showButtons={false}
                    />

                    <ScrollableModal
                        show={showSuggestionModal && !isModalMinimized}
                        onClose={() => {
                            setShowSuggestionModal(false);
                            setIsModalMinimized(false);
                            setSuggestedCandidates([]);
                        }}
                        heading="Suggested Candidates"
                        body={
                            <div className="space-y-4">
                                {suggestedCandidates.length === 0 ? (
                                    <p className="text-gray-500">No matching candidates found.</p>
                                ) : (
                                    suggestedCandidates.map((candidate, index) => (
                                        <div key={candidate.id} className="bg-white rounded-sm border border-gray-200 shadow-sm p-4">
                                            <h5 className="text-lg font-medium mb-2">{index + 1}. {candidate.fullName}</h5>
                                            <div className="space-y-2 text-sm">
                                                <p>
                                                    <span className="font-medium">Matching Skills:</span> {candidate.matchScore} skills
                                                </p>
                                                <p>
                                                    <span className="font-medium">Skills:</span> {candidate.Skills?.join(', ')}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Email:</span> {candidate.Email}
                                                </p>
                                                <p>
                                                    <span className="font-medium">XP:</span> {candidate.XP || 0}
                                                </p>
                                                <div className="mt-2">
                                                    <p className="font-medium">About Me:</p>
                                                    <p className="mt-1">{candidate.AboutMe || 'N/A'}</p>
                                                </div>
                                                <div className="mt-2">
                                                    <p className="font-medium">Experience:</p>
                                                    <p className="mt-1">{candidate.MyExperience || 'N/A'}</p>
                                                </div>
                                                <div className="mt-2">
                                                    <p className="font-medium">Past Project:</p>
                                                    <p className="mt-1">{candidate.PastProjects || 'N/A'}</p>
                                                </div>

                                                {candidate.aiAnalysis && (
                                                    <div className="mt-3 bg-yellow-50 p-3 rounded-md">
                                                        <p className="font-medium">AI Analysis:</p>
                                                        <p className="mt-1">{candidate.aiAnalysis}</p>
                                                        <p className="mt-2">
                                                            <span className="font-medium">AI Confidence:</span> {candidate.aiConfidence}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        }
                        primaryButtonText={isAIAnalyzing ? "Analyzing..." : "AI Analysis"}
                        secondaryButtonText="Minimize"
                        showButtons={true}
                        onPrimaryButtonClicked={analyzeCandidates}
                        onSecondaryButtonClicked={() => setIsModalMinimized(true)}
                    />
                </div>
            )}
        </>
    );
};

export default Admin;