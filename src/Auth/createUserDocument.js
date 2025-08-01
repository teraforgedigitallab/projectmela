import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';

export const createUserDocument = async (user, additionalData = {}) => {
    if (!user) return;

    const userRef = doc(db, 'Users', user.email);

    // Check if the document already exists
    const docSnapshot = await getDoc(userRef);
    if (docSnapshot.exists()) {
        console.log("Document already exists. No new document created.");
        return; // Exit if the document already exists
    }

    const userData = {
        FirstName: additionalData.firstName || '',
        LastName: additionalData.lastName || '',
        Email: user.email,
        Mobile: 0,
        XP: 0,
        ResumeLink: '',
        Designation: '',
        GithubLink: '',
        LinkedinLink: '',
        InstagramLink: '',
        Skills: [],
        AboutMe: '',
        MyExperience: '',
        PastProjects: '',
        isCookiesAccepted: false,
        profilePic: "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
        isProfileCompleted: false,
    };

    try {
        await setDoc(userRef, userData);
    } catch (error) {
        console.error("Error creating user document:", error);
    }
};