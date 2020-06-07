import React from 'react'

const Centered: React.FC<{}> = ({ children }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
      }}
    >
      <div>{children}</div>
    </div>
  )
}

export default Centered
