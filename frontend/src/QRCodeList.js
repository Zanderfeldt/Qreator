import React, { useState, useEffect, useContext } from 'react';
import QreatorApi from './API';
import QRCode from './QRCode';
import UserContext from './auth/UserContext';
import Alert from './alerts/Alert';
import { Link } from "react-router-dom";
import './QRCodeList.css';

function QrCodeList() {
  const { currUser } = useContext(UserContext);
  const [qrCodes, setQrCodes] = useState([]);
  const [displayQrCodes, setDisplayQrCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  
  useEffect(() => {
    //initial call to retrieve user's QR Codes
    async function getQrCodes() {
      try {
        let codeRes = await QreatorApi.getUserCodes(currUser.id);
        //SORT BY 
        //make temp variable and set to state
        setQrCodes(codeRes);
        setDisplayQrCodes(codeRes);
        setIsLoading(false);
      } catch (e) {
        console.error(e);
      }
    }
    getQrCodes();
    return () => {
      setShowAlert(false);
    }
  }, [currUser]);
  
  if (isLoading) {
    return <p>Loading &hellip;</p>
  }

  //Delete a Code
  const deleteCode = async(codeId) => {
    let res = await QreatorApi.deleteUserCode(currUser.id, codeId);
    if (res) {
      const updatedQrCodes = qrCodes.filter(qrCode => qrCode.id !== codeId);
      setQrCodes(updatedQrCodes);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000); 
    }
  }
  
  //Sort Codes by Date Desc
  function sortByLastEditedDescending(arr) {
    const sortedArray = [...arr]; 
    sortedArray.sort((a, b) => {
      const dateA = new Date(a.lastEdited);
      const dateB = new Date(b.lastEdited);
      return dateB - dateA;
    });
    setDisplayQrCodes(sortedArray); 
  }

  //Sort Codes by Date Asc
  function sortByLastEditedAscending(arr) {
    const sortedArray = [...arr]; 
    sortedArray.sort((a, b) => {
      const dateA = new Date(a.lastEdited);
      const dateB = new Date(b.lastEdited);
      return dateA - dateB;
    });
    setDisplayQrCodes(sortedArray); 
  }

  // Sort Codes by Description in Ascending Order
  function sortByDescriptionAscending(arr) {
    const sortedArray = [...arr]; 
    sortedArray.sort((a, b) => {
      const descriptionA = a.description.toLowerCase(); 
      const descriptionB = b.description.toLowerCase();
      return descriptionA.localeCompare(descriptionB);
    });
    setDisplayQrCodes(sortedArray); 
  }


  return (
    <div className='code-list'>
      <div class="heading-container">
        <h2>Your QR Codes</h2>
        <div className="sort-buttons-container">
        <p>Sort by:</p>
        <button className='sort-btn' onClick={() => sortByLastEditedDescending(qrCodes)}>Date Desc</button>
        <button className='sort-btn' onClick={() => sortByLastEditedAscending(qrCodes)}>Date Asc</button>
        <button className='sort-btn' onClick={() => sortByDescriptionAscending(qrCodes)}>Description</button>
      </div>
    </div>
      {showAlert && <Alert message='QR Code Deleted!'/>}
      <div className='code-list-grid'>
        {displayQrCodes.map(q => (
          <div className='codeContainer' key={q.id}>
            <QRCode 
            url={q.url} 
            width={200} 
            height={200} 
            description={q.description}/> 
            <div className='code-buttons'>
              <small>Last Edited: {q.lastEdited}</small>
              <br></br>
              <Link to={`/edit/${q.id}`}>Edit</Link>
              <button className='qr-delete-btn' onClick={() => deleteCode(q.id)}>Delete</button>
            </div>  
          </div>                   
        ))}
      </div> 
    </div>
  )
}

export default QrCodeList;