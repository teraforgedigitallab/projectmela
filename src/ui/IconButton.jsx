import React from 'react';
import PropTypes from 'prop-types';

/**
 * A circular button designed specifically for icons, like social media links.
 * It can function as a link or a standard button.
 * @param {object} props - The component props.
 * @param {React.Node} props.icon - The icon element to be displayed inside the button.
 * @param {string} [props.href] - If provided, the component will render as an anchor tag (<a>).
 * @param {Function} [props.onClick] - The click handler, used if href is not provided.
 * @param {string} [props.ariaLabel] - Accessibility label for screen readers.
 * @param {string} [props.className=''] - Additional Tailwind CSS classes.
 */

const IconButton = ({ icon, href, onClick, ariaLabel, className = '' }) => {
  const commonClasses = `
    h-10 w-10 flex items-center justify-center
    bg-gray-200 text-dark-2
    rounded-md
    hover:bg-primary hover:text-white
    transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
    ${className}
  `;

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={commonClasses}
      >
        {icon}
      </a>
    );
  }

  return (
    <button onClick={onClick} aria-label={ariaLabel} className={commonClasses}>
      {icon}
    </button>
  );
};

IconButton.propTypes = {
  icon: PropTypes.node.isRequired,
  href: PropTypes.string,
  onClick: PropTypes.func,
  ariaLabel: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default IconButton;
