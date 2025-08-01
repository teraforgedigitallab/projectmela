import React, { useState } from 'react';
import { formatShortDateIndiaStyle } from '../../utils/dateFormatting';
import { ScrollableModal } from '../../ui';

const TableRowUser = ({ user }) => {
    const MAX_SKILLS_PER_ROW = 4;
    const [modalContent, setModalContent] = useState({ show: false, heading: '', body: '' });

    const handleOpenModal = (heading, body) => {
        setModalContent({ show: true, heading, body });
    };

    const handleCloseModal = () => {
        setModalContent({ ...modalContent, show: false });
    };

    return (
        <>
            <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{user.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                        className="text-primary hover:text-primary-dark cursor-pointer"
                        onClick={() => navigator.clipboard.writeText(user.Email)}
                    >
                        {user.Email}
                    </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <a 
                        href={`https://api.whatsapp.com/send?phone=${user.Mobile?.toString().replace(/-/g, '').replace(/\+/g, '')}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-dark cursor-pointer"
                    >
                        {user.Mobile}
                    </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    {user.DateOfBirth ? formatShortDateIndiaStyle(user.DateOfBirth) : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.Gender}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.XP}</td>
                <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                        {user.Skills?.map((tag, index) => (
                            <React.Fragment key={index}>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {tag}
                                </span>
                                {index % MAX_SKILLS_PER_ROW === MAX_SKILLS_PER_ROW - 1 && <br />}
                            </React.Fragment>
                        ))}
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user.EducationalQualification}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.EducationalInstitute}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                        className="text-primary hover:text-primary-dark font-medium cursor-pointer"
                        onClick={() => handleOpenModal('About User', user.AboutMe)}
                    >
                        About
                    </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                        className="text-primary hover:text-primary-dark font-medium cursor-pointer"
                        onClick={() => handleOpenModal('User Experience', user.MyExperience)}
                    >
                        Experience
                    </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                        className="text-primary hover:text-primary-dark font-medium cursor-pointer"
                        onClick={() => handleOpenModal('Past Projects', user.PastProjects)}
                    >
                        Projects
                    </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    {user.city && user.state && user.country 
                        ? `${user.city}, ${user.state}, ${user.country}`
                        : 'N/A'
                    }
                </td>
            </tr>

            <ScrollableModal
                show={modalContent.show}
                heading={modalContent.heading}
                body={modalContent.body || 'No information available'}
                onClose={handleCloseModal}
                showButtons={false}
            />
        </>
    );
};

export default TableRowUser;