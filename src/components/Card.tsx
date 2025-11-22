
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  titleAction?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, titleAction }) => {
  return (
    <div className={`bg-gray-800 rounded-lg shadow-md p-4 md:p-6 ${className}`}>
      {title && (
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-700">
          <h3 className="text-lg md:text-xl font-semibold text-white">{title}</h3>
          {titleAction}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
