import React from "react";
import PropTypes from "prop-types";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

const getPages = (currentPage, totalPages) => {
  let pages = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Always show first page
  pages.push(1);

  // Show left ellipsis if needed
  if (currentPage > 3) {
    pages.push("...");
  }

  // Middle pages (avoid duplicates)
  for (let i = currentPage - 1; i <= currentPage + 1; i++) {
    if (i > 1 && i < totalPages) {
      pages.push(i);
    }
  }

  // Show right ellipsis if needed
  if (currentPage < totalPages - 2) {
    pages.push("...");
  }

  // Always show last page
  pages.push(totalPages);

  // Remove duplicates while preserving order
  pages = pages.filter((item, idx) => pages.indexOf(item) === idx);

  return pages;
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = getPages(currentPage, totalPages);

  return (
    <div className="flex items-center justify-center mt-8 self-start">
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center p-2 mx-1 rounded-sm cursor-pointer ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-100"
        }`}
        aria-label="Previous Page"
      >
        <HiChevronLeft className="w-5 h-5" />
      </button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span
            key={`ellipsis-${idx}`}
            className="w-8 h-8 mx-1 flex items-center justify-center text-gray-400"
          >
            ...
          </span>
        ) : (
          <button
            key={`page-${page}`}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 mx-1 flex items-center justify-center rounded-sm cursor-pointer ${
              currentPage === page
                ? "bg-primary text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center p-2 mx-1 rounded-sm cursor-pointer ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700 hover:bg-gray-100"
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
