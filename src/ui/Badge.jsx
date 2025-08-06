import React from 'react';
import PropTypes from 'prop-types';

/**
 * A simple badge component for displaying skills, tags, or short pieces of information.
 * @param {object} props - The component props.
 * @param {React.Node} props.children - The text content of the badge.
 * @param {string} [props.className=''] - Additional Tailwind CSS classes for custom styling.
 */
const Badge = ({ children, className = '' }) => {
  return (
    <span
      className={`
        inline-block 
        bg-gray-200 text-body-color 
        text-sm font-medium 
        py-1.5 px-4 rounded
        ${className}
      `}
    >
      {children}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Badge;
