import { GoogleGenerativeAI } from "@google/generative-ai";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { skillOptions } from '../data/data';
import { maleAvatars, femaleAvatars } from "../data/data";

// Initialize Gemini API
const initializeGeminiAI = () => {
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    return new GoogleGenerativeAI(geminiApiKey);
};


export const processResumeWithAI = async (text, geminiApiKey, originalEmail) => {
    try {
        const genAI = new GoogleGenerativeAI(geminiApiKey);

        // Generate AI prompt
        const prompt = `Extract the following information from this resume text and format as a valid JSON object with the exact following structure:
        {
            "FirstName": "", (Cannot be empty)
            "LastName": "",
            "Email": "",
            "Mobile": "",
            "profilePic": "",
            "Gender": "",
            "DateOfBirth": "",
            "City": "",
            "State": "",
            "Country": "",
            "Designation": "",(Cannot be empty, make suitable title based on the resume)
            "XP": "",
            "ResumeLink": "",
            "GithubLink": "",
            "LinkedinLink": "",
            "InstagramLink": "",
            "Skills": [], (Extract technical skills and match them with the following options, maximum 20 skills. If a skill is not in the options, match it to the nearest skill mentioned in the options: ${JSON.stringify(skillOptions)})
            "AboutMe": "", (Cannot be empty, craft suitable description of the candidate based on the resume)
            "MyExperience": "", (Cannot be empty, craft suitable experience based on the resume)
            "PastProjects": "", (Cannot be empty, craft suitable past projects based on the resume)
            "websiteUrl": "",
            "educationalQualification": "",(Cannot be empty, like what degree/ course is the candidate pursuing in college or school)
            "educationalInstitute": "" (Cannot be empty, like name of the college or school)
        }
        - Fill in the values based on the resume text. For gender, guess based on the first name if not explicitly mentioned. Ensure the MyExperience and PastProjects sections cover all relevant information.
        - All fields must be filled with the most accurate information from the resume. If a field is missing, use an empty string or empty array.
        - DO NOT REPLACE THE ACTUAL EMAIL ID THAT WAS THERE.
        - For ResumeLink, GithubLink, LinkedinLink, InstagramLink, websiteUrl, use any relevant URLs found.
        
        Respond only with the JSON object, no extra text.

        Resume Text:
        ${text}
        `;

        // Call Gemini API
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();

        // Clean the response text to ensure valid JSON
        const cleanedResponse = responseText
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

        const parsedData = JSON.parse(cleanedResponse);

        const validatedSkills = parsedData.Skills
            ?.filter(skill => skillOptions.includes(skill))
            ?.slice(0, 20) || [];

        return {
            userData: {
                firstName: parsedData.FirstName || "",
                lastName: parsedData.LastName || "",
                email: originalEmail || "",
                phone: parsedData.Mobile || "",
                avatar: parsedData.profilePic || "",
                designation: parsedData.Designation || "",
                perHour: /^\d+$/.test(parsedData.XP) ? parsedData.XP : "",
                resumeLink: parsedData.ResumeLink || "",
                githubLink: parsedData.GithubProfile || parsedData.GithubLink || "",
                linkedinLink: parsedData.LinkedInProfile || parsedData.LinkedinLink || "",
                instagramLink: parsedData.InstagramProfile || parsedData.InstagramLink || "",
                skills: validatedSkills,
                about: parsedData.AboutMe || "",
                myExperience: parsedData.MyExperience || parsedData.Experience || "",
                pastProjects: parsedData.PastProjects || "",
                websiteUrl: parsedData.WebsiteUrl || "",
                dateOfBirth: parsedData.DateOfBirth || "",
                gender: parsedData.Gender || "",
                city: parsedData.City || "",
                state: parsedData.State || "",
                country: parsedData.Country || "",
                educationalQualification: parsedData.EducationalQualification || parsedData.educationalQualification || parsedData.education || "",
                educationalInstitute: parsedData.EducationalInstitute || parsedData.educationalInstitute || parsedData.institute || "",
                avatar: parsedData.Gender === 'Male' ? maleAvatars[0] : parsedData.Gender === 'Female' ? femaleAvatars[0] : "",
            },
            skills: validatedSkills
        };
    } catch (error) {
        console.error("AI Processing Error:", error);
        throw error;
    }
};

export const processAISearch = async (
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
) => {
    try {
        setIsAISearching(true);
        setIsAIFilterApplied(true);

        const genAI = initializeGeminiAI();
        const prompt = `
            Extract the following fields from this search query. Return only a JSON object with these fields:
            - gender (string): "Male", "Female", or null if not specified
            - locations (array of strings): array of all locations mentioned including cities, states, countries with the variations of the same name or how it can be written for example US, USA, United States, United States of America, etc (keep the text in English only) or null if not specified ( Also Please don't infer the State Name or Country Name from the input location if they are not explicitly mentioned)
            - institutes (array of strings): array of all the educational institutes mentioned as well as the variations of the same name for example IITB, IIT Bombay, Indian Institute of Technology Bombay, IIT Mumbai etc. (keep the text in English only) or null if not specified
            - skills (array): array of skills mentioned should be saved as one of the options in this array ${skillOptions} or empty array if none specified
            - minXP (number): minimum experience points (XP) or null if not specified
            - maxXP (number): maximum experience points (XP)or null if not specified
            
            Query: ${aiSearchQuery}
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = result.response;
        const cleanedResponse = response.text().replace(/```json|```/g, '').trim();
        const filters = JSON.parse(cleanedResponse);

        // Apply filters
        if (filters.gender) setSelectedGender(filters.gender);
        if (filters.skills?.length > 0) setSelectedSkills(filters.skills);
        if (filters.minXP !== null) setMinXPFilter(filters.minXP.toString());
        if (filters.maxXP !== null) setMaxXPFilter(filters.maxXP.toString());

        // Process locations
        const locations = filters.locations.map(location => {
            switch (location.toLowerCase()) {
                case 'bangalore': return ['bangalore', 'bengaluru'];
                case 'us': return ['united states', 'us', 'usa'];
                case 'england': return ['england', 'the great britain', 'great britain', 'gb'];
                default: return [location];
            }
        }).flat();

        if (locations.length > 0) setLocationFilter(locations);
        if (filters.institutes?.length > 0) setEducationFilter(filters.institutes.flat());

        handleTabChange('Users');
        setShowModal(false);
    } catch (error) {
        console.error('AI Search Error:', error);
        throw error;
    } finally {
        setIsAISearching(false);
    }
};

export const getSuggestedCandidates = async (projectId) => {
    if (!projectId) return [];

    const projectDoc = await getDoc(doc(db, "Projects", projectId));
    if (!projectDoc.exists()) {
        throw new Error('Project not found');
    }

    const projectData = projectDoc.data();
    const requiredSkills = projectData.techStack || [];

    const usersSnapshot = await getDocs(collection(db, "Users"));
    const allUsers = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    const usersWithScores = allUsers.map(user => {
        const userSkills = user.Skills || [];
        const matchCount = requiredSkills.filter(skill =>
            userSkills.some(userSkill =>
                userSkill.toLowerCase() === skill.toLowerCase()
            )
        ).length;

        return {
            ...user,
            matchScore: matchCount // Only keeping the raw match count
        };
    });

    return usersWithScores
        .filter(user => user.matchScore > 0)
        .sort((a, b) => {
            // Primary sort by match score (number of matching skills)
            if (b.matchScore !== a.matchScore) {
                return b.matchScore - a.matchScore;
            }
            // Secondary sort by XP if match scores are equal
            return (b.XP || 0) - (a.XP || 0);
        })
        .slice(0, 7);
};