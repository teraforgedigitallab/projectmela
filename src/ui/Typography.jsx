import React from 'react';
import PropTypes from 'prop-types';

/**
 * A component for rendering different text elements with customizable styling.
 * @param {object} props - The component props.
 * @param {string} [props.variant='p'] - The type of text element.
 * @param {React.Node} props.children - The content to render.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @param {string} [props.color] - Text color (CSS value or Tailwind class).
 * @param {string} [props.textAlign] - Text alignment ('left', 'right', 'center', 'justify').
 * @param {object} [props.style] - Inline styles.
 */
const Typography = ({
  variant = 'p',
  children,
  className = '',
  color,
  textAlign,
  style = {},
}) => {
  const styles = {
    h1: 'text-4xl lg:text-5xl font-bold text-heading-color mb-6',
    h2: 'text-3xl lg:text-4xl font-bold text-heading-color mb-5',
    h3: 'text-2xl lg:text-3xl font-bold text-heading-color mb-4',
    h4: 'text-xl lg:text-2xl font-bold text-heading-color mb-3',
    h5: 'text-lg lg:text-xl font-bold text-heading-color mb-2',
    h6: 'text-base lg:text-lg font-bold text-heading-color mb-2',
    p: 'text-base text-body-color leading-relaxed',
    span: 'text-base text-body-color',
    small: 'text-sm text-gray-700',
  };

  const Component = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'small'].includes(variant) ? variant : 'p';

  // Build Tailwind classes for color and text alignment if provided
  const colorClass = color && color.startsWith('text-') ? color : '';
  const alignClass = textAlign ? `text-${textAlign}` : '';

  return (
    <Component
      className={`${styles[variant] || styles.p} ${colorClass} ${alignClass} ${className}`}
      style={style}
    >
      {children}
    </Component>
  );
};

Typography.propTypes = {
  variant: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'small']),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  color: PropTypes.string,
  textAlign: PropTypes.oneOf(['left', 'right', 'center', 'justify']),
  style: PropTypes.object,
};

export default Typography;