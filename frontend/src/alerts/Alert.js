import React from 'react';
import './Alert.css';

function Alert({ message }) {
  return (
    <div className="green-fading-alert">
      <p>{message}</p>
    </div>
  );
}

export default Alert;