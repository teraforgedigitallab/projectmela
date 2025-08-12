import React from "react";

const statusStyles = {
  Open: "border-green-500 text-green-600",
  Ongoing: "border-yellow-500 text-yellow-600",
  Pending: "border-orange-500 text-orange-600",
  Completed: "border-blue-500 text-blue-600",
  Intern: "border-purple-500 text-purple-600",
  "Part Time": "border-cyan-500 text-cyan-600",
  "Full Time": "border-indigo-500 text-indigo-600",
  default: "border-primary text-primary"
};

const StatusBadge = ({ status }) => {
  const style = statusStyles[status] || statusStyles.default;
  return (
    <span
      className={`inline-block px-4 py-1 rounded-full border bg-white font-semibold text-xs ${style}`}
      style={{ textAlign: "center" }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;