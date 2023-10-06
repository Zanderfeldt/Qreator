import React, { useState, useContext } from 'react';
import UserContext from "./auth/UserContext";
import QreatorApi from './API';
import WarningModal from './WarningModal';
import Alert from './alerts/Alert';
import QRCode from './QRCode';
import './NewCodeForm.css';

function NewCodeForm() {
  const { currUser } = useContext(UserContext);
 
  const INITIAL_STATE = {
    text: "Hello World",
    margin: 4,
    size: 200,
    dark: "#000000",
    light: "#ffffff",
    centerImageUrl: "",
    centerImageSizeRatio: 0.3,
    description: "Your Description Here"
  };

  const exampleCode = {
    url: "https://quickchart.io/qr?text=Hello%20world&size=200",
    description: "Your Description Here"
  };

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [code, setCode] = useState(exampleCode);
  const [showModal, setShowModal] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = e => {
    const {name, value} = e.target;
    setFormData(fData => ({
      ...fData,
      [name]: value
    }));
  };

  const handleShowAlert = () => {
    setShowAlert(true);
    // Set a timer to hide the alert after 3 seconds (adjust the time as needed)
    setTimeout(() => {
      setShowAlert(false);
    }, 3000); // 3000 milliseconds (3 seconds)
  };

  const handleSubmit = async e => {
    e.preventDefault();
    let code = await QreatorApi.createCode(formData);
    setCode(code);
    setShowSave(true); 
  };

  const handleSave = async e => {
    e.preventDefault();
    await QreatorApi.saveUserCode(currUser.id, code);
    handleShowAlert();
    setShowSave(false);
  }

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  

  
  return (
    <div className='newCodeForm'>
    <h2>Build your own QR Code</h2>
    <div className='form-codeContainer'>
      {showAlert && <Alert message='QR Code Saved!'/>}
      <QRCode 
      url={code.url} 
      width={200} 
      height={200} 
      description={formData.description}/>
      {showModal && <WarningModal closeModal={closeModal}/>}
    </div>
    <form onSubmit={handleSubmit}>
      <div className='input-columns'>       
        <label htmlFor="text">- QR Data (Text or URL) -</label>
        <input 
          id='text'
          name='text'
          value={formData.text}
          onChange={handleChange}
        />
        <label htmlFor="margin">- Whitespace Margin -</label>
        <input 
          id='margin'
          name='margin'
          value={formData.margin}
          onChange={handleChange}
        />
        <label htmlFor="size">- Size (px) -</label>
        <input 
          id='size'
          name='size'
          value={formData.size}
          onChange={handleChange}
        />
      </div>
      <div className='input-columns'> 
        <label htmlFor="description">- Description -</label>
        <input 
          id='description'
          name='description'
          value={formData.description}
          onChange={handleChange}
          maxLength={50}
        />
        <label htmlFor="centerImageUrl">- Image/Logo (optional) -</label>
        <input 
          id='centerImageUrl'
          name='centerImageUrl'
          value={formData.centerImageUrl}
          onChange={handleChange}
        />
        <label htmlFor="centerImageSizeRatio">- Image Size (Ratio from 0 to 1) -</label>
        <input 
          id='centerImageSizeRatio'
          name='centerImageSizeRatio'
          value={formData.centerImageSizeRatio}
          onChange={handleChange}
          onClick={openModal}
        />
      </div>
      <div className='input-columns'> 
        <label htmlFor="dark">- Color (foreground) -</label>
        <input 
          id='dark'
          name='dark'
          type='color'
          value={formData.dark}
          onChange={handleChange}
        />
        <label htmlFor="light">- Color (background) -</label>
        <input 
          id='light'
          name='light'
          type='color'
          value={formData.light}
          onChange={handleChange}
        />
        <div className='preview-button-container'>
          <button className='preview-btn'>Preview</button>
        </div>
        <p className='preview-btn-msg'>Preview Your Changes Before Saving!</p>
      </div>
    </form>
    {showSave &&(<button className='save-btn' onClick={handleSave}>Save Code</button>)}
   
  </div>
  
  )
}

export default NewCodeForm;