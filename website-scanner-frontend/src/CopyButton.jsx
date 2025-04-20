import React, { useState } from 'react';

function CopyButton({ textToCopy }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      <button onClick={handleCopy} style={{ marginLeft: '8px' }}>
        📋 Copy Fix
      </button>
      {copied && (
        <div style={{
          position: 'absolute',
          top: '-25px',
          right: 0,
          backgroundColor: 'lightgreen',
          color: 'black',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '0.8rem'
        }}>
          Copied ✅
        </div>
      )}
    </div>
  );
}

export default CopyButton;
