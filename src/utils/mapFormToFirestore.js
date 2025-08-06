/**
 * Converts form data to Firestore document format
 */
export function mapFormToFirestore(formData) {
  return {
    FirstName: formData.firstName || '',
    LastName: formData.lastName || '',
    Email: formData.email || '',
    Mobile: formData.phone || 0,
    profilePic: formData.avatar || '',
    Designation: formData.designation || '',
    XP: formData.perHour || 0,
    ResumeLink: formData.resumeLink || '',
    GithubLink: formData.githubLink || '',
    LinkedinLink: formData.linkedinLink || '',
    InstagramLink: formData.instagramLink || '',
    Skills: formData.skills || [],
    AboutMe: formData.about || '',
    MyExperience: formData.myExperience || '',
    PastProjects: formData.pastProjects || '',
    
    // Keep additional fields that aren't in the original schema
    websiteUrl: formData.websiteUrl || '',
    dateOfBirth: formData.dateOfBirth || '',
    gender: formData.gender || '',
    city: formData.city || '',
    state: formData.state || '',
    country: formData.country || '',
    educationalQualification: formData.educationalQualification || '',
    educationalInstitute: formData.educationalInstitute || '',
    
    // These fields should only be set during account creation, not updates
    // isCookiesAccepted: formData.isCookiesAccepted || false,
    // isProfileCompleted: true,
  };
}

/**
 * Converts Firestore document to form data format
 */
export function mapFirestoreToForm(firestoreData) {
  return {
    firstName: firestoreData.FirstName || '',
    lastName: firestoreData.LastName || '',
    email: firestoreData.Email || '',
    phone: firestoreData.Mobile || '',
    avatar: firestoreData.profilePic || '',
    designation: firestoreData.Designation || '',
    perHour: firestoreData.XP || '',
    resumeLink: firestoreData.ResumeLink || '',
    githubLink: firestoreData.GithubLink || '',
    linkedinLink: firestoreData.LinkedinLink || '',
    instagramLink: firestoreData.InstagramLink || '',
    skills: firestoreData.Skills || [],
    about: firestoreData.AboutMe || '',
    myExperience: firestoreData.MyExperience || '',
    pastProjects: firestoreData.PastProjects || '',
    
    // Additional fields
    websiteUrl: firestoreData.websiteUrl || '',
    dateOfBirth: firestoreData.dateOfBirth || '',
    gender: firestoreData.gender || '',
    city: firestoreData.city || '',
    state: firestoreData.state || '',
    country: firestoreData.country || '',
    educationalQualification: firestoreData.educationalQualification || '',
    educationalInstitute: firestoreData.educationalInstitute || '',

    // Construct contact object for compatibility
    contact: {
      email: firestoreData.Email || '',
      phone: firestoreData.Mobile || '',
    },
  };
}