import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { db, auth } from '../firebaseConfig/firebase.js';
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { FaRegBookmark, FaBookmark, FaFileAlt, FaDollarSign } from 'react-icons/fa';
import { RiMoneyRupeeCircleLine, RiPriceTag3Line } from "react-icons/ri";
import { FiAward } from "react-icons/fi";
import { SocialShare } from '../components/index.js';
import Modal from '../ui/Modal.jsx';
import { formatFullDate } from '../utils/dateFormatting.js';
import ProfileBanner from '../components/Profile/ProfileBanner.jsx';
import { getPriceRating } from '../utils/function.jsx';

const ProjectDetail = () => {
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

    useEffect(() => {
        const fetchBookmarks = async () => {
            const user = auth.currentUser;
            if (!user) return;
            const userDocRef = doc(db, "Users", user.email);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists() && userDoc.data().bookmarks) {
                const bookmarks = userDoc.data().bookmarks;
                setIsSaved(bookmarks.some(b => b.jobID === id));
            }
        };
        fetchBookmarks();
    }, [id]);

    const toggleSaveJob = async () => {
        const user = auth.currentUser;
        if (!user) {
            toast.error('Please sign in to save projects');
            return;
        }
        const userDocRef = doc(db, "Users", user.email);
        const userDoc = await getDoc(userDocRef);
        let bookmarks = userDoc.exists() && userDoc.data().bookmarks ? userDoc.data().bookmarks : [];
        if (isSaved) {
            bookmarks = bookmarks.filter(b => b.jobID !== id);
            toast.success('Project removed from saved projects');
        } else {
            bookmarks = [...bookmarks, {
                jobID: id,
                jobTitle: jobData.projectTitle,
                projectType: jobData.projectType,
                location: jobData.location || "",
                status: jobData.status,
            }];
            toast.success('Project saved successfully');
        }
        await updateDoc(userDocRef, { bookmarks });
        setIsSaved(!isSaved);
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

    const renderPriceRating = (rating) => {
        if (rating === 0) return <span className="text-gray-500 font-medium">FREE</span>;
        const activeColor = "text-primary";
        const inactiveColor = "text-primary/50";
        return (
            <div className="flex items-center">
                {Array.from({ length: 4 }).map((_, i) => (
                    <FaDollarSign key={i} className={`h-4 w-4 ${i < rating ? activeColor : inactiveColor}`} />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-10">
            <ProfileBanner
                title="Profile Details"
                subtitle="Business plan draws on a wide range of knowledge from different business disciplines. Business draws on a wide range of different business."
                breadcrumbs={[
                    { name: "Home", href: "/" },
                    { name: "Browse Profiles", href: "/browse-profiles" }
                ]}
            />

            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
                    {/* Left Column */}
                    <div className="w-full md:w-2/3 order-2 md:order-1">
                        <div className="bg-white rounded-sm shadow-md p-8 mb-8">
                            {/* Project Header */}
                            <div className="flex items-center mb-6 border-b border-gray-400 pb-4">
                                <div>
                                    <h1 className="text-2xl font-semibold text-gray-800 mb-2">{jobData.projectTitle}</h1>

                                    {(jobData.status === "Pending" || jobData.status === "Ongoing") && (
                                        <span className={`inline-block py-1 rounded-full border p-2 font-semibold text-xs 
        ${jobData.status === "Pending" ? "text-yellow-700 bg-yellow-50 border-yellow-200" :
                                                "text-green-700 bg-green-50 border-green-200"} mb-2`}>
                                            {jobData.status === "Pending" ? "Open" : jobData.status}
                                        </span>
                                    )}

                                    {/* Project Owner */}
                                    {/* <div className="flex items-center gap-2 mt-1">
                                        <span className="text-primary font-medium">{jobData.name || "Company"}</span>
                                        {jobData.location && (
                                            <span className="text-gray-500 flex items-center gap-1">
                                                <SlLocationPin className="inline-block" /> {jobData.location}
                                            </span>
                                        )}
                                    </div> */}
                                </div>
                            </div>

                            {/* Tech Stack */}
                            <div className="mb-8">
                                <h2 className="text-lg font-normal mb-2">Required Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {jobData.techStack && jobData.techStack.length > 0 ? (
                                        jobData.techStack.map((tech, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-50 text-blue-700 px-3 py-1 rounded-sm text-sm font-medium"
                                            >
                                                {tech}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500">No specific skills required</span>
                                    )}
                                </div>
                            </div>

                            {/* Project Description */}
                            <div className="mb-8">
                                <h2 className="text-lg font-normal mb-2">Project Description</h2>
                                <p className="text-gray-700 text-md">{jobData.description}</p>
                            </div>
                            {/* Responsibilities */}
                            <div className="mb-8">
                                <h2 className="text-lg font-normal mb-2">Responsibilities</h2>
                                <div className="text-gray-700">
                                    {jobData.responsibilities
                                        ? <ul className="list-disc pl-6 ">{jobData.responsibilities.split('\n').map((item, idx) => <li key={idx}>{item}</li>)}</ul>
                                        : "Not specified"}
                                </div>
                            </div>
                            {/* Requirements */}
                            <div className="mb-8">
                                <h2 className="text-lg font-normal mb-2">Requirements</h2>
                                <div className="text-gray-700">
                                    {jobData.requirements
                                        ? <ul className="list-disc pl-6">{jobData.requirements.split('\n').map((item, idx) => <li key={idx}>{item}</li>)}</ul>
                                        : "Not specified"}
                                </div>
                            </div>
                            {/* Benefits */}
                            {jobData.benefits && (
                                <div className="mb-8">
                                    <h2 className="text-lg font-normal mb-2">Benefits</h2>
                                    <ul className="list-disc pl-6 text-gray-700">
                                        {jobData.benefits.split('\n').map((benefit, idx) => (
                                            <li key={idx}>{benefit}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Additional Resources */}
                            {jobData.fileUrl && (
                                <div className="mb-8">
                                    <h2 className="text-lg font-normal mb-2">Additional Resources</h2>
                                    <a
                                        href={jobData.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-sm"
                                    >
                                        <FaFileAlt className="mr-2" />
                                        Download Project Document
                                    </a>
                                </div>
                            )}
                            {/* Social Share */}
                            <div className="border-t border-gray-400 pt-6">
                                <SocialShare shareLink={window.location.href} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="w-full md:w-1/3 flex flex-col gap-8 order-1 md:order-2">

                        {/* Action Buttons */}
                        <div className="bg-white rounded-sm shadow-md p-6 flex gap-4">
                            <button
                                onClick={toggleSaveJob}
                                className={`w-full py-3 rounded-sm font-medium transition-colors flex items-center justify-center cursor-pointer
        bg-white text-gray-800 border border-gray-300 hover:bg-gray-100`}
                            >
                                {isSaved ? (
                                    <FaBookmark className="mr-2 text-primary" />
                                ) : (
                                    <FaRegBookmark className="mr-2" />
                                )}
                                {isSaved ? 'Saved Job' : 'Save Job'}
                            </button>
                            <button
                                onClick={handleApply}
                                className="w-full bg-primary text-white py-3 rounded-sm font-medium transition-colors flex items-center justify-center cursor-pointer hover:bg-primary-hover text-sm"
                            >
                                Apply Now
                            </button>
                        </div>


                        {/* Project Overview Card */}
                        <div className="bg-white rounded-sm shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Overview</h3>

                            <div className="space-y-3">
                                <div>
                                    <span className="font-medium">Published on:</span> {formatFullDate(jobData.createdAt)}
                                </div>

                                <div className="flex items-center gap-2">
                                    <RiMoneyRupeeCircleLine className="text-gray-900" size={20} />
                                    <span className="font-medium text-gray-700">
                                        {renderPriceRating(getPriceRating(jobData.budget))}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    < FiAward className="text-gray-900" size={20} />
                                    <span className="font-medium text-gray-700">{jobData.points || 0} XP</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <RiPriceTag3Line className="text-gray-900" size={20} />
                                    <span className="font-medium text-gray-700">{jobData.projectType || "Not specified"}</span>
                                </div>

                                {/* <div className="flex items-center gap-2">
                                    <PiClockCountdownBold className="text-gray-900" size={20} />
                                    <span className="font-medium text-gray-700">
                                        Deadline: {jobData.deadline ? formatFullDate(jobData.deadline) : "N/A"}
                                    </span>
                                </div> */}

                                {/* Contact Information */}
                                {/* <div className='bg-gray-100 p-4 rounded-sm mt-4 space-y-2'>
                                    <h4 className="text-md font-semibold text-primary mb-2">Contact Information</h4>
                                    <div className="flex items-center gap-2">
                                        <RiUser3Line className="text-gray-900" size={20} />
                                        <span className="font-medium text-gray-700">
                                            {jobData.name || "N/A"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <AiOutlineMail className="text-gray-900" size={20} />
                                        <span className="font-medium text-gray-700">
                                            {jobData.email || "N/A"}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <FiPhone className="text-gray-900" size={20} />
                                        <span className="font-medium text-gray-700">
                                            {jobData.mobile || "N/A"}
                                        </span>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
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

export default ProjectDetail;