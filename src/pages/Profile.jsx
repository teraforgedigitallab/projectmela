import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, NavLink } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebaseConfig/firebase';
import { Card, Typography, Button } from '../ui';
import { ProfileBanner, ProfileHeader, ProfileAbout, ProfileContactInfo, ProfileProfessional, ProfileSkills, ProfileDetails, SavedJobs, ChangePassword, EditProfile } from '../components';
import { mapFirestoreToForm } from '../utils/mapFormToFirestore';
import useCheckUserSignin from '../hooks/useCheckUserSignin';


import { FaRegClipboard, FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { FaRegEnvelope, FaRegBookmark } from "react-icons/fa6";
import { PiSignOut } from "react-icons/pi";
import { IoDocumentTextOutline } from "react-icons/io5";

import { Modal } from '../ui';

const ProfileSidebar = () => {
    const navigate = useNavigate();

    const [showSignoutModal, setShowSignoutModal] = useState(false);

    const initiateSignout = () => {
        setShowSignoutModal(true);
    };

    const handleSignOut = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            setShowSignoutModal(false);
            navigate('/signin');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    // Sidebar links config
    const links = [
        {
            to: "/profile",
            label: "My Profile",
            icon: <FaRegClipboard size={16} />,
        },
        {
            to: "/profile/edit",
            label: "Edit Profile",
            icon: <FaRegEnvelope size={16} />,
        },
        {
            to: "/profile/bookmarks",
            label: "Bookmarked Projects",
            icon: <FaRegBookmark size={16} />,
        },
        {
            to: "/profile/change-password",
            label: "Change Password",
            icon: <FaRegClipboard size={16} />,
        },
    ];

    return (
        <Card className="p-4">
            <Typography variant="h6" className="font-semibold p-4 border-b border-gray-200">
                Manage Account
            </Typography>
            <div className="py-3 flex flex-col gap-2">
                {links.map(link => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.to === "/profile"}
                        className="w-full"
                    >
                        {({ isActive }) => (
                            <Button
                                variant={isActive ? "primary" : "outlined"}
                                icon={
                                    <span className={`flex items-center justify-center w-8 h-8 rounded-sm ${isActive ? "bg-white text-primary" : "bg-iconbg text-primary"} mr-3`}>
                                        {link.icon}
                                    </span>
                                }
                                className="justify-start mb-0 w-full"
                            >
                                {link.label}
                            </Button>
                        )}
                    </NavLink>
                ))}
                <Button
                    onClick={initiateSignout}
                    variant="outlined"
                    icon={
                        <span className="flex items-center justify-center w-8 h-8 rounded-sm bg-gray-100 text-red-600 mr-3">
                            <PiSignOut size={16} style={{ transform: 'rotate(-90deg)' }} />
                        </span>
                    }
                    className="justify-start text-red-600 hover:bg-red-50 w-full"
                >
                    Sign Out
                </Button>
            </div>

            
            <Modal
                show={showSignoutModal}
                onClose={() => setShowSignoutModal(false)}
                heading="Sign Out"
                body="Are you sure you want to sign out?"
                showButtons={true}
                primaryButtonText="Sign Out"
                secondaryButtonText="Cancel"
                onPrimaryClick={handleSignOut}
                onSecondaryClick={() => setShowSignoutModal(false)}
            />
        </Card>
    );
};

// Main Profile Component that handles routing
const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Check if user is signed in
    useCheckUserSignin(navigate);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                navigate('/signin');
                return;
            }
            try {
                const userDoc = await getDoc(doc(db, "Users", user.email));
                if (userDoc.exists()) {
                    // Transform Firestore data to match your component's expected format
                    setProfileData(mapFirestoreToForm(userDoc.data()));
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [navigate]);


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!profileData) {
        return <div>No profile data found.</div>;
    }

    const socials = [
        profileData.resumeLink && {
            name: "Resume",
            url: profileData.resumeLink,
            icon: <IoDocumentTextOutline size={22} />,
        },
        profileData.githubLink && {
            name: "GitHub",
            url: profileData.githubLink,
            icon: <FaGithub size={20} />,
        },
        profileData.linkedinLink && {
            name: "LinkedIn",
            url: profileData.linkedinLink,
            icon: <FaLinkedin size={20} />,
        },
        profileData.instagramLink && {
            name: "Instagram",
            url: profileData.instagramLink,
            icon: <FaInstagram size={20} />,
        },
    ].filter(Boolean);

    return (
        <Routes>
            {/* Main Profile route */}
            <Route path="/" element={
                <main className="bg-gray-50">
                    <ProfileBanner
                        title="My Profile"
                        subtitle="Business plan draws on a wide range of knowledge from different business disciplines. Business draws on a wide range of different business."
                        breadcrumbs={[
                            { name: "Home", href: "/" },
                            { name: "My Profile", href: "/profile" }
                        ]}
                    />
                    <div className="container mx-auto px-4 lg:px-40 py-8">
                        <div className="grid grid-cols-12 gap-6">
                            {/* Sidebar */}
                            <aside className="col-span-12 lg:col-span-4">
                                <ProfileSidebar />
                            </aside>
                            {/* Main Content */}
                            <section className="col-span-12 md:col-span-8">
                                <Card className="p-6">
                                    <ProfileHeader
                                        profileData={profileData}
                                        socials={socials}
                                    />
                                    <ProfileContactInfo profileData={profileData} />
                                    <hr className="my-5 border-gray-200" />
                                    <Typography variant="h5" className="mb-2 font-semibold">About</Typography>
                                    <Typography variant="p" className="mb-4">{profileData.about}</Typography>
                                    <hr className="my-5 border-gray-200" />
                                    <ProfileSkills skills={profileData.skills} />
                                    <hr className="my-5 border-gray-200" />
                                    <ProfileDetails profileData={profileData} />
                                    <hr className="my-5 border-gray-200" />
                                    <ProfileProfessional profileData={profileData} />
                                    <hr className="my-5 border-gray-200" />
                                    <ProfileAbout profileData={profileData} />
                                </Card>
                            </section>
                        </div>
                    </div>
                </main>
            } />

            {/* Edit Profile route - no sidebar */}
            <Route path="/edit" element={
                <main className="bg-gray-50">
                    <ProfileBanner
                        title="Edit Profile"
                        subtitle="Update your personal information and preferences."
                        breadcrumbs={[
                            { name: "Home", href: "/" },
                            { name: "My Profile", href: "/profile" },
                            { name: "Edit Profile", href: "/profile/edit" }
                        ]}
                    />
                    <div className="container mx-auto px-4 md:px-40 py-8">
                        <div className="grid grid-cols-12">
                            <section className="col-span-12 lg:col-span-10 lg:col-start-2">
                                <EditProfile
                                    profileData={profileData}
                                    onProfileUpdate={setProfileData}
                                />
                            </section>
                        </div>
                    </div>
                </main>
            } />

            {/* Change Password route */}
            <Route path="/change-password" element={
                <main className="bg-gray-50">
                    <ProfileBanner
                        title="Change Password"
                        subtitle="Update your security credentials."
                        breadcrumbs={[
                            { name: "Home", href: "/" },
                            { name: "My Profile", href: "/profile" },
                            { name: "Change Password", href: "/profile/change-password" }
                        ]}
                    />
                    <div className="container mx-auto px-4 md:px-40 py-8">
                        <div className="grid grid-cols-12 gap-6">
                            {/* Sidebar */}
                            <aside className="col-span-12 lg:col-span-4">
                                <ProfileSidebar />
                            </aside>
                            {/* Main Content */}
                            <section className="col-span-12 lg:col-span-8">
                                <ChangePassword />
                            </section>
                        </div>
                    </div>
                </main>
            } />

            {/* Bookmarks route */}
            <Route path="/bookmarks" element={
                <main className="bg-gray-50">
                    <ProfileBanner
                        title="Bookmarked Projects"
                        subtitle="View and manage your saved projects."
                        breadcrumbs={[
                            { name: "Home", href: "/" },
                            { name: "My Profile", href: "/profile" },
                            { name: "Bookmarked Projects", href: "/profile/bookmarks" }
                        ]}
                    />
                    <div className="container mx-auto px-4 md:px-40 py-8">
                        <div className="grid grid-cols-12 gap-6">
                            {/* Sidebar */}
                            <aside className="col-span-12 lg:col-span-4">
                                <ProfileSidebar />
                            </aside>
                            {/* Main Content */}
                            <section className="col-span-12 lg:col-span-8">
                                <SavedJobs />
                            </section>
                        </div>
                    </div>
                </main>
            } />

            {/* Redirect for any other profile paths */}
            <Route path="*" element={<Navigate to="/profile" replace />} />
        </Routes>
    );
};

export default Profile;