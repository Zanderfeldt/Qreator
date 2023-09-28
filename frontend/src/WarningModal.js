import React from 'react';
import './WarningModal.css';

function WarningModal({ closeModal }) {
  return (
    <div className="modal" id="myModal" onClick={closeModal}>
        <p>Be careful with the image size! Too big and the code won't be readable.</p>
    </div>
  );
}

export default WarningModal;