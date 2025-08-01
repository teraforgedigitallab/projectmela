import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { db, auth } from '../firebaseConfig/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import {
    FaCalendarAlt,
    FaRegBookmark,
    FaAward,
    FaTag,
    FaBriefcase,
    FaFileAlt,
    FaList,
    FaTasks,
    FaDollarSign,
    FaUsers,
    FaMoneyBillWave,
    FaTransgender,
    FaCheck,
    FaBuilding
} from 'react-icons/fa';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { NewsletterCTA, SocialShare } from '../components';
import Modal from '../ui/Modal';
import { formatFullDate } from '../utils/dateFormatting';
import { getChipColorFromStatus, getPriceRating } from '../utils/function';

const JobDetail = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [modalBody, setModalBody] = useState('');
    const [isSaved, setIsSaved] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const [jobData, setJobData] = useState(undefined);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJobData = async () => {
            setIsLoading(true);
            try {
                const jobDoc = doc(db, 'Projects', id);
                const jobSnapshot = await getDoc(jobDoc);

                if (jobSnapshot.exists()) {
                    setJobData(jobSnapshot.data());
                } else {
                    setJobData(null);
                }
            } catch (error) {
                setJobData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobData();
    }, [id]);

    const toggleSaveJob = () => {
        setIsSaved(!isSaved);
        toast.success(isSaved ? 'Project removed from saved projects' : 'Project saved successfully');
    };

    const handleApply = async () => {
        const user = auth.currentUser;

        if (!user) {
            toast.error('Please sign in to apply for this project');
            navigate('/signin');
            return;
        }

        try {
            const userEmail = user.email;
            const userDoc = doc(db, 'Users', userEmail);
            const userSnapshot = await getDoc(userDoc);

            if (userSnapshot.exists()) {
                const userData = userSnapshot.data();
                const userXP = userData.XP;
                const isProfileCompleted = userData.isProfileCompleted;

                if (!isProfileCompleted) {
                    toast.warning('Please complete your profile to apply for Projects');
                    return;
                }

                if (userXP < jobData.minXP) {
                    toast.error('Your XP is below the minimum required XP to do this project');
                    return;
                }

                const documentID = `${userEmail}---${id}`;

                const applicationData = {
                    projectName: jobData.projectTitle,
                    projectID: id,
                    ApplicantEmail: user.email,
                    submittedOn: new Date(),
                    isApproved: false,
                    isDeleted: false,
                };

                await setDoc(doc(db, 'Applications', documentID), applicationData);

                setModalHeading('Submitted ✅');
                setModalBody('Application submitted successfully!');
                setShowModal(true);
            }
        } catch (error) {
            setModalHeading('Error');
            setModalBody('Error submitting application: ' + error.message);
            setShowModal(true);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        navigate('/');
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (jobData === null) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-gray-500 text-lg">
                No such project found.
            </div>
        );
    }

    // Helper for price rating icons
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

    // Helper for company logo avatar
    const getCompanyLogo = () => {
        const firstChar = jobData.projectTitle?.charAt(0) || "P";
        const colors = [
            'bg-red-100 text-red-800',
            'bg-blue-100 text-blue-800',
            'bg-green-100 text-green-800',
            'bg-purple-100 text-purple-800',
            'bg-yellow-100 text-yellow-800',
            'bg-indigo-100 text-indigo-800',
        ];
        const colorIndex = (firstChar.toLowerCase().charCodeAt(0) - 97) % colors.length;
        const selectedColor = colors[colorIndex >= 0 ? colorIndex : 0];
        return (
            <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl ${selectedColor}`}>
                {firstChar.toUpperCase()}
            </div>
        );
    };

    return (
        <div className="bg-gray-50 min-h-screen py-10">
            <div className="container mx-auto px-4">
                {/* Back navigation */}
                <div className="max-w-6xl mx-auto mb-6">
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
                    >
                        <HiOutlineArrowLeft className="mr-2" />
                        All Projects
                    </button>
                </div>

                <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Project header */}
                    <div className="border-b border-gray-200 p-6 flex items-start justify-between bg-gradient-to-r from-blue-50 to-white">
                        <div className="flex items-center">
                            {getCompanyLogo()}
                            <div className="ml-4">
                                <div className="flex items-center space-x-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getChipColorFromStatus(jobData.status || 'Ongoing')}`}>
                                        {jobData.status || "Ongoing"}
                                    </span>
                                    <span className="text-gray-500 text-sm">
                                        Posted {formatFullDate(jobData.createdAt)}
                                    </span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">
                                    {jobData.projectTitle}
                                </h1>
                            </div>
                        </div>
                        <button
                            onClick={toggleSaveJob}
                            className={`flex items-center space-x-1 px-3 py-1 rounded-md ${isSaved
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <FaRegBookmark />
                            <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row">
                        {/* Main content */}
                        <div className="w-full md:w-2/3 p-6 border-r border-gray-200">
                            {/* Project Sections */}
                            <div className="space-y-8">
                                {/* About the Project */}
                                <section>
                                    <div className="flex items-center mb-4">
                                        <FaFileAlt className="text-primary mr-2" />
                                        <h2 className="text-xl font-semibold text-gray-800">About the Project</h2>
                                    </div>
                                    <div className="pl-6 text-gray-800">
                                        {jobData.description}
                                    </div>
                                </section>

                                {/* Project Requirements */}
                                <section>
                                    <div className="flex items-center mb-4">
                                        <FaList className="text-primary mr-2" />
                                        <h2 className="text-xl font-semibold text-gray-800">Project Requirements</h2>
                                    </div>
                                    <div className="pl-6 text-gray-800">
                                        {jobData.requirements || "Not specified"}
                                    </div>
                                </section>

                                {/* Key Responsibilities */}
                                <section>
                                    <div className="flex items-center mb-4">
                                        <FaTasks className="text-primary mr-2" />
                                        <h2 className="text-xl font-semibold text-gray-800">Key Responsibilities</h2>
                                    </div>
                                    <div className="pl-6 text-gray-800">
                                        {jobData.responsibilities || "Not specified"}
                                    </div>
                                </section>

                                {/* Tech Stack */}
                                <section>
                                    <div className="flex items-center mb-4">
                                        <FaCheck className="text-primary mr-2" />
                                        <h2 className="text-xl font-semibold text-gray-800">Required Skills</h2>
                                    </div>
                                    <div className="pl-6">
                                        <div className="flex flex-wrap gap-2">
                                            {jobData.techStack && jobData.techStack.length > 0 ? (
                                                jobData.techStack.map((tech, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm font-medium"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-500">No specific skills required</span>
                                            )}
                                        </div>
                                    </div>
                                </section>

                                {/* Additional Resources */}
                                {jobData.fileUrl && (
                                    <section>
                                        <div className="flex items-center mb-4">
                                            <FaFileAlt className="text-primary mr-2" />
                                            <h2 className="text-xl font-semibold text-gray-800">Additional Resources</h2>
                                        </div>
                                        <div className="pl-6">
                                            <a
                                                href={jobData.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md"
                                            >
                                                <FaFileAlt className="mr-2" />
                                                Download Project Document
                                            </a>
                                        </div>
                                    </section>
                                )}

                                {/* Social Share */}
                                <section className="border-t border-gray-200 pt-6">
                                    <SocialShare shareLink={window.location.href} />
                                </section>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="w-full md:w-1/3 p-6 bg-white">
                            <div className="space-y-6">
                                {/* Project Details */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Details</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                                                <FaBuilding className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Project Type</p>
                                                <p className="font-medium">{jobData.projectType || "Not specified"}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                                                <FaMoneyBillWave className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Budget</p>
                                                <p className="font-medium">
                                                    {jobData.budget === -1 ? (
                                                        "No Fixed Budget"
                                                    ) : jobData.budget ? (
                                                        `₹${jobData.budget}`
                                                    ) : (
                                                        "Not specified"
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                                                <FaAward className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Experience Points</p>
                                                <p className="font-medium">
                                                    <span className="font-bold text-blue-700">{jobData.points || 0}</span> points
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mr-3">
                                                <FaUsers className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Min Required XP</p>
                                                <p className="font-medium">{jobData.minXP || 0} XP</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-3">
                                                <FaCalendarAlt className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Posted On</p>
                                                <p className="font-medium">{formatFullDate(jobData.createdAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                {jobData.name && (
                                    <div className="border-t border-gray-200 pt-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
                                        <div className="space-y-2">
                                            <p>
                                                <span className="font-medium">Name:</span> {jobData.name}
                                            </p>
                                            {jobData.email && (
                                                <p>
                                                    <span className="font-medium">Email:</span> {jobData.email}
                                                </p>
                                            )}
                                            {jobData.communicationPreference && (
                                                <p>
                                                    <span className="font-medium">Preferred Communication:</span>{' '}
                                                    {jobData.communicationPreference.charAt(0).toUpperCase() + jobData.communicationPreference.slice(1)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Application Button */}
                                <div className="border-t border-gray-200 pt-6">
                                    <button
                                        onClick={handleApply}
                                        className="w-full bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-md font-medium transition-colors flex items-center justify-center"
                                    >
                                        Apply for this Project <span className="ml-2">→</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Newsletter */}
                <div className="max-w-6xl mx-auto mt-10">
                    <NewsletterCTA />
                </div>
            </div>

            {/* Modal */}
            <Modal
                show={showModal}
                onClose={handleCloseModal}
                heading={modalHeading}
                body={modalBody}
                primaryButtonText="OK"
                showButtons={false}
                onPrimaryClick={handleCloseModal}
            />
        </div>
    );
};

export default JobDetail;