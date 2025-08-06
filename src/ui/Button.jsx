import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  icon,
  className = '',
  variant = 'primary',
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium py-2 px-8 rounded-md cursor-pointer transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    outlined: 'bg-white text-gray-700 border border-gray-400 hover:bg-gray-100',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'outlined']),
};

export default Button;