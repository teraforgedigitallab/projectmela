import React from "react";
import { Typography } from "../../ui";

const ProfileHeader = ({ profileData, socials }) => (
  <div>
    <div className="flex flex-col md:flex-row md:items-center mb-6 gap-4">
      <img
        src={profileData.avatar || "/default-avatar.png"}
        alt={profileData.firstName}
        className="w-24 h-24 rounded-full object-cover mx-auto md:mx-0"
      />
      <div className="flex-1 text-center md:text-left">
        <Typography variant="h4" className="font-semibold mb-1">
          {profileData.firstName}{" "}{profileData.lastName}
        </Typography>
        <Typography variant="p" className="text-gray-500 mb-2">
          {profileData.designation || "Web Developer"}
        </Typography>
        <div className="flex justify-center md:justify-start gap-2 mt-2">
          {socials.map((social, idx) => (
            <a
              key={idx}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-100 p-2 rounded-sm text-gray-800 hover:bg-primary hover:text-white transition-colors"
              aria-label={social.name}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ProfileHeader;