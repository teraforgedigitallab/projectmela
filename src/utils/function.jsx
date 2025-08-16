import { toast } from "react-toastify";
import { maxLengthChecksForListjob } from "../data/data";

export const generateUniqueId = () => {
  return Math.random().toString(36).substring(2, 8);
};

export const copyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => toast.success("Project ID copied to clipboard!"))
    .catch(() => toast.error("Failed to copy Project ID"));
};

export const countDigits = (num) => {
  const numStr = num.toString();
  return numStr.length;
};

export const renderError = (userData, field, maxLengthChecks) => {
  if (userData[field] && userData[field].length > maxLengthChecks[field]) {
    return (
      <span className="text-danger">
        Input cannot be more than {maxLengthChecks[field]} characters.
      </span>
    );
  }
  return null;
};

export const getStatusClass = (status) => {
  switch (status) {
    case "Ongoing":
      return "text-success"; // green
    case "Pending":
      return "text-warning"; // yellow
    case "Finished":
    case "Accepted":
      return "text-success"; // green
    case "Rejected":
      return "text-danger"; // red
    case "Open":
      return "text-info"; // blue
    default:
      return "text-secondary"; // grey
  }
};

export const getTableHeaders = (tabType) => {
  switch (tabType) {
    case "Users":
      return (
        <tr>
          <th>Full Name</th>
          <th>Email</th>
          <th>Mobile Number</th>
          <th>Date of Birth</th>
          <th>Gender</th>
          <th>XP</th>
          <th>Skills</th>
          <th>Qualification</th>
          <th>Institute</th>
          <th>About</th>
          <th>Experience</th>
          <th>Project</th>
          <th>Location</th>
        </tr>
      );
    case "Applications":
      return (
        <tr>
          <th scope="col">Project</th>
          <th scope="col">Client</th>
          <th scope="col">Applicant Name</th>
          <th scope="col">Date</th>
          <th scope="col">Applicant Skills</th>
          <th scope="col">Applicant Points</th>
          <th scope="col">Communication</th>
          <th scope="col">Status</th>
        </tr>
      );

    case "Pending":
      return (
        <tr>
          <th scope="col">Project</th>
          <th scope="col">Client</th>
          <th scope="col">Moderators</th>
          <th scope="col">Applicants</th>
          <th scope="col">Date</th>
          <th scope="col">Budget</th>
          <th scope="col">Skills</th>
          <th scope="col">Notify User</th>
          <th scope="col">Points</th>
          <th scope="col">MinXP</th>
          <th scope="col">Communication</th>
          <th scope="col">Status</th>

          <th></th>
        </tr>
      );
    case "Ongoing":
      return (
        <tr>
          <th scope="col">Project</th>
          <th scope="col">Client</th>
          <th scope="col">Moderators</th>
          <th scope="col">Applicants</th>
          <th scope="col">Date</th>
          <th scope="col">Budget</th>
          <th scope="col">Skills</th>
          <th scope="col">Notify Users</th>
          <th scope="col">Points</th>
          <th scope="col">MinXP</th>
          <th scope="col">Communication</th>
          <th scope="col">Status</th>
          <th></th>
        </tr>
      );
    case "Project Requests":
      return (
        <tr>
          <th scope="col">Project</th>
          <th scope="col">Client</th>
          <th scope="col">Date</th>
          <th scope="col">Budget</th>
          <th scope="col">Skills</th>
          <th scope="col">Notify User</th>
          <th scope="col">Points</th>
          <th scope="col">MinXP</th>
          <th scope="col">Communication</th>
          <th scope="col">Status</th>
        </tr>
      );
    default:
      return null;
  }
};

export const getUsersTableHeaders = () => (
  <tr>
    <th scope="col">Full Name</th>
    <th scope="col">Email</th>
    <th scope="col">Mobile</th>
    <th scope="col">Date of Birth</th>
    <th scope="col">Gender</th>
    <th scope="col">XP</th>
    <th scope="col">Skills</th>
    <th scope="col">About</th>
    <th scope="col">Experience</th>
    <th scope="col">Projects</th>
  </tr>
);

export const getPriceRating = (budget) => {
  if (budget === 0) return 0;
  if (budget > 0 && budget <= 10000) return 1;
  if (budget > 10000 && budget <= 50000) return 2;
  if (budget > 50000 && budget <= 75000) return 3;
  return 4;
};

export const getChipColorFromStatus = (status) => {
  const displayStatus = getDisplayStatus(status);
  if (displayStatus === "Open") return "green";
  if (displayStatus === "Ongoing") return "orange";
  return "gray";
};

export const getDisplayStatus = (status) => {
  if (status === "Pending") return "Open";
  if (status === "Ongoing") return "Ongoing";
  return status;
};

export const handleShareToSocials = (platform, shareLink) => {
  navigator.clipboard.writeText(shareLink).then(() => {
    let url;
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          shareLink
        )}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareLink
        )}`;
        break;
      case "telegram":
        url = `https://telegram.me/share/url?url=${encodeURIComponent(
          shareLink
        )}`;
        break;
      case "instagram":
        url = `https://www.instagram.com/?url=${encodeURIComponent(shareLink)}`;
        break;
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          shareLink
        )}`;
        break;
      default:
        return;
    }
    window.open(url, "_blank");
  });
};

export const getCardsData = (
  applicationCount,
  projectRequestCount,
  pendingProjectCount,
  ongoingProjectCount
) => [
  {
    title: "Total Applications",
    value: applicationCount.toString(),
    icon: "bi-people",
    iconBg: "bg-tertiary",
    change: "13%",
    changeDirection: "up",
    changeText: "Since last month",
  },
  {
    title: "New Projects",
    value: projectRequestCount.toString(),
    icon: "bi-plus-square",
    iconBg: "bg-primary",
    change: "30%",
    changeDirection: "up",
    changeText: "Since last month",
  },
  {
    title: "Pending Projects",
    value: pendingProjectCount.toString(),
    icon: "bi-clock-history",
    iconBg: "bg-info",
    change: "-5%",
    changeDirection: "down",
    changeText: "Since last month",
  },
  {
    title: "Ongoing Projects",
    value: ongoingProjectCount.toString(),
    icon: "bi-play-circle",
    iconBg: "bg-warning",
    change: "10%",
    changeDirection: "up",
    changeText: "Since last month",
  },
];

// export const validateListJobInputs = (data, selectedTechStack) => {
//     const requiredFields = [
//         'name', 'email', 'mobile', 'projectTitle', 'projectType', 'description', 'requirements', 'responsibilities', 'selectedTechStack'
//     ];

//     for (let field of requiredFields) {
//         if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
//             toast.warning(`Please fill the ${field} field.`);
//             return false;
//         }
//     }

//     for (let field in maxLengthChecksForListjob) {
//         if (data[field] && data[field].length > maxLengthChecksForListjob[field]) {
//             toast.error(`${field} input cannot be more than ${maxLengthChecksForListjob[field]} characters.`);
//             return false;
//         }
//     }

//     const projectTitleRegex = /^[a-zA-Z0-9\s+]+$/;
//     if (!projectTitleRegex.test(data.projectTitle) || data.projectTitle.includes('   ')) {
//         toast.error('Project Title cannot have three consecutive spaces or special characters.');
//         return false;
//     }

//     if (data.budget.length > 20) {
//         toast.error('Budget cannot be more than 20 digits long.');
//         return false;
//     }

//     if (selectedTechStack.length === 0) {
//         toast.warning("Please select at least one skill required for the project.");
//         return false;
//     }

//     return true;
// };
