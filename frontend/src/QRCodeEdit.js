import React, { useState, useEffect, useContext } from 'react';
import UserContext from "./auth/UserContext";
import QreatorApi from './API';
import { useParams, useHistory } from 'react-router-dom';
import WarningModal from './WarningModal';
import Alert from './alerts/Alert';
import QRCode from './QRCode';
import parseQueryString from './helpers/parseQueryString';
import './NewCodeForm.css';

function QrCodeEdit() {
  const { currUser } = useContext(UserContext);
  const { codeId } = useParams();
  
  const INITIAL_STATE = {
    text: "",
    margin: "",
    size: "",
    dark: "",
    light: "",
    centerImageUrl: "",
    centerImageSizeRatio: "",
    description: ""
  };

 
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [code, setCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    async function getQrCode() {
      try {
        let codeRes = await QreatorApi.getUserCode(currUser.id, codeId);
        let codeDescription = codeRes.description;
        let codeUrl = codeRes.url;
        const codeObject = parseQueryString(codeUrl);

        setFormData({
          text: codeObject.text || '',
          margin: codeObject.margin || '',
          size: codeObject.size || '',
          dark: codeObject.dark || '',
          light: codeObject.light || '',
          centerImageUrl: codeObject.centerImageUrl || '',
          centerImageSizeRatio: codeObject.centerImageSizeRatio || '',
          description: codeDescription || ''
        });

        setCode({
          url: codeUrl,
          description: codeDescription
        });

        setIsLoading(false);

      } catch (e) {
        console.error(e);
      }
    }
    getQrCode();
    return () => {
      setShowAlert(false);
    }
  }, []);


  if (isLoading) {
    return <p>Loading &hellip;</p>
  }

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
    await QreatorApi.updateUserCode(currUser.id, codeId, code);
    handleShowAlert();
    setShowSave(false);
    history.push('/codes');
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
        <label htmlFor="centerImageUrl">- Image/Logo (optional) -</label>
        <input 
          id='centerImageUrl'
          name='centerImageUrl'
          value={formData.centerImageUrl}
          onChange={handleChange}
        />
        <label htmlFor="centerImageSizeRatio">- Image Size -</label>
        <input 
          id='centerImageSizeRatio'
          name='centerImageSizeRatio'
          value={formData.centerImageSizeRatio}
          onChange={handleChange}
          onClick={openModal}
        />
        <label htmlFor="description">- Description -</label>
        <input 
          id='description'
          name='description'
          value={formData.description}
          onChange={handleChange}
          maxLength={50}
        />
        <button>Preview</button>
        </div>
      </form>
      {showSave &&(<button className='save-btn' onClick={handleSave}>Update Code</button>)}
      {showModal && <WarningModal closeModal={closeModal}/>}
    </div>
  )
}

export default QrCodeEdit;