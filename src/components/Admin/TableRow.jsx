import React, { useState } from 'react';
import { FaTimes, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { doc, updateDoc, getDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";
import { skillOptions } from '../../data/data';
import { handleApplicantProfileClick } from '../../utils/adminDashboardUtils';
import { Modal, ScrollableModal } from '../../ui';

const MAX_SKILLS_PER_ROW = 4;
const MAX_APPLICANTS_PER_ROW = 4;
const MAX_MODERATORS_PER_ROW = 4;

const TableRow = ({
    projectId,
    projectName,
    onProjectClick = () => { },
    removedApplicantNames = [],
    onRemovedApplicantClick = () => { },
    applicantNames = [],
    onApplicantClick = () => { },
    clientName,
    onClientClick = () => { },
    moderatorNames = [],
    onModeratorClick = () => { },
    removedModerators = [],
    skills = [],
    date,
    points,
    minXP,
    communicationPreference,
    status,
    statusClass,
    budget,
    notifyUser,
    activeTab,
    onMainButtonClick,
    onDeleteClick,
}) => {
    const [showModal, setShowModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [modalHeading, setModalHeading] = useState('');
    const [userModalHeading, setUserModalHeading] = useState('');
    const [userModalMessage, setUserModalMessage] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showModeratorModal, setShowModeratorModal] = useState(false);
    const [newModeratorEmail, setNewModeratorEmail] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [editingField, setEditingField] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState(skills);
    const [searchTerm, setSearchTerm] = useState('');
    const [superAdminID, setSuperAdminID] = useState('');
    const [currentUserEmail, setCurrentUserEmail] = useState('');
    const [isRemovedUser, setIsRemovedUser] = useState(false);
    const [userType, setUserType] = useState('');

    const handleEditClick = (field) => {
        if (activeTab === "Applications" && field === 'points') return;

        setEditingField(field);
        setModalHeading(field === 'budget' ? 'Edit Budget' : field === 'points' ? 'Edit Points' : 'Edit Min XP');
        setInputValue(field === 'budget' ? budget : field === 'points' ? points : minXP);
        setShowModal(true);
    };

    const handleSkillAddClick = () => {
        setShowDropdown(!showDropdown);
        setEditingField('skills');
    };

    const handleRemoveSkill = (skillToRemove) => {
        setSelectedSkills(prevSkills => prevSkills.filter(skill => skill !== skillToRemove));
    };

    const handleSkillChange = (skill, e) => {
        if (e) {
            e.stopPropagation();
        }

        setSelectedSkills(prevSkills => {
            if (prevSkills.includes(skill)) {
                return prevSkills.filter(s => s !== skill);
            } else if (prevSkills.length >= 20) {
                toast.error("You cannot select more than 20 skills.");
                return prevSkills;
            } else {
                return [...prevSkills, skill];
            }
        });
    };

    const filteredSkills = skillOptions.filter(skill =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSkillSave = async () => {
        try {
            const docRef = doc(db, "Projects", projectId);
            await updateDoc(docRef, {
                techStack: selectedSkills
            });
            setShowDropdown(false);
            toast.success('Skills updated successfully!');
        } catch (error) {
            console.error("Error updating document: ", error);
            toast.error('Error updating skills');
        }
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleModeratorAdd = async () => {
        if (!newModeratorEmail.trim()) {
            toast.error('Please enter a moderator email');
            return;
        }

        if (!isValidEmail(newModeratorEmail)) {
            toast.error('Please enter a valid email address');
            return;
        }

        try {
            const docRef = doc(db, "Projects", projectId);
            const projectDoc = await getDoc(docRef);
            const currentModerators = projectDoc.data().moderators || [];

            if (currentModerators.includes(newModeratorEmail.trim())) {
                toast.error('This moderator is already added');
                return;
            }

            await updateDoc(docRef, {
                moderators: [...currentModerators, newModeratorEmail.trim()]
            });

            setShowModeratorModal(false);
            setNewModeratorEmail('');
            setSuperAdminID('');
            toast.success('Moderator added successfully!');
        } catch (error) {
            console.error("Error adding moderator: ", error);
            toast.error('Error adding moderator');
        }
    };

    const handleUserActionClick = async () => {
        try {
            const docRef = doc(db, "Projects", projectId);

            if (isRemovedUser) {
                if (userType === 'applicant') {
                    await updateDoc(docRef, {
                        selectedApplicants: arrayUnion(currentUserEmail),
                        removedApplicants: arrayRemove(currentUserEmail)
                    });
                    toast.success('Applicant added back successfully!');
                } else if (userType === 'moderator') {
                    await updateDoc(docRef, {
                        moderators: arrayUnion(currentUserEmail),
                        removedModerators: arrayRemove(currentUserEmail)
                    });
                    toast.success('Moderator added back successfully!');
                }
            } else {
                if (userType === 'applicant') {
                    await updateDoc(docRef, {
                        selectedApplicants: arrayRemove(currentUserEmail),
                        removedApplicants: arrayUnion(currentUserEmail)
                    });
                    toast.success('Applicant removed successfully!');
                } else if (userType === 'moderator') {
                    await updateDoc(docRef, {
                        moderators: arrayRemove(currentUserEmail),
                        removedModerators: arrayUnion(currentUserEmail)
                    });
                    toast.success('Moderator removed successfully!');
                }
            }
            setShowUserModal(false);
        } catch (error) {
            console.error("Error updating document: ", error);
            toast.error('Error updating user status');
        }
    };

    const handleUserClick = (email, isRemovedUser, userType) => {
        setCurrentUserEmail(email);
        setIsRemovedUser(isRemovedUser);
        setUserType(userType);
        handleApplicantProfileClick(
            email,
            setUserModalHeading,
            setUserModalMessage,
            setShowUserModal,
            false
        );
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSave = async () => {
        try {
            const docRef = doc(db, "Projects", projectId);

            if (editingField === 'budget') {
                await updateDoc(docRef, {
                    budget: parseFloat(inputValue)
                });
            } else if (editingField === 'points') {
                await updateDoc(docRef, {
                    points: inputValue
                });
            } else if (editingField === 'minXP') {
                await updateDoc(docRef, {
                    minXP: inputValue
                });
            }
            setShowModal(false);
            toast.success('Field updated successfully!');
        } catch (error) {
            console.error("Error updating document: ", error);
            toast.error('Error updating field');
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const docRef = doc(db, "Projects", projectId);
            await updateDoc(docRef, {
                isDeletedByAdmin: true
            });
            setShowDeleteModal(false);
            toast.success('Document deleted successfully!');
            if (onDeleteClick) {
                onDeleteClick();
            }
        } catch (error) {
            console.error("Error updating document: ", error);
            toast.error('Error marking document as deleted');
        }
    };

    const handleApplicationDeletion = async () => {
        try {
            const docRef = doc(db, "Applications", projectId);
            await updateDoc(docRef, {
                isDeleted: true
            });
            setShowDeleteModal(false);
            toast.success('Application deleted successfully!');
            if (onDeleteClick) {
                onDeleteClick();
            }
        } catch (error) {
            console.error("Error deleting application: ", error);
            toast.error('Error deleting application');
        }
    };

    const getButtonText = () => {
        switch (activeTab) {
            case "Applications":
                return "Accept";
            case "Pending":
                return "Start";
            case "Ongoing":
                return "Close";
            case "Project Requests":
                return "Approve";
            default:
                return "Default";
        }
    };

    return (
        <>
            <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                        className="text-primary hover:text-primary-dark font-medium cursor-pointer"
                        onClick={onProjectClick}
                    >
                        {projectName}
                    </button>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                        className="text-primary hover:text-primary-dark font-medium cursor-pointer"
                        onClick={onClientClick}
                    >
                        {clientName}
                    </button>
                </td>

                {(activeTab === "Pending" || activeTab === "Ongoing") && (
                    <td className="px-6 py-4">
                        {/* Removed Moderators */}
                        {removedModerators.length > 0 && (
                            <div className="max-w-md break-words mb-2">
                                {removedModerators.map((moderator, index) => (
                                    <React.Fragment key={index}>
                                        <button 
                                            className="text-red-600 hover:text-red-800 font-medium cursor-pointer"
                                            onClick={() => handleUserClick(moderator, true, 'moderator')}
                                        >
                                            {moderator}
                                        </button>
                                        {index % MAX_APPLICANTS_PER_ROW === MAX_APPLICANTS_PER_ROW - 1 && <br />}
                                        {index < removedModerators.length - 1 && <span className="mx-1">||</span>}
                                    </React.Fragment>
                                ))}
                            </div>
                        )}

                        {/* Active Moderators */}
                        <div className="max-w-md break-words flex items-start">
                            <div className="flex-grow">
                                {moderatorNames.map((moderator, index) => (
                                    <React.Fragment key={index}>
                                        <button 
                                            className="text-primary hover:text-primary-dark font-medium cursor-pointer"
                                            onClick={() => handleUserClick(moderator, false, 'moderator')}
                                        >
                                            {moderator}
                                        </button>
                                        {index % MAX_MODERATORS_PER_ROW === MAX_MODERATORS_PER_ROW - 1 && <br />}
                                        {index < moderatorNames.length - 1 && <span className="mx-1">||</span>}
                                    </React.Fragment>
                                ))}
                            </div>
                            <button 
                                className="ml-2 p-1 bg-gray-100 rounded-full hover:bg-gray-200 flex items-center justify-center"
                                onClick={() => setShowModeratorModal(true)}
                            >
                                <FaPlus className="h-3 w-3 text-gray-600" />
                            </button>
                        </div>
                    </td>
                )}

                {(activeTab === "Pending" || activeTab === "Ongoing" || activeTab === "Applications") && (
                    <td className="px-6 py-4">
                        {/* Removed Applicants */}
                        {(activeTab === "Pending" || activeTab === "Ongoing") && removedApplicantNames.length > 0 && (
                            <div className="max-w-md break-words mb-2">
                                {removedApplicantNames.map((applicant, index) => (
                                    <React.Fragment key={index}>
                                        <button 
                                            className="text-red-600 hover:text-red-800 font-medium cursor-pointer"
                                            onClick={() => handleUserClick(applicant, true, 'applicant')}
                                        >
                                            {applicant}
                                        </button>
                                        {index % MAX_APPLICANTS_PER_ROW === MAX_APPLICANTS_PER_ROW - 1 && <br />}
                                        {index < removedApplicantNames.length - 1 && <span className="mx-1">||</span>}
                                    </React.Fragment>
                                ))}
                            </div>
                        )}

                        {/* Active Applicants */}
                        <div className="max-w-md break-words">
                            {applicantNames.map((applicant, index) => (
                                <React.Fragment key={index}>
                                    <button 
                                        className="text-primary hover:text-primary-dark font-medium cursor-pointer"
                                        onClick={() => {
                                            if (activeTab === "Pending" || activeTab === "Ongoing") {
                                                handleUserClick(applicant, false, 'applicant')
                                            }
                                            if (activeTab === "Applications") {
                                                handleApplicantProfileClick(projectId, setUserModalHeading, setUserModalMessage, setShowUserModal, true);
                                            }
                                        }}
                                    >
                                        {applicant}
                                    </button>
                                    {index % MAX_APPLICANTS_PER_ROW === MAX_APPLICANTS_PER_ROW - 1 && <br />}
                                    {index < applicantNames.length - 1 && <span className="mx-1">||</span>}
                                </React.Fragment>
                            ))}
                        </div>
                    </td>
                )}

                <td className="px-6 py-4 whitespace-nowrap">
                    {date}
                </td>

                {(activeTab === "Project Requests" || activeTab === "Ongoing" || activeTab === "Pending") && (
                    <td className="px-6 py-4 whitespace-nowrap">
                        {budget === -1 ? (
                            <button 
                                className="text-red-600 hover:text-red-800 font-medium cursor-pointer"
                                onClick={() => handleEditClick('budget')}
                            >
                                N/A
                            </button>
                        ) : (
                            <button 
                                className="text-primary hover:text-primary-dark font-medium cursor-pointer"
                                onClick={() => handleEditClick('budget')}
                            >
                                {budget}
                            </button>
                        )}
                    </td>
                )}

                <td className="px-6 py-4">
                    <div className="relative">
                        {showDropdown ? (
                            <div className="absolute z-10 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto">
                                <div className="sticky top-0 bg-white p-2 border-b border-gray-200 z-10 flex justify-between items-center">
                                    <div className="relative flex-grow">
                                        <input
                                            type="text"
                                            placeholder="Search skills..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                                        />
                                    </div>
                                    <div className="ml-2 flex">
                                        <button 
                                            className="px-2 py-1 bg-primary text-white rounded hover:bg-primary-dark"
                                            onClick={handleSkillSave}
                                        >
                                            Save
                                        </button>
                                        <button 
                                            className="ml-1 p-1 text-gray-400 hover:text-gray-600"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <FaTimes size={16} />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="p-2">
                                    {filteredSkills.map(option => (
                                        <div key={option} className="flex items-center py-1.5">
                                            <input
                                                type="checkbox"
                                                id={`skill-${option}`}
                                                checked={selectedSkills.includes(option)}
                                                onChange={(e) => handleSkillChange(option, e)}
                                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                            />
                                            <label 
                                                htmlFor={`skill-${option}`} 
                                                className="ml-2 block text-sm text-gray-700 cursor-pointer"
                                            >
                                                {option}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-1">
                                {selectedSkills.map((tag, index) => (
                                    <React.Fragment key={index}>
                                        <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary text-white">
                                            {tag}
                                            <button 
                                                className="ml-1 text-white hover:text-gray-200"
                                                onClick={() => handleRemoveSkill(tag)}
                                            >
                                                <FaTimes className="h-3 w-3" />
                                            </button>
                                        </span>
                                    </React.Fragment>
                                ))}
                                <button 
                                    className="ml-2 p-1 bg-gray-100 rounded-full hover:bg-gray-200 flex items-center justify-center"
                                    onClick={handleSkillAddClick}
                                >
                                    <FaPlus className="h-3 w-3 text-gray-600" />
                                </button>
                            </div>
                        )}
                    </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                        className={`px-4 py-2 rounded-md font-semibold text-white transition-all duration-200 focus:outline-none ${statusClass}`}
                        onClick={onMainButtonClick}
                    >
                        {getButtonText()}
                    </button>
                </td>
            </tr>

            {/* Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                heading={modalHeading}
                onSubmit={handleSave}
                content={
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                }
            />

            {/* User Modal */}
            <ScrollableModal
                isOpen={showUserModal}
                onClose={() => setShowUserModal(false)}
                heading={userModalHeading}
                content={
                    <div className="p-4">
                        <p className="text-gray-700 text-sm mb-4">{userModalMessage}</p>
                        <div className="flex gap-2">
                            <button 
                                className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-all duration-200"
                                onClick={handleUserActionClick}
                            >
                                {isRemovedUser ? 'Restore' : 'Remove'} {userType === 'applicant' ? 'Applicant' : 'Moderator'}
                            </button>
                            <button 
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all duration-200"
                                onClick={() => setShowUserModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                }
            />

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                heading="Confirm Deletion"
                onSubmit={activeTab === "Applications" ? handleApplicationDeletion : handleDeleteConfirm}
                content={
                    <div className="p-4">
                        <p className="text-gray-700 text-sm mb-4">
                            Are you sure you want to delete this {activeTab === "Applications" ? 'application' : 'project'}?
                        </p>
                        <div className="flex gap-2">
                            <button 
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-200"
                                onClick={activeTab === "Applications" ? handleApplicationDeletion : handleDeleteConfirm}
                            >
                                Yes, Delete
                            </button>
                            <button 
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-all duration-200"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                }
            />

            {/* Add Moderator Modal */}
            <Modal
                isOpen={showModeratorModal}
                onClose={() => setShowModeratorModal(false)}
                heading="Add Moderator"
                onSubmit={handleModeratorAdd}
                content={
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            value={newModeratorEmail}
                            onChange={(e) => setNewModeratorEmail(e.target.value)}
                            placeholder="Enter moderator email"
                            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                }
            />
        </>
    );
};

export default TableRow;