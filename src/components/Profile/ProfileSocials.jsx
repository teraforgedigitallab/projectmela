import React from "react";
import { Typography } from "../../ui";

const ProfileSocials = ({ profileData }) => (
  <>
    <Typography variant="h5" className="mb-2 font-semibold">Social Profiles</Typography>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div>
        <Typography variant="p" className="text-gray-500">GitHub</Typography>
        <a href={profileData.githubLink || "#"} target="_blank" rel="noopener noreferrer" className="text-primary underline">
          {profileData.githubLink || "N/A"}
        </a>
      </div>
      <div>
        <Typography variant="p" className="text-gray-500">LinkedIn</Typography>
        <a href={profileData.linkedinLink || "#"} target="_blank" rel="noopener noreferrer" className="text-primary underline">
          {profileData.linkedinLink || "N/A"}
        </a>
      </div>
      <div>
        <Typography variant="p" className="text-gray-500">Instagram</Typography>
        <a href={profileData.instagramLink || "#"} target="_blank" rel="noopener noreferrer" className="text-primary underline">
          {profileData.instagramLink || "N/A"}
        </a>
      </div>
    </div>
  </>
);

export default ProfileSocials;