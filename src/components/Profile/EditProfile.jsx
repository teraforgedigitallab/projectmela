import React, { useState, useEffect } from 'react';
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../firebaseConfig/firebase';
import { Card, Typography, InputField, GenderTabs, SkillsMultiSelect, AvatarSelector, Button } from '../../ui';
import { toast } from "react-toastify";
import { mapFormToFirestore } from '../../utils/mapFormToFirestore';
import userAvatar from '/assets/images/resume/avatar.png';
import { skillOptions, genderOptions } from '../../data/data';
import { FileUploadBox } from '../../components';
import pdfToText from 'react-pdftotext';
import { processResumeWithAI } from '../../utils/aiLogic';
import { useNavigate } from 'react-router-dom';

const EditProfile = ({ profileData, onProfileUpdate }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        avatar: profileData?.avatar || userAvatar,
        firstName: profileData?.firstName ?? "",
        lastName: profileData?.lastName ?? "",
        email: profileData?.contact?.email ?? "",
        phone: profileData?.contact?.phone ?? "",
        dateOfBirth: profileData?.dateOfBirth ?? "",
        gender: profileData?.gender ?? "",
        city: profileData?.city ?? "",
        state: profileData?.state ?? "",
        country: profileData?.country ?? "",
        websiteUrl: profileData?.websiteUrl ?? "",
        designation: profileData?.designation ?? "",
        perHour: profileData?.perHour ?? "",
        educationalQualification: profileData?.educationalQualification ?? "",
        educationalInstitute: profileData?.educationalInstitute ?? "",
        resumeLink: profileData?.resumeLink ?? "",
        githubLink: profileData?.githubLink ?? "",
        linkedinLink: profileData?.linkedinLink ?? "",
        instagramLink: profileData?.instagramLink ?? "",
        skills: profileData?.skills ?? [],
        about: profileData?.about ?? "",
        myExperience: profileData?.myExperience ?? "",
        pastProjects: profileData?.pastProjects ?? "",
    });
    const [saving, setSaving] = useState(false);

    // AI Resume Upload states
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [typingText, setTypingText] = useState('');
    const processingMessage = "Processing your resume...";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (isProcessing) {
            setTypingText('');
            let i = 0;
            const interval = setInterval(() => {
                setTypingText(processingMessage.slice(0, i + 1));
                i++;
                if (i === processingMessage.length) clearInterval(interval);
            }, 40);
            return () => clearInterval(interval);
        }
    }, [isProcessing]);

    // AI Generate Button click
    const handleAIGenerateClick = () => {
        setShowFileUpload(true);
    };

    // Handle PDF file upload and AI processing
    const handlePdfFile = async (file) => {
        setIsProcessing(true);
        let retryCount = 0;
        const maxRetries = 2;
        const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

        while (retryCount <= maxRetries) {
            try {
                const text = await pdfToText(file);
                const result = await processResumeWithAI(text, geminiApiKey, formData.email);

                // Fill all form fields with AI result
                setFormData(prev => ({
                    ...prev,
                    ...result.userData,
                    skills: result.skills || [],
                }));

                setShowFileUpload(false);
                toast.success("Resume processed successfully!");
                break;
            } catch (error) {
                retryCount++;
                if (retryCount > maxRetries) {
                    toast.error("Failed to process resume. Please try again.");
                    setShowFileUpload(false);
                }
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;
            const userDocRef = doc(db, "Users", user.email);

            // Convert form data to Firestore format before saving
            const firestoreData = mapFormToFirestore(formData);
            await updateDoc(userDocRef, firestoreData);

            if (onProfileUpdate) {
                onProfileUpdate({
                    ...profileData,
                    ...formData,
                });
            }
            toast.success("Profile updated successfully!");
            navigate('/profile');
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card className="p-6">
            <Typography variant="h5" className="mb-6 font-semibold">Basic Information</Typography>
            {/* AI Generate Button */}
            <div className="flex justify-end mb-4">
                <Button
                    variant="primary"
                    onClick={handleAIGenerateClick}
                    className="px-6 py-2 rounded-md font-semibold bg-primary text-white hover:bg-blue-700 transition-colors"
                    style={{ minWidth: 160 }}
                >
                    AI Generate
                </Button>
            </div>
            {/* File Upload Modal */}
            {showFileUpload && (
                <div className="file-upload-overlay">
                    <div className="file-upload-modal">
                        {isProcessing ? (
                            <div className="processing-overlay text-primary">
                                <p className='font-bold'>{typingText}</p>
                            </div>
                        ) : (
                            <FileUploadBox
                                onClose={() => setShowFileUpload(false)}
                                onFileSelect={handlePdfFile}
                            />
                        )}
                    </div>
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6 ">
                {/* Avatar Selector */}
                <AvatarSelector
                    gender={formData.gender}
                    value={formData.avatar}
                    onChange={(avatar) => setFormData((prev) => ({ ...prev, avatar }))}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    <InputField
                        label="First Name"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                        required
                    />
                    <InputField
                        label="Last Name"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                        required
                    />
                    <InputField
                        label="Email"
                        name="email"
                        type="text"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                        disabled
                    />
                    <InputField
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        required
                    />
                    <InputField
                        label="Date of Birth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        placeholder="Enter your date of birth"
                        required
                    />
                    <GenderTabs
                        options={genderOptions}
                        selected={formData.gender}
                        onSelect={(gender) => setFormData((prev) => ({ ...prev, gender }))}
                        label="Gender"
                    />
                    <InputField
                        label="City"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter your city"
                        required
                    />
                    <InputField
                        label="State"
                        name="state"
                        type="text"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Enter your state"
                        required
                    />
                    <InputField
                        label="Country"
                        name="country"
                        type="text"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="Enter your country"
                        required
                    />
                    <InputField
                        label="Website URL"
                        name="websiteUrl"
                        type="url"
                        value={formData.websiteUrl}
                        onChange={handleChange}
                        placeholder="https://yourwebsite.com"
                    />
                </div>
                <hr className="my-5 border-gray-200" />
                <Typography variant="h5" className="mb-6 font-semibold">Experience and Skills</Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    <InputField
                        label="Professional Title"
                        name="designation"
                        type="text"
                        value={formData.designation}
                        onChange={handleChange}
                        placeholder="Headline (eg. Front-end Developer)"
                        required
                    />
                    <InputField
                        label="Per Hour"
                        name="perHour"
                        type="number"
                        value={formData.perHour}
                        onChange={handleChange}
                        placeholder="Salary eg. 85"
                        required
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                    <InputField
                        label="Educational Qualification"
                        name="educationalQualification"
                        type="text"
                        value={formData.educationalQualification}
                        onChange={handleChange}
                        placeholder="Enter your educational qualification"
                        required
                    />
                    <InputField
                        label="Educational Institute"
                        name="educationalInstitute"
                        type="text"
                        value={formData.educationalInstitute}
                        onChange={handleChange}
                        placeholder="Enter your educational institute"
                        required
                    />
                    <InputField
                        label="Link to your Resume/CV"
                        name="resumeLink"
                        type="url"
                        value={formData.resumeLink}
                        onChange={handleChange}
                        placeholder="https://resume.example.com"
                        required
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
                    <InputField
                        label="Link to your GitHub Profile"
                        name="githubLink"
                        type="url"
                        value={formData.githubLink}
                        onChange={handleChange}
                        placeholder="https://github.com/yourusername"
                        required
                    />
                    <InputField
                        label="Link to your LinkedIn Profile"
                        name="linkedinLink"
                        type="url"
                        value={formData.linkedinLink}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/yourusername"
                        required
                    />
                    <InputField
                        label="Link to your Instagram Profile"
                        name="instagramLink"
                        type="url"
                        value={formData.instagramLink}
                        onChange={handleChange}
                        placeholder="https://instagram.com/yourusername"
                        required
                    />
                </div>
                <SkillsMultiSelect
                    options={skillOptions}
                    selectedSkills={formData.skills}
                    setSelectedSkills={(skills) => setFormData((prev) => ({ ...prev, skills }))}
                    label="Skills"
                    maxSkills={20}
                />
                <hr className="my-5 border-gray-200" />
                <Typography variant="h5" className="mb-6 font-semibold">More About Me</Typography>
                <div className="grid grid-cols-1 gap-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">About</label>
                        <textarea
                            name="about"
                            value={formData.about}
                            onChange={handleChange}
                            className="w-full p-3 h-32 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary transition"
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">My Experience</label>
                        <textarea
                            name="myExperience"
                            value={formData.myExperience}
                            onChange={handleChange}
                            className="w-full p-3 h-32 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary transition"
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Past Projects</label>
                        <textarea
                            name="pastProjects"
                            value={formData.pastProjects}
                            onChange={handleChange}
                            className="w-full p-3 h-32 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary transition"
                            required
                        ></textarea>
                    </div>
                </div>
                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-primary text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </Card>
    );
};

export default EditProfile;