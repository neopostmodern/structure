import * as React from 'react';

export default function Centered({ text, children }) {
  let content;
  if (text) {
    content = text;
  } else {
    content = children;
  }
  
  return <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh'}}>
    <div>{content}</div>
  </div>
}
