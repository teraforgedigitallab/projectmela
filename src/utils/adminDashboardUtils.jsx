import React from 'react';
import { doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { copyToClipboard } from './function';
import { formatShortDateIndiaStyle } from './dateFormatting';
import { toast } from 'react-toastify';
import { FaCopy } from 'react-icons/fa';

export const handleProjectLinkClick = (project, setModalHeading, setModalMessage, setShowScrollableModal) => {
    setModalHeading(`${project.projectTitle}`);
    setModalMessage(
        <div>
            <h2>Project Owner Details <br /> <br /></h2>
            <p>
                <b>Name:</b> {project.name}
                <br />
                <b>Email:</b> {project.email}
                <br />
                <b>Mobile Number:</b> {project.mobile}
                <br />
                <br />
            </p>
            <h2>Project Details <br /> <br /></h2>
            <p>
                <b>Project ID:</b> {project.id}
                <span
                    onClick={() => copyToClipboard(project.id)}
                    style={{
                        cursor: 'pointer',
                        marginLeft: '8px',
                        display: 'inline-flex',
                        alignItems: 'center'
                    }}
                >
                    <FaCopy />
                </span>
                <br />
                <br />
                <b>Project Type:</b> {project.projectType}
                <br />
                <br />
                <b>Project Description:</b> {project.description}
                <br />
                <br />
                <b>Project Requirements:</b> {project.requirements}
                <br />
                <br />
                <b>Key Responsibilities:</b> {project.responsibilities}
                <br />
                <br />
                <b>Other Project Document Link:</b> <a href={project.fileUrl}>{project.fileUrl}</a>
            </p>
        </div>
    );
    setShowScrollableModal(true);
};

export const handleClientLinkClick = (project, setModalHeading, setModalMessage, setShowScrollableModal) => {
    setModalHeading(`${project.name}`);
    setModalMessage(
        <div>
            <h2>Client Details <br /> <br /></h2>
            <p>
                <b>Name:</b> {project.name}
                <br />
                <b>Email:</b> {project.email}
                <br />
                <b>Mobile Number:</b> {project.mobile}
                <br />
                <br />
            </p>
        </div>
    );
    setShowScrollableModal(true);
};


export const handleApplicationProjectClick = async (appId, setModalHeading, setModalMessage, setShowScrollableModal) => {
    try {
        // First, fetch the application document
        const appDoc = await getDoc(doc(db, "Applications", appId));
        if (!appDoc.exists()) {
            throw new Error("Application not found");
        }
        const appData = appDoc.data();

        // Now, fetch the project document using the projectID from the application
        const projectDoc = await getDoc(doc(db, "Projects", appData.projectID));
        if (!projectDoc.exists()) {
            throw new Error("Project not found");
        }
        const project = projectDoc.data();

        setModalHeading(`${project.projectTitle}`);
        setModalMessage(
            <div>
                <h2>Project Owner Details <br /> <br /></h2>
                <p>
                    <b>Name:</b> {project.name}
                    <br />
                    <b>Email:</b> {project.email}
                    <br />
                    <b>Mobile Number:</b> {project.mobile}
                    <br />
                    <br />
                </p>
                <h2>Project Details <br /> <br /></h2>
                <p>
                    <b>Project ID:</b> {appData.projectID}
                    <span
                        onClick={() => copyToClipboard(appData.projectID)}
                        style={{
                            cursor: 'pointer',
                            marginLeft: '8px',
                            display: 'inline-flex',
                            alignItems: 'center'
                        }}
                    >
                        <FaCopy />
                    </span>
                    <br />
                    <br />
                    <b>Project Type:</b> {project.projectType}
                    <br />
                    <br />
                    <b>Project Description:</b> {project.description}
                    <br />
                    <br />
                    <b>Project Requirements:</b> {project.requirements}
                    <br />
                    <br />
                    <b>Key Responsibilities:</b> {project.responsibilities}
                    <br />
                    <br />
                    <b>Other Project Document Link:</b> <a href={project.fileUrl}>{project.fileUrl}</a>
                </p>
            </div>
        );
        setShowScrollableModal(true);
    } catch (error) {
        console.error("Error fetching project details:", error);
        setModalHeading("Error");
        setModalMessage(`An error occurred: ${error.message}`);
        setShowScrollableModal(true);
    }
};

export const handleApplicationClientClick = async (appId, setModalHeading, setModalMessage, setShowScrollableModal) => {
    try {
        // First, fetch the application document
        const appDoc = await getDoc(doc(db, "Applications", appId));
        if (!appDoc.exists()) {
            throw new Error("Application not found");
        }
        const appData = appDoc.data();

        // Now, fetch the project document using the projectID from the application
        const projectDoc = await getDoc(doc(db, "Projects", appData.projectID));
        if (!projectDoc.exists()) {
            throw new Error("Project not found");
        }
        const project = projectDoc.data();

        setModalHeading(`${project.name}`);
        setModalMessage(
            <div>
                <h2>Client Details <br /> <br /></h2>
                <p>
                    <b>Name:</b> {project.name}
                    <br />
                    <b>Email:</b> {project.email}
                    <br />
                    <b>Mobile Number:</b> {project.mobile}
                    <br />
                    <br />
                </p>
            </div>
        );
        setShowScrollableModal(true);
    } catch (error) {
        console.error("Error fetching client details:", error);
        setModalHeading("Error");
        setModalMessage(`An error occurred: ${error.message}`);
        setShowScrollableModal(true);
    }
};

//HERE

export const fetchUserDatafromApplicationID = async (appId) => {
    try {
        // Fetch the application document
        const appDoc = await getDoc(doc(db, "Applications", appId));
        if (!appDoc.exists()) {
            throw new Error("Application not found");
        }
        const appData = appDoc.data();

        // Fetch the user document using the ApplicantEmail as the document ID
        const userDoc = await getDoc(doc(db, "Users", appData.ApplicantEmail));
        if (!userDoc.exists()) {
            throw new Error("Applicant not found");
        }
        // Return the applicant data
        return userDoc.data();
    } catch (error) {
        throw new Error(`Error fetching applicant data: ${error.message}`);
    }
};


export const fetchUserData = async (Id) => {
    try {
        const userDoc = await getDoc(doc(db, "Users", Id));
        if (!userDoc.exists()) {
            throw new Error("Applicant not found");
        }
        // Return the applicant data
        return userDoc.data();
    } catch (error) {
        throw new Error(`Error fetching applicant data: ${error.message}`);
    }
};

// New function to derive the data directly from the AppID where AppID is directly the doc ID



export const handleApplicantProfileClick = async (appId, setModalHeading, setModalMessage, setShowScrollableModal, isApplicationTab) => {
    try {

        const applicant = isApplicationTab
            ? await fetchUserDatafromApplicationID(appId)
            : await fetchUserData(appId);

        // Prepare skill tags
        const skillTags = applicant.Skills ? applicant.Skills.map((skill, index) => (
            <span
                key={index}
                className="cfhya cy6kr ch6sm ceip1 cdxuw ce33e c7d26 c9eyc c4vrg ca6yp cww2f comjk cmwpt cv6oq"
                style={{ display: 'inline-flex', alignItems: 'center', margin: '2px' }}
            >
                {skill}
            </span>
        )) : <span>No skills provided</span>;

        // Set modal content
        setModalHeading(`${applicant.fullName}`);
        setModalMessage(
            <div>
                <h2>Applicant Details <br /> <br /></h2>
                <p>
                    <b>Full Name:</b> {applicant.fullName}
                    <br />
                    <b>Email:</b> {applicant.Email}
                    <br />
                    <b>Mobile:</b> {applicant.Mobile}
                    <br />
                    <b>Gender:</b> {applicant.Gender}
                    <br />
                    <b>Date of Birth:</b> {formatShortDateIndiaStyle(applicant.DateOfBirth)}
                    <br />
                    <br />
                </p>
                <h2>Applicant Links <br /> <br /></h2>
                <p>
                    <b>Github:</b> <a href={applicant.GithubLink} target="_blank" rel="noopener noreferrer">{applicant.GithubLink}</a>
                    <br />
                    <b>Instagram:</b> <a href={applicant.InstagramLink} target="_blank" rel="noopener noreferrer">{applicant.InstagramLink}</a>
                    <br />
                    <b>LinkedIn:</b> <a href={applicant.LinkedinLink} target="_blank" rel="noopener noreferrer">{applicant.LinkedinLink}</a>
                    <br />
                    <br />
                </p>
                <h2>Applicant Description <br /> <br /></h2>
                <p>
                    <b>Skills: </b> <div style={{ display: 'flex', flexWrap: 'wrap' }}>{skillTags}</div>
                    <br />
                    <b>About Me:</b> {applicant.AboutMe}
                    <br />
                    <br />
                    <b>My Experience:</b> {applicant.MyExperience}
                    <br />
                    <br />
                    <b>Past Projects:</b> {applicant.PastProjects}
                </p>
            </div >
        );
        setShowScrollableModal(true);
    } catch (error) {
        console.error("Error fetching applicant details:", error);
        setModalHeading("Error");
        setModalMessage(`An error occurred: ${error.message}`);
        setShowScrollableModal(true);
    }
};

export const handleApplicationApproval = async (applicationId, e) => {
    e.preventDefault();

    try {
        // Get the application document
        const applicationRef = doc(db, "Applications", applicationId);
        const applicationDoc = await getDoc(applicationRef);

        if (!applicationDoc.exists()) {
            throw new Error("Application not found");
        }

        const applicationData = applicationDoc.data();
        const { projectID, ApplicantEmail } = applicationData;

        // Update the application document
        await updateDoc(applicationRef, {
            isApproved: true
        });

        // Get and update the project document
        const projectRef = doc(db, "Projects", projectID);
        await updateDoc(projectRef, {
            selectedApplicants: arrayUnion(ApplicantEmail)
        });

        toast.success("Application approved successfully!");
        return true;
    } catch (error) {
        console.error("Error approving application:", error);
        toast.error("Error approving application: " + error.message);
        throw error;
    }
};

// export const handleApplicationDeletion = async (applicationId, e) => {
//     e.preventDefault();
//     try {
//         // Get reference to the application document
//         const applicationRef = doc(db, "Applications", applicationId);

//         // Update the isDeleted field to true
//         await updateDoc(applicationRef, {
//             isDeleted: true
//         });

//         return true;
//     } catch (error) {
//         console.error("Error deleting application:", error);
//         throw error;
//     }
// };



export const updateProjectStatus = async (projectId, newStatus) => {
    try {
        const projectRef = doc(db, "Projects", projectId);
        await updateDoc(projectRef, {
            status: newStatus
        });
        console.log(`Project status updated to ${newStatus}`);
    } catch (error) {
        console.error("Error updating project status:", error);
    }
};