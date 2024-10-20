import React from 'react';

export const buttonVariants = (variant) => {
  switch (variant) {
    case 'primary':
      return 'bg-blue-500 text-white hover:bg-blue-600';
    case 'outline':
      return 'border border-blue-500 text-blue-500 hover:bg-blue-100';
    case 'danger':
      return 'bg-red-500 text-white hover:bg-red-600';
    default:
      return 'bg-gray-200 text-black';
  }
};

function Button({ children, onClick, disabled, className = '' }) {
  return (
    <button
      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
