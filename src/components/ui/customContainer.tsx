// CustomContainer.tsx

import React, { ReactNode } from 'react';

// Define Props Interface
interface CustomContainerProps {
  // You can define any props you need here
  style?: React.CSSProperties;
  // Children should be of type ReactNode
  children: ReactNode;
  className?: string;
  id?: string;
}

// Create the Component
const CustomContainer: React.FC<CustomContainerProps> = ({ style, className, children, id }) => {
  return (
    <div id={id} className={`w-full h-screen m-0 ${className}`} style={style}>
      {children}
    </div>
  );
};

export default CustomContainer;
