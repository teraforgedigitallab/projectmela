import React from 'react';
import PropTypes from 'prop-types';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [];

    // Create array of page numbers
    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        if (currentPage <= 3) {
            for (let i = 1; i <= 5; i++) {
                pages.push(i);
            }
        } else if (currentPage >= totalPages - 2) {
            for (let i = totalPages - 4; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            for (let i = currentPage - 2; i <= currentPage + 2; i++) {
                pages.push(i);
            }
        }
    }

    return (
        <div className="flex items-center justify-center mt-8 self-start">
            <button
                onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center justify-center p-2 mx-1 rounded-md cursor-pointer ${currentPage === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                aria-label="Previous Page"
            >
                <HiChevronLeft className="w-5 h-5" />
            </button>

            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-8 h-8 mx-1 flex items-center justify-center rounded-md cursor-pointer ${currentPage === page
                            ? 'bg-primary text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center p-2 mx-1 rounded-md cursor-pointer ${currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                aria-label="Next Page"
            >
                <HiChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default Pagination;