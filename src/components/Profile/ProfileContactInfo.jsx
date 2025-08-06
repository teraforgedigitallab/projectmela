import React from "react";
import { Typography } from "../../ui";

const ProfileContactInfo = ({ profileData }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
    <div>
      <Typography variant="p" className="text-gray-500">Location</Typography>
      <Typography variant="p">{profileData?.city ?? "Your City"}</Typography>
    </div>
    <div>
      <Typography variant="p" className="text-gray-500">E-mail</Typography>
      <Typography variant="p">{profileData.contact?.email ?? "youremail@abc.com"}</Typography>
    </div>
    <div>
      <Typography variant="p" className="text-gray-500">Phone</Typography>
      <Typography variant="p">{profileData.contact?.phone ?? "1234567890"}</Typography>
    </div>
    <div>
      <Typography variant="p" className="text-gray-500">Website Link</Typography>
      <Typography variant="p">
        {profileData?.websiteUrl
          ? <a href={profileData.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">{profileData.websiteUrl}</a>
          : "https://yourwebsite.com"}
      </Typography>
    </div>
  </div>
);

export default ProfileContactInfo;