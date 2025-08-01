import React from "react";
import { Typography, Badge } from "../../ui";

const ProfileSkills = ({ skills }) => (
  <>
    <Typography variant="h5" className="mb-2 font-semibold">Skills</Typography>
    <div className="flex flex-wrap gap-2 mb-2">
      {(skills ?? []).map(skill => (
        <Badge key={skill} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md">{skill}</Badge>
      ))}
    </div>
  </>
);

export default ProfileSkills;