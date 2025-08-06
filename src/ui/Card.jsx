import React from 'react';
import PropTypes from 'prop-types';

/**
 * A versatile card component for containing content sections.
 * It includes styling for background, padding, border, and shadow.
 * @param {object} props - The component props.
 * @param {React.Node} props.children - The content to be rendered inside the card.
 * @param {string} [props.className=''] - Additional Tailwind CSS classes to apply to the card.
 * @param {string} [props.padding='p-6 md:p-8'] - The padding utility class to apply.
 */
const Card = ({ children, className = '', padding = 'p-6 md:p-8' }) => {
  return (
    <div
      className={`bg-white rounded-sm border border-border shadow-sm ${padding} ${className}`}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  padding: PropTypes.string,
};

export default Card;