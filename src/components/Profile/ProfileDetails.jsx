import React from "react";
import { Typography } from "../../ui";

const ProfileDetails = ({ profileData }) => (
  <>
    <Typography variant="h5" className="mb-2 font-semibold">Personal Details</Typography>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <Typography variant="p" className="text-gray-500">Date of Birth</Typography>
        <Typography variant="p">{profileData.dateOfBirth || "N/A"}</Typography>
      </div>
      <div>
        <Typography variant="p" className="text-gray-500">Gender</Typography>
        <Typography variant="p">{profileData.gender || "N/A"}</Typography>
      </div>
      <div>
        <Typography variant="p" className="text-gray-500">City</Typography>
        <Typography variant="p">{profileData.city || "N/A"}</Typography>
      </div>
      <div>
        <Typography variant="p" className="text-gray-500">State</Typography>
        <Typography variant="p">{profileData.state || "N/A"}</Typography>
      </div>
      <div>
        <Typography variant="p" className="text-gray-500">Country</Typography>
        <Typography variant="p">{profileData.country || "N/A"}</Typography>
      </div>
    </div>
  </>
);

export default ProfileDetails;