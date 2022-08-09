import React from 'react';

const Centered: React.FC<React.PropsWithChildren<{ height?: string }>> = ({
  children,
  height = '60vh',
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height,
      }}
    >
      <div>{children}</div>
    </div>
  );
};

export default Centered;
