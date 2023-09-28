import React, { useState } from 'react';
import './QRCode.css';

function QRCode({ url, width, height, description = null }) {
  const [hovered, setHovered] = useState(false);

  const handleDownloadClick = () => {
    // Fetch the image URL and convert it to a Blob
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        // Create an Object URL for the Blob
        const blobURL = URL.createObjectURL(blob);
  
        // Create an anchor element to trigger the download
        const link = document.createElement('a');
        link.href = blobURL;
        link.download = 'qrCode.png';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
  
        // Revoke the Object URL to release memory
        URL.revokeObjectURL(blobURL);
      })
      .catch((error) => {
        console.error('Error fetching or creating Blob:', error);
      });
  };

  return (
    <div
      className={`qrCode-container ${hovered ? 'hovered' : ''}`}
      style={{ width: `${width}px` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ width: `${width}px`, height: `${height}px` }}>
        <img
          src={url}
          style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '10px', marginTop: '1px' }}
          alt='qrCode'
        />
      </div>
      <p className='qrCode-description'>{description}</p>
      {hovered && (
        <div className='qrCode-actions'>
          <button onClick={handleDownloadClick}>Download</button>
        </div>
      )}
    </div>
  );
}

export default QRCode;
