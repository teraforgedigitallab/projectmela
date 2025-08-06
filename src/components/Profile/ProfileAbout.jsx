import React from "react";
import { Typography } from "../../ui";

const ProfileAbout = ({ profileData }) => (
  <>
    <Typography variant="h5" className="mb-2 font-semibold">More About Me</Typography>
    <div className="mb-4">
      <Typography variant="p" className="text-gray-500">About</Typography>
      <Typography variant="p">{profileData.about || "N/A"}</Typography>
    </div>
    <div className="mb-4">
      <Typography variant="p" className="text-gray-500">My Experience</Typography>
      <Typography variant="p">{profileData.myExperience || "N/A"}</Typography>
    </div>
    <div className="mb-4">
      <Typography variant="p" className="text-gray-500">Past Projects</Typography>
      <Typography variant="p">{profileData.pastProjects || "N/A"}</Typography>
    </div>
  </>
);

export default ProfileAbout;