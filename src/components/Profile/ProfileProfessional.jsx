import React from "react";
import { Typography } from "../../ui";

const ProfileProfessional = ({ profileData }) => (
  <>
    <Typography variant="h5" className="mb-2 font-semibold">Professional Details</Typography>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <Typography variant="p" className="text-gray-500">Professional Title</Typography>
        <Typography variant="p">{profileData.designation || "N/A"}</Typography>
      </div>
     <div>
        <Typography variant="p" className="text-gray-500">Resume/CV</Typography>
        <a href={profileData.resumeLink || "#"} target="_blank" rel="noopener noreferrer" className="text-primary underline">
          {profileData.resumeLink || "N/A"}
        </a>
      </div>
      <div>
        <Typography variant="p" className="text-gray-500">Educational Qualification</Typography>
        <Typography variant="p">{profileData.educationalQualification || "N/A"}</Typography>
      </div>
      <div>
        <Typography variant="p" className="text-gray-500">Educational Institute</Typography>
        <Typography variant="p">{profileData.educationalInstitute || "N/A"}</Typography>
      </div>
      
    </div>
  </>
);

export default ProfileProfessional;