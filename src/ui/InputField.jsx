import React from 'react';
import PropTypes from 'prop-types';

const InputField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  className = '',
  disabled = false,
  ...props
}) => (
  <div className={`mb-4 ${className}`}>
    {label && (
      <label htmlFor={name} className="block text-sm font-medium text-black mb-1">
        {label}
      </label>
    )}
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary transition ${disabled ? 'bg-gray-200 cursor-not-allowed' : ''}`}
      {...props}
    />
  </div>
);

InputField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default InputField;