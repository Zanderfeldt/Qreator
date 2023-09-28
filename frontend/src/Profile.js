import React, { useContext, useState } from 'react';
import './Profile.css';
import QreatorApi from './API';
import UserContext from './auth/UserContext';


function Profile() {
  const { currUser, setCurrUser } = useContext(UserContext);
  const INITIAL_STATE = {
    username: currUser.username,
    firstName: currUser.firstName,
    lastName: currUser.lastName,
    email: currUser.email,
    password: '',
  }

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [showAlert, setShowAlert] = useState(false);
  const [formErrors, setFormErrors] = useState([]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    let profileData = {
      username: formData.username,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    };

    
    let updatedUser;

    try {
      updatedUser = await QreatorApi.saveProfile(currUser.id, profileData);
    } catch (e) {
      setFormErrors(e);
      console.log(formErrors);
      return;
    }

    setFormData(f => ({ ...f, password: "" }));
    setFormErrors([]);

    // update currentUser with new profile information
    setCurrUser(updatedUser);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleChange = e => {
    const {name, value} = e.target;
    setFormData(fData => ({
      ...fData,
      [name]: value
    }));
    setFormErrors([]);
  };

  const isFormValid = Object.values(formData).every(Boolean);

  return (
    <div className='profile'>
      <h2>Profile</h2>
      {showAlert && <div style={{color: 'green'}}>Changes saved successfully</div>}
      <form onSubmit={handleSubmit}>
          <label htmlFor='firstName'>- First Name -</label>
          <input
          id='firstName'
          name='firstName'
          placeholder='First Name'
          value={formData.firstName}
          onChange={handleChange}
          />
          <label htmlFor='lastName'>- Last Name -</label>
          <input
          id='lastName'
          name='lastName'
          placeholder='Last Name'
          value={formData.lastName}
          onChange={handleChange}
          />
          <label htmlFor='email'>- E-mail -</label>
          <input
          id='email'
          name='email'
          placeholder='E-mail'
          value={formData.email}
          onChange={handleChange}
          />
          <label htmlFor='username'>- Username -</label>
          <input
          id='username'
          name='username'
          placeholder='Username'
          value={formData.username}
          onChange={handleChange}
          />
          <label htmlFor='Password'>- Password (Required) -</label>
          <input
          id='password'
          type='password'
          name='password'
          placeholder='Password'
          value={formData.password}
          onChange={handleChange}
          />
          <button disabled={!isFormValid}>Save Changes</button>
      </form>

    </div>
  )
}

export default Profile;